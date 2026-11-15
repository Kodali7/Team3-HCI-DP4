import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomNav from './components/BottomNav';
import TruckManagementScreen from './screens/TruckManagementScreen';
import InventoryScreen from './screens/InventoryScreen';
import DishScreen, { INITIAL_DISHES } from './screens/DishScreen';
import RestockScreen from './screens/RestockScreen';
import { COLORS } from './theme';

// Kept here so inventory changes survive switching tabs
const INITIAL_ITEMS = [
  { id: 'onion', name: 'Onion', stock: 16, min: 10, unit: 'lbs', amount: 1 },
  { id: 'rice', name: 'Rice', stock: 8, min: 5, unit: 'bags', amount: 1 },
  { id: 'chicken', name: 'Chicken', stock: 20, min: 12, unit: 'lbs', amount: 5 },
  { id: 'tomato', name: 'Tomato', stock: 12, min: 8, unit: 'lbs', amount: 2 },
  { id: 'beef', name: 'Ground Beef', stock: 15, min: 5, unit: 'lbs', amount: 1 },
  { id: 'tortillas', name: 'Tortillas', stock: 100, min: 30, unit: 'each', amount: 10 },
  { id: 'cheese', name: 'Shredded Cheese', stock: 10, min: 3, unit: 'lbs', amount: 1 },
  { id: 'lettuce', name: 'Lettuce', stock: 8, min: 3, unit: 'heads', amount: 1 },
  { id: 'potatoes', name: 'Potatoes', stock: 30, min: 10, unit: 'lbs', amount: 2 },
  { id: 'buns', name: 'Burger Buns', stock: 60, min: 20, unit: 'each', amount: 5 },
  { id: 'oil', name: 'Cooking Oil', stock: 5, min: 2, unit: 'gal', amount: 1 },
  { id: 'beans', name: 'Black Beans', stock: 12, min: 4, unit: 'cans', amount: 1 },
  { id: 'peppers', name: 'Bell Peppers', stock: 20, min: 6, unit: 'each', amount: 2 },
  { id: 'sour-cream', name: 'Sour Cream', stock: 6, min: 2, unit: 'lbs', amount: 1 },
];

function ComingSoon({ title }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderText}>Coming soon</Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('truck');
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [dishes, setDishes] = useState(INITIAL_DISHES);
  const [contacts, setContacts] = useState([
    { id: 'employee-1', name: 'Employee 1', phone: '312-555-0101', email: 'employee1@example.com' },
    { id: 'employee-2', name: 'Employee 2', phone: '312-555-0102', email: 'employee2@example.com' },
  ]);
  const [vendors, setVendors] = useState([
    { id: 'vendor-1', name: 'Vendor 1', phone: '312-555-0111', email: 'vendor1@example.com' },
    { id: 'vendor-2', name: 'Vendor 2', phone: '312-555-0112', email: 'vendor2@example.com' },
  ]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {activeTab === 'truck' && <TruckManagementScreen items={items} onViewRestock={() => setActiveTab('restock')} />}
      {activeTab === 'inventory' && <InventoryScreen items={items} setItems={setItems} onViewRestock={() => setActiveTab('restock')} />}
      {activeTab === 'dishes' && (
        <DishScreen
          items={items}
          setItems={setItems}
          dishes={dishes}
          setDishes={setDishes}
        />
      )}
      {activeTab === 'restock' && (
        <RestockScreen
          items={items}
          contacts={contacts}
          setContacts={setContacts}
          vendors={vendors}
          setVendors={setVendors}
          onViewInventory={() => setActiveTab('inventory')}
        />
      )}
      <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  placeholder: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  placeholderTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
});
