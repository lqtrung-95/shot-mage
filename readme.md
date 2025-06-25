# 📸 ShotMate

**Your smart pose and framing assistant.**

ShotMate is a mobile app that helps users take better self-portraits or casual photos by providing pose overlay guides directly in the camera — without the need for heavy AI or AR processing. Built for everyday smartphone photographers who want beautiful, well-composed shots without the hassle.

---

## ✨ Key Features (MVP)

- **Pose Overlay in Camera:**
  Let users select a pose template, then guide their shot by aligning themselves to a semi-transparent shape overlay.

- **Pose Library:**
  A curated set of pose outlines grouped by categories like standing, sitting, casual, or professional.

- **Photo Capture & Preview:**
  Users can take a photo, preview it, and save to gallery. Clean and simple.

---

## 🧱 Tech Stack

### Frontend

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [Tailwind CSS](https://tailwindcss.com/) via [`nativewind`](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/) or React Context (for state management)
- [React Navigation](https://reactnavigation.org/)

### Camera & Overlay

- `expo-camera` for native camera access
- Silhouette pose overlays using SVG or transparent PNG assets

### (Optional) Backend

- [Firebase](https://firebase.google.com/) or [Supabase](https://supabase.com/) for storing saved poses or usage analytics

---

## 🛣️ MVP Roadmap

| Phase  | Goals                                                  |
| ------ | ------------------------------------------------------ |
| Week 1 | App layout, pose selection screen                      |
| Week 2 | Camera screen with overlay integration                 |
| Week 3 | Pose flow end-to-end: select → align → capture         |
| Week 4 | Preview + save photo functionality                     |
| Week 5 | Polish UI, fix UX bugs, add visual tips                |
| Week 6 | Internal beta testing, deploy to TestFlight/Play Store |

---

## 📂 Project Structure (Planned)

```
ShotMate/
├── assets/            # Pose overlay images (SVG/PNG)
├── components/        # Shared UI components
├── screens/           # Home, Camera, Pose Selection, Preview
├── hooks/             # Custom hooks (e.g., camera logic)
├── state/             # Zustand or Context store
├── App.tsx
└── README.md
```

---

## 🙋‍♂️ Credits

Created by Lê Quốc Trung — as both a continuation of an HCI project and a passion-driven mobile app to empower everyday photographers.

> This is a solo developer project. Contributions, feedback, or pose asset designers are welcome!

---

## 📬 Contact

- Email: [tquoc6@gatech.edu](mailto:tquoc6@gatech.edu)
- GitHub: \[your-github-link-here]

---

> "Great photos don’t need great gear — just the right guidance."
