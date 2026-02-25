# MKT Wholesale - React Application

A modern, fully functional wholesale B2B marketplace built with React, featuring a beautiful UI and complete functionality for both buyers and admins.

## 🚀 Quick Start

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

## 🗄️ Supabase Setup (Realtime Database)

1. **Create `.env`** (copy from `.env.example`):
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Run schema** in Supabase SQL Editor (Dashboard → SQL Editor):
   - Open `supabase/schema.sql` and run its contents

3. **Seed database**: Admin Panel → Settings → "Seed Database" button
   - Seeds products, collections, fabric categories, users, orders, ledger, settings

4. **Realtime**: All admin CMS changes (products, collections, banners, sections, settings, orders, ledger, users) sync in realtime when Supabase is configured.

## 📱 Mobile App Setup (Capacitor)

### Install Capacitor

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

### Build for Mobile

```bash
# Build web app first
npm run build

# Sync to native projects
npm run cap:sync

# Then open in Xcode (iOS) or Android Studio (Android)
```

## 🔐 Demo Credentials

See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) for login credentials.

**Quick Login:**
- **Buyer**: Mobile `9876543210`, OTP `123456`
- **Admin**: Mobile `9999999999`, OTP `999999`

## ✨ Features

### For Buyers
- ✅ Browse products by category
- ✅ Real-time search and filtering
- ✅ Detailed product pages (2-4 images, full specs)
- ✅ MOQ-enforced cart system
- ✅ Order placement with notes
- ✅ Order status tracking with timeline
- ✅ Payment ledger with history
- ✅ Invoice download (PDF)
- ✅ OTP-based authentication

### For Admins
- ✅ Admin dashboard with real-time stats
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ User approval/rejection system
- ✅ Payment ledger management
- ✅ Settings and controls

### Technical Features
- ✅ React 18 with modern hooks
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Responsive design (mobile-first)
- ✅ Modern CSS with animations
- ✅ Capacitor ready for iOS/Android
- ✅ LocalStorage for demo data
- ✅ Real-time updates

## 📁 Project Structure

```
react-app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── Ledger.jsx
│   │   └── admin/        # Admin pages
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design Features

- Modern gradient designs
- Smooth animations and transitions
- Professional B2B appearance
- Mobile-responsive
- Dark/light theme ready
- Accessible UI components

## 🔧 Technology Stack

- **React 18** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool
- **Capacitor** - Mobile app framework
- **React Icons** - Icon library
- **jsPDF** - PDF generation for invoices

## 📝 Requirements Implementation

All client requirements are fully implemented:

1. ✅ Public app with registration
2. ✅ MOQ system (enforced)
3. ✅ Retail orders blocked
4. ✅ Product categories & sub-categories
5. ✅ Detailed product pages
6. ✅ Search & filter
7. ✅ Cart & order system
8. ✅ Order status tracking
9. ✅ Billing & invoices
10. ✅ Payment ledger
11. ✅ Admin panel
12. ✅ Notifications
13. ✅ Modern UI design

## 🚀 Deployment

### Web Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Mobile App Deployment

1. Build web app: `npm run build`
2. Sync to native: `npm run cap:sync`
3. Open in Xcode/Android Studio
4. Build and deploy to App Store/Play Store

## 📞 Support

For issues or questions, please refer to:
- [Demo Credentials](./DEMO_CREDENTIALS.md)
- Project documentation
- Client requirements document

---

**Built with ❤️ for MKT Wholesale**
