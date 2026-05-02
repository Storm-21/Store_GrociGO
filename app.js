const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- 1. STORE CONFIGURATION ---
const STORE_LOCATION = { lat: 25.4358, lng: 81.8463 }; // Your shop's coordinates
const DELIVERY_RADIUS_KM = 5;

// --- 2. DATA STORAGE (In-Memory for now) ---
let products = [
  { id: 1, name: 'Amul Taaza Milk', price: 64, weight: '1L', category: 'Dairy', inStock: true },
  { id: 2, name: 'Brown Bread', price: 45, weight: '400g', category: 'Bakery', inStock: true },
  { id: 3, name: 'Potato (Aloo)', price: 30, weight: '1kg', category: 'Vegetables', inStock: true },
  { id: 4, name: 'Coca Cola', price: 95, weight: '2L', category: 'Drinks', inStock: true },
  { id: 5, name: 'Lays Magic Masala', price: 20, weight: '50g', category: 'Snacks', inStock: true },
];

let orders = []; // Stores all customer orders

// --- 3. UTILITY: Distance Calculator (Haversine) ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// --- 4. CUSTOMER ENDPOINTS ---

// Fetch Catalogue
app.get('/api/products', (req, res) => {
  res.json(products.filter(p => p.inStock));
});

// Place Order
app.post('/api/checkout', (req, res) => {
  const { userLocation, cartItems, totalAmount, customerName } = req.body;
  
  // Check Distance
  const distance = getDistance(
    STORE_LOCATION.lat, STORE_LOCATION.lng, 
    userLocation.lat, userLocation.lng
  );

  if (distance > DELIVERY_RADIUS_KM) {
    return res.status(400).json({ error: "Location outside our 5km delivery zone." });
  }

  // Create Order Object
  const newOrder = {
    id: orders.length + 1001,
    customerName: customerName || "Guest User",
    items: cartItems,
    total: totalAmount,
    status: 'Pending', // Pending -> Packed -> Out for Delivery -> Delivered
    assignedRider: null,
    timestamp: new Date().toISOString()
  };

  orders.push(newOrder);
  console.log(`New Order #${newOrder.id} received!`);
  res.json({ success: true, order: newOrder });
});

// --- 5. ADMIN ENDPOINTS ---

// Fetch all orders for the Dashboard
app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

// Assign a Rider & Update Status
app.post('/api/admin/assign-rider', (req, res) => {
  const { orderId, riderName } = req.body;
  
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].assignedRider = riderName;
    orders[orderIndex].status = 'Out for Delivery';
    return res.json({ success: true, message: `Assigned to ${riderName}` });
  }
  
  res.status(404).json({ error: "Order not found" });
});

// Toggle Stock Availability
app.post('/api/admin/toggle-stock', (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (product) {
    product.inStock = !product.inStock;
    return res.json({ success: true, inStock: product.inStock });
  }
  res.status(404).json({ error: "Product not found" });
});

// --- 6. START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GrociGO Server running on http://localhost:${PORT}`);
});
