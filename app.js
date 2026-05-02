import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CATALOGUE = [
  { id: 1, name: 'Amul Taaza Milk', price: 64, weight: '1L', category: 'Dairy' },
  { id: 2, name: 'Brown Bread', price: 45, weight: '400g', category: 'Bakery' },
  { id: 3, name: 'Potato (Aloo)', price: 30, weight: '1kg', category: 'Vegetables' },
  { id: 4, name: 'Coca Cola', price: 95, weight: '2L', category: 'Drinks' },
  { id: 5, name: 'Lays Magic Masala', price: 20, weight: '50g', category: 'Snacks' },
];

export default function App() {
  const [cart, setCart] = useState({});
  const [cartVisible, setCartVisible] = useState(false);

  const updateQty = (id, change) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [id]: newQty };
    });
  };

  const cartItems = CATALOGUE.filter(item => cart[item.id] > 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const itemTotal = CATALOGUE.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);
  const deliveryFee = 25; 

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER - Timer Removed */}
      <View style={styles.header}>
        <Text style={styles.logo}>GrociGO</Text>
        <Text style={styles.storeSub}>Direct from our local store to your door</Text>
        <TextInput style={styles.searchBar} placeholder="Search groceries..." />
      </View>

      <FlatList
        data={CATALOGUE}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.itemSlot}>
            <View style={styles.imageFrame}><Text style={{fontSize: 30}}>📦</Text></View>
            <View style={styles.infoFrame}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemWeight}>{item.weight}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => updateQty(item.id, 1)}>
                   <Text style={styles.addBtnText}>{cart[item.id] > 0 ? `Qty: ${cart[item.id]}` : 'ADD'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* FOOTER BAR */}
      {totalItems > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => setCartVisible(true)}>
          <View>
            <Text style={styles.cartCount}>{totalItems} ITEMS</Text>
            <Text style={styles.cartTotal}>₹{itemTotal} ➔</Text>
          </View>
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      )}

      {/* VIEW CART MODAL */}
      <Modal visible={cartVisible} animationType="slide">
        <SafeAreaView style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Order</Text>
            <View style={{width: 50}} />
          </View>

          <ScrollView style={{padding: 15}}>
            <Text style={styles.sectionLabel}>Items</Text>
            {cartItems.map(item => (
              <View key={item.id} style={styles.billItem}>
                <Text>{item.name} x {cart[item.id]}</Text>
                <Text>₹{item.price * cart[item.id]}</Text>
              </View>
            ))}

            <View style={styles.billSummaryBox}>
              <Text style={styles.sectionLabel}>Bill Summary</Text>
              <View style={styles.summaryRow}><Text>Item Total</Text><Text>₹{itemTotal}</Text></View>
              <View style={styles.summaryRow}><Text>Delivery Fee</Text><Text>₹{deliveryFee}</Text></View>
              <View style={styles.grandTotalRow}>
                <Text style={styles.totalText}>Total to Pay</Text>
                <Text style={styles.totalText}>₹{itemTotal + deliveryFee}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.placeOrderBtn} onPress={() => alert("Order Placed! The store will assign a rider shortly.")}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  logo: { fontSize: 28, fontWeight: '900', color: '#F7CB45' },
  storeSub: { fontSize: 13, color: '#666', marginTop: 2 },
  searchBar: { backgroundColor: '#F1F2F4', padding: 12, borderRadius: 10, marginTop: 12 },
  
  itemSlot: { width: width / 2 - 20, margin: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  imageFrame: { height: 100, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center' },
  infoFrame: { padding: 10 },
  itemName: { fontSize: 13, fontWeight: 'bold' },
  itemWeight: { fontSize: 11, color: '#888' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  itemPrice: { fontSize: 14, fontWeight: '900' },
  addBtn: { borderWidth: 1, borderColor: '#FF3269', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  addBtnText: { color: '#FF3269', fontWeight: 'bold', fontSize: 10 },

  cartBar: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#0C831F', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartTotal: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cartCount: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  viewCartText: { color: '#fff', fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: '#F3F4F6' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  backBtn: { color: '#0C831F', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  billItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 2, borderRadius: 4 },
  billSummaryBox: { marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  placeOrderBtn: { margin: 20, backgroundColor: '#0C831F', padding: 20, borderRadius: 12, alignItems: 'center' },
  placeOrderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});