import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';

// Process an image to create a silhouette
export async function processImageForSilhouette(imageUri: string) {
  try {
    // Process the image to make it compatible
    const processedImage = await manipulateAsync(
      imageUri,
      [{ resize: { width: 300, height: 400 } }],
      { format: SaveFormat.JPEG }
    );

    // Get image dimensions
    const { width, height } = await new Promise<{
      width: number;
      height: number;
    }>((resolve) => {
      Image.getSize(processedImage.uri, (width, height) => {
        resolve({ width, height });
      });
    });

    // Generate a unique seed based on the image URI
    const seed = generateSeedFromString(imageUri);
    const randomGenerator = createRandomGenerator(seed);

    // Create a pose silhouette based on the image dimensions and a consistent random seed
    const silhouetteData = generatePoseSilhouette(
      width,
      height,
      randomGenerator
    );

    return {
      processedImageUri: processedImage.uri,
      silhouetteData,
      rawPose: null, // No actual pose detection is happening
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Create a seeded random number generator
function createRandomGenerator(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate a numeric seed from a string
function generateSeedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate a pose silhouette
function generatePoseSilhouette(
  width: number,
  height: number,
  randomGenerator: () => number
) {
  // Center coordinates with slight random variation
  const centerX = width / 2 + (randomGenerator() * width * 0.1 - width * 0.05);
  const centerY =
    height / 2 + (randomGenerator() * height * 0.1 - height * 0.05);

  // Determine if the pose should be front-facing or side-facing
  const isFrontFacing = randomGenerator() > 0.4; // 60% chance of front-facing

  // Determine if side-facing poses face left or right
  const facingRight = randomGenerator() > 0.5;

  // Basic dimensions with slight random variations
  const headRadius =
    Math.min(width, height) * (0.06 + randomGenerator() * 0.01);
  const bodyHeight = height * (0.4 + randomGenerator() * 0.05);
  const shoulderWidth = width * (0.25 + randomGenerator() * 0.05);
  const hipWidth = shoulderWidth * (0.7 + randomGenerator() * 0.1);

  // Vertical position of the head (higher = head closer to top)
  const headPositionY = height * (0.2 + randomGenerator() * 0.05);

  // Create circles array for joints
  const circles: { cx: number; cy: number; r: number }[] = [];

  // Create paths array for body segments
  const paths: string[] = [];

  if (isFrontFacing) {
    // Front-facing pose

    // Head
    const headCenterY = centerY - headPositionY;
    circles.push({ cx: centerX, cy: headCenterY, r: headRadius });
    paths.push(
      `M${centerX},${headCenterY} a${headRadius},${headRadius} 0 1,0 0.1,0 z`
    );

    // Shoulders
    const leftShoulderX = centerX - shoulderWidth / 2;
    const rightShoulderX = centerX + shoulderWidth / 2;
    const shoulderY = headCenterY + headRadius * 1.2;
    circles.push({ cx: leftShoulderX, cy: shoulderY, r: 5 });
    circles.push({ cx: rightShoulderX, cy: shoulderY, r: 5 });

    // Hips
    const leftHipX = centerX - hipWidth / 2;
    const rightHipX = centerX + hipWidth / 2;
    const hipY = shoulderY + bodyHeight;
    circles.push({ cx: leftHipX, cy: hipY, r: 5 });
    circles.push({ cx: rightHipX, cy: hipY, r: 5 });

    // Torso
    paths.push(`M${leftShoulderX},${shoulderY} 
      L${rightShoulderX},${shoulderY} 
      L${rightHipX},${hipY} 
      L${leftHipX},${hipY} 
      Z`);

    // Arms with random poses
    const leftArmAngle = Math.PI * (0.6 + randomGenerator() * 0.8); // Between 0.6π and 1.4π
    const rightArmAngle = Math.PI * (1.6 + randomGenerator() * 0.8); // Between 1.6π and 2.4π

    // Left arm
    const leftElbowX =
      leftShoulderX - Math.cos(leftArmAngle) * shoulderWidth * 0.4;
    const leftElbowY = shoulderY + Math.sin(leftArmAngle) * shoulderWidth * 0.4;
    circles.push({ cx: leftElbowX, cy: leftElbowY, r: 4 });

    const leftWristX =
      leftElbowX - Math.cos(leftArmAngle) * shoulderWidth * 0.5;
    const leftWristY =
      leftElbowY + Math.sin(leftArmAngle) * shoulderWidth * 0.5;
    circles.push({ cx: leftWristX, cy: leftWristY, r: 4 });

    paths.push(`M${leftShoulderX},${shoulderY} L${leftElbowX},${leftElbowY}`);
    paths.push(`M${leftElbowX},${leftElbowY} L${leftWristX},${leftWristY}`);

    // Right arm
    const rightElbowX =
      rightShoulderX + Math.cos(rightArmAngle) * shoulderWidth * 0.4;
    const rightElbowY =
      shoulderY + Math.sin(rightArmAngle) * shoulderWidth * 0.4;
    circles.push({ cx: rightElbowX, cy: rightElbowY, r: 4 });

    const rightWristX =
      rightElbowX + Math.cos(rightArmAngle) * shoulderWidth * 0.5;
    const rightWristY =
      rightElbowY + Math.sin(rightArmAngle) * shoulderWidth * 0.5;
    circles.push({ cx: rightWristX, cy: rightWristY, r: 4 });

    paths.push(
      `M${rightShoulderX},${shoulderY} L${rightElbowX},${rightElbowY}`
    );
    paths.push(`M${rightElbowX},${rightElbowY} L${rightWristX},${rightWristY}`);

    // Legs with slight random variation
    const legSpread = randomGenerator() * 0.2; // How far apart the legs are

    // Left leg
    const leftKneeX = leftHipX - hipWidth * legSpread;
    const leftKneeY = hipY + bodyHeight * 0.35;
    circles.push({ cx: leftKneeX, cy: leftKneeY, r: 4 });

    const leftAnkleX = leftKneeX - hipWidth * legSpread;
    const leftAnkleY = hipY + bodyHeight * 0.7;
    circles.push({ cx: leftAnkleX, cy: leftAnkleY, r: 4 });

    paths.push(`M${leftHipX},${hipY} L${leftKneeX},${leftKneeY}`);
    paths.push(`M${leftKneeX},${leftKneeY} L${leftAnkleX},${leftAnkleY}`);

    // Right leg
    const rightKneeX = rightHipX + hipWidth * legSpread;
    const rightKneeY = hipY + bodyHeight * 0.35;
    circles.push({ cx: rightKneeX, cy: rightKneeY, r: 4 });

    const rightAnkleX = rightKneeX + hipWidth * legSpread;
    const rightAnkleY = hipY + bodyHeight * 0.7;
    circles.push({ cx: rightAnkleX, cy: rightAnkleY, r: 4 });

    paths.push(`M${rightHipX},${hipY} L${rightKneeX},${rightKneeY}`);
    paths.push(`M${rightKneeX},${rightKneeY} L${rightAnkleX},${rightAnkleY}`);
  } else {
    // Side-facing pose
    const direction = facingRight ? 1 : -1;

    // Head
    const headCenterY = centerY - headPositionY;
    const headCenterX = centerX + direction * width * 0.02; // Slight offset for side view
    circles.push({ cx: headCenterX, cy: headCenterY, r: headRadius });
    paths.push(
      `M${headCenterX},${headCenterY} a${headRadius},${headRadius} 0 1,0 0.1,0 z`
    );

    // Narrower body for side view
    const bodyWidth = shoulderWidth * 0.4;

    // Shoulders (front and back in side view)
    const frontShoulderX = headCenterX + (direction * bodyWidth) / 2;
    const backShoulderX = headCenterX - (direction * bodyWidth) / 2;
    const shoulderY = headCenterY + headRadius * 1.2;
    circles.push({ cx: frontShoulderX, cy: shoulderY, r: 5 });
    circles.push({ cx: backShoulderX, cy: shoulderY, r: 5 });

    // Hips (front and back in side view)
    const frontHipX = headCenterX + (direction * bodyWidth) / 2;
    const backHipX = headCenterX - (direction * bodyWidth) / 2;
    const hipY = shoulderY + bodyHeight;
    circles.push({ cx: frontHipX, cy: hipY, r: 5 });
    circles.push({ cx: backHipX, cy: hipY, r: 5 });

    // Torso
    paths.push(`M${backShoulderX},${shoulderY} 
      L${frontShoulderX},${shoulderY} 
      L${frontHipX},${hipY} 
      L${backHipX},${hipY} 
      Z`);

    // Arms with random poses - for side view, one arm is more visible
    const visibleArmAngle = Math.PI * (0.8 + randomGenerator() * 0.4); // Between 0.8π and 1.2π

    // Visible arm (front)
    const elbowX = frontShoulderX + direction * shoulderWidth * 0.3;
    const elbowY = shoulderY + shoulderWidth * 0.3;
    circles.push({ cx: elbowX, cy: elbowY, r: 4 });

    const wristX = elbowX + direction * shoulderWidth * 0.4;
    const wristY = elbowY + shoulderWidth * 0.1;
    circles.push({ cx: wristX, cy: wristY, r: 4 });

    paths.push(`M${frontShoulderX},${shoulderY} L${elbowX},${elbowY}`);
    paths.push(`M${elbowX},${elbowY} L${wristX},${wristY}`);

    // Legs in walking position
    const frontLegBend = randomGenerator() * 0.3; // How much the front leg is bent
    const backLegBend = randomGenerator() * 0.2; // How much the back leg is bent

    // Front leg
    const frontKneeX = frontHipX + direction * hipWidth * 0.2;
    const frontKneeY = hipY + bodyHeight * 0.35;
    circles.push({ cx: frontKneeX, cy: frontKneeY, r: 4 });

    const frontAnkleX = frontKneeX + direction * hipWidth * 0.3;
    const frontAnkleY = hipY + bodyHeight * 0.7;
    circles.push({ cx: frontAnkleX, cy: frontAnkleY, r: 4 });

    paths.push(`M${frontHipX},${hipY} L${frontKneeX},${frontKneeY}`);
    paths.push(`M${frontKneeX},${frontKneeY} L${frontAnkleX},${frontAnkleY}`);

    // Back leg
    const backKneeX = backHipX - direction * hipWidth * 0.1;
    const backKneeY = hipY + bodyHeight * 0.35;
    circles.push({ cx: backKneeX, cy: backKneeY, r: 4 });

    const backAnkleX = backKneeX - direction * hipWidth * 0.2;
    const backAnkleY = hipY + bodyHeight * 0.7;
    circles.push({ cx: backAnkleX, cy: backAnkleY, r: 4 });

    paths.push(`M${backHipX},${hipY} L${backKneeX},${backKneeY}`);
    paths.push(`M${backKneeX},${backKneeY} L${backAnkleX},${backAnkleY}`);
  }

  return { paths, circles };
}
