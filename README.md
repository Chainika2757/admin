# Mahek Saree — Admin Panel

Admin dashboard for managing the Mahek Saree product catalog.

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS 3**
- **Firebase** (Auth, Firestore)
- **Cloudinary** (image uploads, optional — URL input available as fallback)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

The `.env` file is already pre-filled with your Firebase config. Update as needed.

For image uploads via Cloudinary (optional):
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload → Upload Presets → Add unsigned preset**
3. Update `.env`:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
   ```
   If not configured, you can still add images via URL.

### 3. Create admin user

Go to the [Firebase Console](https://console.firebase.google.com) → Authentication → Users → Add user (email/password).

### 4. Run locally

```bash
npm run dev
```

Opens on [http://localhost:5173](http://localhost:5173)

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set **Framework Preset** to `Vite`
4. Add all `VITE_*` environment variables from `.env`
5. Deploy

## Folder Structure

```
src/
├── components/      # Reusable UI components
│   ├── ImageUploader.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   └── Sidebar.jsx
├── context/         # Auth state management
│   └── AuthContext.jsx
├── pages/           # Route-level pages
│   ├── Categories.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Products.jsx
├── App.jsx          # Routing
├── firebase.js      # Firebase init
├── index.css        # Global styles
└── main.jsx         # Entry point
```
