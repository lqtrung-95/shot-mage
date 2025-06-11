## 📸 ShotMate – AI-Powered Photo Guidance App

ShotMate giúp người dùng chụp ảnh đẹp hơn bằng cách hướng dẫn tư thế, căn góc, ánh sáng và biểu cảm – với hỗ trợ AR, AI pose detection và pose mẫu cá nhân.

## 📦 **Tính năng chính (Core Features)**

### 1. **Chụp ảnh có hướng dẫn (Guided Shot)**

- Gợi ý góc mặt, tư thế, biểu cảm dựa trên mục tiêu chụp (CV, nghệ thuật, đời thường).
- Live camera với khung căn chỉnh (grid / highlight).

### 2. **Tải pose mẫu & căn góc theo mẫu (Pose Matching)**

- User tải lên pose mẫu từ thư viện hoặc chụp mới.
- App phân tích góc mặt, khoảng cách, bố cục bằng AI/pose estimation.
- Camera hiển thị overlay pose (ghost model) → hướng dẫn căn chỉnh theo mẫu.

### 3. **Gợi ý tư thế & mẹo chụp ảnh (Pose & Tips Library)**

- Danh sách pose theo từng mục tiêu (profile, standing, sitting, aesthetic...).
- Gợi ý theo kiểu gương mặt, dáng người, giới tính.
- Mẹo chọn ánh sáng, bố cục, phối đồ, thần thái.

### 4. **Xem lại ảnh & chia sẻ**

- Xem preview sau khi chụp.
- Lưu ảnh vào thư viện.
- Chia sẻ nhanh qua mạng xã hội.

### 5. **Tùy chỉnh cá nhân**

- Lưu pose mẫu yêu thích.
- Chế độ tối/sáng.
- Thống kê ảnh đã chụp, góc phù hợp nhất.

### 6. **AR Pose Detection trực tiếp**

- Sử dụng camera để nhận diện pose bằng AI (MediaPipe/MoveNet).
- Overlay skeleton thời gian thực và đánh giá độ khớp so với pose mẫu.
- Feedback trực tiếp: “Adjust posture”, % giống mẫu → chụp khi đúng tư thế.

## 🔄 **Core Flows (Luồng sử dụng chính)**

### 🌟 **Flow 1: Guided Shot**

1. Home → “Take a Guided Shot”
2. Chọn mục tiêu chụp
3. Hướng dẫn tạo dáng + camera có guiding grid
4. Chụp → xem lại → lưu/chia sẻ

---

### 🖼 **Flow 2: Chụp theo pose mẫu (Pose Matching)**

1. Home → “Upload Reference”
2. Tải pose mẫu lên
3. App phân tích keypoints → overlay lên camera
4. Canh đúng tư thế → chụp → lưu/chia sẻ

---

### 🧍‍♂️ **Flow 3: Real-Time Pose Detection (AR Mode)**

1. Home → “Real-Time Pose Guide”
2. Chọn pose mẫu từ thư viện (hoặc ảnh đã lưu)
3. Mở camera → hiển thị pose skeleton trực tiếp + chỉ dẫn điều chỉnh (ví dụ: “Hạ vai trái xuống”, 85% match)
4. Khi đúng pose → chụp hoặc lưu lại làm preset

---

### 💡 **Flow 4: Khám phá thư viện tư thế**

1. Home → “Tips & Poses”
2. Duyệt pose theo style, gương mặt, dáng người
3. Xem hướng dẫn + demo → lưu vào Favorites

## 📱 **Main Screens (Các màn hình chính)**

### 🏁 **1. Onboarding & Welcome**

- **Splash Screen**
- **Onboarding Screens** (giới thiệu tính năng, swipe từng trang)

---

### 🏠 **2. Home & Navigation**

- **Home Screen**
  - 4 nút chính:
    - Take a Guided Shot
    - Upload Reference
    - Photo Tips
    - Real-Time Pose Guide

---

### 📷 **3. Guided Shot Flow**

- **Shot Type Selection Screen**
- **Live Camera (Guided Shot)**
  - Gợi ý góc, pose, grid hỗ trợ
- **Preview Result Screen**

---

### 🖼️ **4. Reference Pose Matching**

- **Upload Reference Screen**
- **Analyze Reference Pose Screen**
  - Hiển thị keypoints, hướng dẫn căn góc
- **Live Camera with Overlay Pose**
- **Preview Result Screen**

---

### 🧍‍♂️ **5. Real-Time AR Pose Detection**

- **Select Reference Pose (AR Mode)**
  - Chọn pose mẫu từ thư viện/app
- **Live Camera + AR Skeleton Overlay**
  - Nhận diện khớp pose thời gian thực
  - Feedback trực tiếp: “Good pose”, “Adjust left arm”, % matching
- **Capture/Save Result Screen**

---

### 💡 **6. Tips & Poses**

- **Tips & Poses Library** (theo style, body type, theme)
- **Pose Detail Screen** (minh hoạ + mẹo)
- **Favorites Screen** (pose đã lưu)

---

### 👤 **7. Profile & Settings**

- **Profile Overview Screen** (ảnh đã chụp, thông tin user)
- **My Reference Photos**
- **App Settings** (giao diện, feedback, ngôn ngữ...)

### Sitemap

Sơ đồ toàn bộ luồng chính trong app (có thể tra cứu để định vị màn hình hoặc chia module dev).

![ShotMate Sitemap](/public/docs/shotmate-sitemap.png)

## 🛠️ Tech Stack (Dự kiến)

### 🧩 Frontend

- **Framework**: React (Web) hoặc React Native (Mobile)
- **UI Styling**: TailwindCSS
- **State Management**: Zustand hoặc React Context
- **Routing**: React Router (Web) / React Navigation (Mobile)
- **Build & Deploy**: Vite + Vercel (Web), Expo Go (Mobile MVP)

---

### 🧠 AI & Computer Vision

#### 📌 1. Pose Estimation

| Mục đích                          | Công nghệ                                                                       | Ghi chú                             |
| --------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| Nhận diện keypoints trên cơ thể   | [MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose) | Dễ tích hợp, real-time, đa nền tảng |
| Lightweight cho mobile/web        | [MoveNet (TensorFlow.js)](https://www.tensorflow.org/js/models)                 | Rất nhanh, phù hợp với web/mobile   |
| Custom pose model (giai đoạn sau) | OpenPose / BlazePose                                                            | Dùng cho ứng dụng chuyên sâu hơn    |

#### 📌 2. So sánh pose với ảnh mẫu

- Tính **cosine similarity** giữa các vector keypoints
- Sử dụng `@tensorflow-models/pose-detection` hoặc viết logic custom đơn giản

#### 📌 3. Gợi ý góc mặt & biểu cảm

- Model landmark như **MediaPipe FaceMesh**
- Hoặc tích hợp AI API (Replicate / Hugging Face) cho phân tích sâu

#### 📌 4. Feedback AR thời gian thực

- Overlay bằng HTML5 Canvas hoặc WebAR/WebXR (nếu mở rộng)
- Highlight sai lệch theo vị trí từng khớp (real-time)

---

### ☁️ Backend & Storage

- **Firebase** (Authentication, Firestore, Storage)
- **Supabase** (có thể thay thế Firebase nếu cần open-source)
- Lưu preset pose, dữ liệu người dùng, ảnh mẫu

---

### ⚙️ Dev Tools

- **Cursor** (AI coding support)
- **Figma** (wireframe, UI prototype)
- **GitHub** (quản lý version & issue tracking)
