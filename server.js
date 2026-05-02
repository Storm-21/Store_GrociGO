const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. CONFIGURATION: Your Store Details
const STORE_LOCATION = { lat: 25.4358, lng: 81.8463 }; // Replace with your shop's actual Lat/Lng
const DELIVERY_RADIUS_KM = 5;

// 2. MOCK DATA
const products = [
  { id: 1, name: 'Farm Fresh Eggs (6pcs)', price: 60, category: 'Dairy' },
  { id: 2, name: 'Atta 5kg', price: 210, category: 'Atta & Rice' },
  { id: 3, name: 'Milk 1L', price: 64, category: 'Dairy' }
];

// 3. UTILITY: Distance Calculator (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// 4. ENDPOINTS
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/checkout', (req, res) => {
  const { userLocation, cartItems } = req.body;
  
  const distance = getDistance(
    STORE_LOCATION.lat, STORE_LOCATION.lng, 
    userLocation.lat, userLocation.lng
  );

  if (distance > DELIVERY_RADIUS_KM) {
    return res.status(400).json({ error: "Out of service area (Max 5km)" });
  }

  // Create order with "PENDING_ASSIGNMENT" status
  const orderId = Math.floor(1000 + Math.random() * 9000);
  res.json({ success: true, orderId, message: "Order sent to GrociGO Store!" });
});

app.listen(3000, () => console.log('GrociGO Backend on Port 3000'));