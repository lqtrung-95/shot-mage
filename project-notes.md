## 📸 ShotMate – AI-Powered Photo Guidance App

ShotMate helps users take better photos by guiding them with pose suggestions, framing, lighting, and expression — supported by AR overlays, AI pose detection, and personalized reference poses.

## 📦 Core Features

### 1. Guided Shot

- Suggests facial angles, body poses, and expressions based on shooting goal (e.g., CV, artistic, casual).
- Live camera with guiding grid and framing overlays.

### 2. Pose Matching with Reference

- Users upload or capture a reference pose image.
- App analyzes face angle, body distance, and composition using AI pose estimation.
- Camera overlays the reference pose as a ghost model for live alignment.

### 3. Pose & Tips Library

- Curated pose collections based on themes: profile, standing, sitting, aesthetic, etc.
- Suggestions based on face shape, body type, and gender.
- Tips for lighting, expression, outfit coordination, and posture.

### 4. Photo Preview & Share

- Review captured photos.
- Save to gallery or quickly share on social media.

### 5. Personalization

- Save favorite reference poses.
- Toggle light/dark theme.
- Track photo stats, most flattering angles.

### 6. Real-Time AR Pose Detection

- Uses live camera with AI (MediaPipe / MoveNet) to detect body pose.
- Displays real-time skeleton overlay and pose match percentage.
- Feedback: "Adjust posture", "Turn head left", etc. → capture when match is high.

## 🔄 Core Flows

### 🌟 Flow 1: Guided Shot

1. Home → "Take a Guided Shot"
2. Select photo goal
3. Pose suggestions + camera with grid/guide
4. Capture → Preview → Save/Share

---

### 🖼 Flow 2: Pose Matching

1. Home → "Upload Reference"
2. Upload a pose reference image
3. App analyzes and overlays keypoints
4. Align → Capture → Save/Share

---

### 🧍‍♂️ Flow 3: AR Pose Detection

1. Home → "Real-Time Pose Guide"
2. Select a pose from library or saved
3. Live camera with skeleton overlay + adjustment hints (e.g. "Lower left shoulder", 85% match)
4. Capture or save preset

---

### 💡 Flow 4: Tips & Pose Exploration

1. Home → "Tips & Poses"
2. Browse poses by style, face/body type
3. Read instructions and visual tips
4. Save to Favorites

## 📱 Main Screens

### 🏁 1. Onboarding & Welcome

- Splash Screen
- Onboarding Screens (feature intro, swipe walkthrough)

---

### 🏠 2. Home & Navigation

- Home Screen with 4 main actions:

  - Take a Guided Shot
  - Upload Reference
  - Photo Tips
  - Real-Time Pose Guide

---

### 📷 3. Guided Shot Flow

- Shot Type Selection Screen
- Live Guided Camera View
- Preview & Save Result

---

### 🖼️ 4. Pose Matching Flow

- Upload Reference Screen
- Analyze Pose Screen (show keypoints + tips)
- Live Camera Overlay View
- Preview Result Screen

---

### 🧍‍♂️ 5. Real-Time AR Pose Detection

- Select Pose Screen
- Live Camera + Skeleton Overlay
- Real-Time Feedback
- Save or Capture Screen

---

### 💡 6. Tips & Poses

- Pose Library
- Pose Detail Screen (visual + explanation)
- Favorites Collection

---

### 👤 7. Profile & Settings

- Profile Overview
- My Reference Photos
- App Settings (theme, feedback, language)

## 🗺️ Sitemap

Overview of key flows and screen hierarchy in the app.

![ShotMate Sitemap](/public/docs/shotmate-sitemap.png)

## 🛠️ Tech Stack (Planned)

### 🧩 Frontend

- **Framework**: React (Web) or React Native (Mobile)
- **UI Styling**: TailwindCSS
- **State Management**: Zustand or React Context
- **Routing**: React Router (Web) / React Navigation (Mobile)
- **Build & Deploy**: Vite + Vercel (Web), Expo Go (Mobile MVP)

---

### 🧠 AI & Computer Vision

#### 📌 1. Pose Estimation

| Purpose                       | Technology                                                                      | Notes                                  |
| ----------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| Detect body keypoints         | [MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose) | Real-time, cross-platform, easy to use |
| Lightweight for mobile/web    | [MoveNet (TensorFlow.js)](https://www.tensorflow.org/js/models)                 | Fast and suitable for browser/mobile   |
| Advanced/custom pose matching | OpenPose / BlazePose                                                            | For future expansion                   |

#### 📌 2. Pose Similarity Matching

- Use **cosine similarity** between keypoint vectors
- Can use `@tensorflow-models/pose-detection` or implement custom logic

#### 📌 3. Face Angle & Expression Analysis

- Use face landmark models like **MediaPipe FaceMesh**
- Or integrate with APIs (Replicate, Hugging Face) for deeper expression analysis

#### 📌 4. Real-Time Feedback with AR

- Render overlays using HTML5 Canvas / WebXR / Three.js
- Highlight joints or posture deviation during alignment

---

### ☁️ Backend & Storage

- **Firebase** (Authentication, Firestore, Storage)
- **Supabase** (open-source alternative to Firebase)
- Store user poses, stats, and reference images

---

### ⚙️ Dev Tools

- **Cursor** (AI-assisted coding)
- **Figma** (wireframe & UI prototyping)
- **GitHub** (version control & issue tracking)
