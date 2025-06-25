import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface PoseSilhouetteProps {
  silhouette?: {
    paths: string[];
    circles: { cx: number; cy: number; r: number }[];
  };
  paths?: string[];
  circles?: { cx: number; cy: number; r: number }[];
  width?: number;
  height?: number;
  opacity?: number;
  color?: string;
  strokeWidth?: number;
  editable?: boolean;
  onPoseChange?: (circles: { cx: number; cy: number; r: number }[]) => void;
}

const PoseSilhouette: React.FC<PoseSilhouetteProps> = ({
  silhouette,
  paths: propPaths,
  circles: propCircles,
  width = 300,
  height = 400,
  opacity = 0.8,
  color = '#3B82F6',
  strokeWidth = 2,
  editable = false,
  onPoseChange,
}) => {
  // Use either the silhouette object or the individual props
  const paths = silhouette ? silhouette.paths : propPaths || [];
  const circles = silhouette ? silhouette.circles : propCircles || [];

  // Create a state to track the draggable circles
  const [dragPoints, setDragPoints] =
    useState<{ cx: number; cy: number; r: number }[]>(circles);
  const [activeDragPointIndex, setActiveDragPointIndex] = useState<
    number | null
  >(null);

  // Create pan responder for dragging points
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Find which point was touched
        const { locationX, locationY } = evt.nativeEvent;

        // Check if any circle was touched
        const touchedPointIndex = dragPoints.findIndex((point) => {
          const distance = Math.sqrt(
            Math.pow(point.cx - locationX, 2) +
              Math.pow(point.cy - locationY, 2)
          );
          return distance <= point.r * 2; // Make touch area a bit larger than the circle
        });

        if (touchedPointIndex !== -1) {
          setActiveDragPointIndex(touchedPointIndex);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (activeDragPointIndex !== null) {
          // Update the position of the active point
          const updatedPoints = [...dragPoints];
          updatedPoints[activeDragPointIndex] = {
            ...updatedPoints[activeDragPointIndex],
            cx: Math.max(0, Math.min(width, gestureState.moveX)),
            cy: Math.max(0, Math.min(height, gestureState.moveY)),
          };

          setDragPoints(updatedPoints);

          // Notify parent component of the change
          if (onPoseChange) {
            onPoseChange(updatedPoints);
          }
        }
      },
      onPanResponderRelease: () => {
        setActiveDragPointIndex(null);
      },
      onPanResponderTerminate: () => {
        setActiveDragPointIndex(null);
      },
    })
  ).current;

  // Function to generate paths based on the current drag points
  const generatePaths = () => {
    if (!editable || dragPoints.length < 8) {
      return paths;
    }

    // In editable mode, we'll regenerate the paths based on the drag points
    // This is a simplified version - a more advanced implementation would
    // need to handle all the different pose types

    // Assuming standard pose points ordering:
    // 0: Head
    // 1-2: Shoulders
    // 3-4: Hands
    // 5-6: Hips
    // 7-8: Feet

    const head = dragPoints[0];
    const leftShoulder = dragPoints[1];
    const rightShoulder = dragPoints[2];
    const leftHand = dragPoints[3];
    const rightHand = dragPoints[4];
    const leftHip = dragPoints[5];
    const rightHip = dragPoints[6];
    const leftFoot = dragPoints[7];
    const rightFoot = dragPoints[8];

    const newPaths = [
      // Head
      `M${head.cx},${head.cy} a${head.r},${head.r} 0 1,0 0.1,0 z`,

      // Torso
      `M${leftShoulder.cx},${leftShoulder.cy} 
       L${rightShoulder.cx},${rightShoulder.cy} 
       L${rightHip.cx},${rightHip.cy} 
       L${leftHip.cx},${leftHip.cy} 
       Z`,

      // Left arm
      `M${leftShoulder.cx},${leftShoulder.cy} 
       L${leftHand.cx},${leftHand.cy}`,

      // Right arm
      `M${rightShoulder.cx},${rightShoulder.cy} 
       L${rightHand.cx},${rightHand.cy}`,

      // Left leg
      `M${leftHip.cx},${leftHip.cy} 
       L${leftFoot.cx},${leftFoot.cy}`,

      // Right leg
      `M${rightHip.cx},${rightHip.cy} 
       L${rightFoot.cx},${rightFoot.cy}`,
    ];

    return newPaths;
  };

  return (
    <View
      style={[styles.container, { width, height }]}
      {...(editable ? panResponder.panHandlers : {})}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Draw paths (body parts) */}
        {generatePaths().map((d: string, index: number) => (
          <Path
            key={`path-${index}`}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={opacity}
          />
        ))}

        {/* Draw circles (joints) */}
        {(editable ? dragPoints : circles).map(
          (circle: { cx: number; cy: number; r: number }, index: number) => (
            <Circle
              key={`circle-${index}`}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r + (editable ? 2 : 0)} // Make circles bigger when editable
              fill={
                editable
                  ? activeDragPointIndex === index
                    ? '#FF4500'
                    : color
                  : color
              }
              opacity={editable ? 0.9 : opacity}
              stroke={editable ? '#FFFFFF' : 'none'}
              strokeWidth={editable ? 1 : 0}
            />
          )
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default PoseSilhouette;
