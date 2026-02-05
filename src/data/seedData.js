/**
 * Seed data for testing - runs on first load if no data exists
 */

export const DUMMY_USERS = [
  {
    id: '1',
    shopName: 'Rajput Traders',
    buyerName: 'Rajesh Kumar',
    mobile: '9876543210',
    city: 'Jaipur',
    businessType: 'Dealer',
    gst: '',
    status: 'approved',
    registeredDate: '2024-01-15'
  },
  {
    id: '2',
    shopName: 'Shree Fashion',
    buyerName: 'Priya Sharma',
    mobile: '9876543211',
    city: 'Udaipur',
    businessType: 'Shop',
    gst: '08AABCT1234A1Z5',
    status: 'approved',
    registeredDate: '2024-01-20'
  },
  {
    id: '3',
    shopName: 'New Traders Co',
    buyerName: 'Amit Patel',
    mobile: '9876543212',
    city: 'Ahmedabad',
    businessType: 'Dealer',
    gst: '',
    status: 'pending',
    registeredDate: '2024-01-25'
  },
  {
    id: '4',
    shopName: 'Royal Garments',
    buyerName: 'Sneha Mehta',
    mobile: '9876543213',
    city: 'Surat',
    businessType: 'Agent',
    gst: '',
    status: 'approved',
    registeredDate: '2024-01-18'
  }
]

export const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Saafa Set - Red',
    code: 'SAF-001',
    category: 'saafa',
    subCategory: 'Wedding',
    price: 450,
    moq: 50,
    stock: 'available',
    fabric: 'Premium Cotton',
    gsm: '180 GSM',
    size: '5 meters',
    colors: ['Red', 'Blue', 'Green', 'Purple'],
    images: ['https://via.placeholder.com/600x600/0C4A6E/FFFFFF?text=Premium+Saafa'],
    description: 'Premium quality saafa set for weddings.',
    use: 'Weddings, festivals',
    quality: 'Premium cotton',
    packing: '10 pcs per box'
  },
  {
    id: 2,
    name: 'Designer Odhna - Blue',
    code: 'ODH-205',
    category: 'odhna',
    subCategory: 'Premium',
    price: 680,
    moq: 20,
    stock: 'available',
    fabric: 'Silk Blend',
    gsm: '200 GSM',
    size: '2.5 meters',
    colors: ['Blue', 'Pink', 'Green'],
    images: ['https://via.placeholder.com/600x600/B45309/FFFFFF?text=Designer+Odhna'],
    description: 'Elegant designer odhna.',
    use: 'Weddings, occasions',
    quality: 'Silk blend',
    packing: '5 pcs per box'
  },
  {
    id: 3,
    name: 'Royal Rajputi Suit',
    code: 'RJS-108',
    category: 'rajputi-suit',
    subCategory: 'Wedding',
    price: 1200,
    moq: 30,
    stock: 'limited',
    fabric: 'Premium Silk',
    gsm: '220 GSM',
    size: 'Full Set',
    colors: ['Maroon', 'Gold', 'Red'],
    images: ['https://via.placeholder.com/600x600/047857/FFFFFF?text=Royal+Suit'],
    description: 'Royal Rajputi suit set.',
    use: 'Weddings',
    quality: 'Premium silk',
    packing: '1 set per box'
  }
]

export const DUMMY_ORDERS = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'partially-dispatched',
    buyerName: 'Rajesh Kumar',
    buyerMobile: '9876543210',
    items: [
      { name: 'Premium Saafa Set - Red', qty: 100, price: 450, dispatched: 100, pending: 0 },
      { name: 'Designer Odhna - Blue', qty: 50, price: 680, dispatched: 20, pending: 30 }
    ],
    total: 67600,
    notes: 'Deliver before wedding season',
    timeline: [
      { status: 'received', date: '2024-01-20', time: '10:30 AM' },
      { status: 'packed', date: '2024-01-21', time: '02:15 PM' },
      { status: 'partially-dispatched', date: '2024-01-22', time: '11:00 AM', note: '100 pcs Saafa + 20 pcs Odhna dispatched' }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'dispatched',
    buyerName: 'Priya Sharma',
    buyerMobile: '9876543211',
    items: [{ name: 'Royal Rajputi Suit', qty: 30, price: 1200, dispatched: 30, pending: 0 }],
    total: 36000,
    timeline: [
      { status: 'received', date: '2024-01-18', time: '09:00 AM' },
      { status: 'packed', date: '2024-01-19', time: '03:00 PM' },
      { status: 'dispatched', date: '2024-01-20', time: '10:00 AM' }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-22',
    status: 'received',
    buyerName: 'Sneha Mehta',
    buyerMobile: '9876543213',
    items: [{ name: 'Premium Saafa Set - Red', qty: 50, price: 450 }],
    total: 22500,
    notes: 'Urgent delivery',
    timeline: [{ status: 'received', date: '2024-01-22', time: '02:00 PM' }]
  }
]

export const DUMMY_LEDGER = [
  { id: 'TXN-001', date: '2024-01-20', type: 'bill', orderId: 'ORD-2024-001', description: 'Premium Saafa, Designer Odhna', amount: 36100, balance: 36100 },
  { id: 'TXN-002', date: '2024-01-22', type: 'payment', orderId: 'ORD-2024-001', description: 'Partial payment', amount: 20000, balance: 16100, notes: 'Cash' },
  { id: 'TXN-003', date: '2024-01-18', type: 'bill', orderId: 'ORD-2024-002', description: 'Royal Rajputi Suit', amount: 36000, balance: 52100 },
  { id: 'TXN-004', date: '2024-01-19', type: 'payment', orderId: 'ORD-2024-002', description: 'Full payment', amount: 36000, balance: 16100, notes: 'Bank transfer' }
]

export function seedDataIfNeeded() {
  if (localStorage.getItem('dataSeeded')) return

  localStorage.setItem('users', JSON.stringify(DUMMY_USERS))
  localStorage.setItem('adminProducts', JSON.stringify(DUMMY_PRODUCTS))
  localStorage.setItem('orders', JSON.stringify(DUMMY_ORDERS))
  localStorage.setItem('ledger', JSON.stringify(DUMMY_LEDGER))
  localStorage.setItem('dataSeeded', 'true')
}
