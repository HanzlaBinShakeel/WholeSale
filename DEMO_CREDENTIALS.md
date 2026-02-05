# Demo Credentials for MKT Wholesale App

## 🔐 Login Credentials

### Admin Account (Dashboard)
- **Mobile**: `9999999999`
- **OTP**: `999999`
- Access: Full admin panel — products, orders, users, payments

### Buyer Accounts
| Mobile     | OTP    | Name         | Shop            |
|------------|--------|--------------|-----------------|
| 9876543210 | 123456 | Rajesh Kumar | Rajput Traders  |
| 9876543211 | 123456 | Priya Sharma | Shree Fashion   |
| 9876543213 | 123456 | Sneha Mehta  | Royal Garments  |
- **Name**: Rajesh Kumar
- **Shop Name**: Rajput Traders
- **City**: Jaipur
- **Business Type**: Dealer

**Features Available:**
- Browse products
- Add to cart
- Place orders
- View order history
- View payment ledger
- Download invoices

---

### Admin Account (Seller/Admin)
- **Mobile Number**: `9999999999`
- **OTP**: `999999`
- **Name**: Admin User
- **Role**: Admin

**Features Available:**
- All buyer features +
- Admin Dashboard
- Product Management (Add/Edit/Delete)
- Order Management (Update status)
- User Management (Approve/Reject/Block)
- Payment Management
- Settings & Controls

---

## 📱 How to Login

1. Go to **Login** page (`/login`)
2. Enter mobile number
3. Click **"Send OTP"** (Demo mode - OTP is automatically sent)
4. Enter the OTP from above
5. Click **"Verify & Login"**

---

## 🆕 New User Registration

For testing new user registration:

1. Go to **Login** page
2. Click **"Register"** tab
3. Fill in the registration form:
   - Shop Name: Your shop name
   - Buyer Name: Your name
   - Mobile Number: Any 10-digit number
   - City: Your city
   - Business Type: Select from dropdown
   - GST Number: Optional
4. Click **"Register & Send OTP"**
5. In demo mode, registration is auto-approved

---

## 🎯 Quick Test Scenarios

### Test as Buyer:
1. Login with buyer credentials
2. Browse products
3. Add products to cart (MOQ will be enforced)
4. Place an order
5. View order status
6. Check payment ledger

### Test as Admin:
1. Login with admin credentials
2. View dashboard stats
3. Add/edit products
4. Update order statuses
5. Approve/reject users
6. Update payments

---

## ⚠️ Important Notes

- **Demo Mode**: This is a demo application. All data is stored in browser localStorage
- **OTP**: In demo mode, OTP verification is simulated. Use the OTPs mentioned above
- **Auto-Approval**: New user registrations are auto-approved in demo mode
- **Data Persistence**: Data persists in browser localStorage until cleared
- **No Backend**: This is a frontend-only demo. No actual API calls are made

---

## 🔄 Reset Demo Data

To reset all demo data:
1. Open browser Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage**
4. Delete all items
5. Refresh the page

---

## 📞 Support

For any issues or questions about demo credentials, please refer to the main README or contact support.
