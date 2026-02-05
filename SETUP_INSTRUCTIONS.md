# Setup Instructions

## ✅ Project Structure Reorganization Complete

The project has been reorganized:
- ✅ All React app files moved from `react-app/` to root directory
- ✅ Old `website/` folder (HTML/CSS/JS) has been deleted
- ✅ Project is now ready for development

## 📂 Current Project Structure

```
WholeSale/
├── src/                    # React source code
│   ├── components/         # Reusable components (Header, Footer, Routes)
│   ├── context/           # React Context providers (Auth, Cart, Notifications)
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages (Dashboard, Products, Orders, Users, Payments)
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   └── Ledger.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── capacitor.config.json  # Capacitor mobile app config
├── index.html             # HTML entry point
├── .gitignore
├── README.md              # Project documentation
└── DEMO_CREDENTIALS.md    # Demo login credentials
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 📱 Mobile App Setup (Capacitor)

```bash
# Add Capacitor platforms
npm run cap:add ios
npm run cap:add android

# Sync web assets to native projects
npm run cap:sync

# Open iOS project (Mac only)
npm run cap:open:ios

# Open Android project
npm run cap:open:android
```

## 🔐 Demo Credentials

See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) for login credentials.

**Quick Login:**
- **Buyer**: Mobile `9876543210`, OTP `123456`
- **Admin**: Mobile `9999999999`, OTP `999999`

---

**Note:** This is a React-based wholesale B2B marketplace application with full admin and buyer functionality.
