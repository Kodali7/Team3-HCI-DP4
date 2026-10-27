import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomNav from './components/BottomNav';
import TruckManagementScreen from './screens/TruckManagementScreen';
import InventoryScreen from './screens/InventoryScreen';
import { COLORS } from './theme';

// Kept here so inventory changes survive switching tabs
const INITIAL_ITEMS = [
  { id: 'onion', name: 'Onion', stock: 16, min: 10, unit: 'lbs', amount: 1 },
  { id: 'rice', name: 'Rice', stock: 8, min: 5, unit: 'bags', amount: 1 },
  { id: 'chicken', name: 'Chicken', stock: 20, min: 12, unit: 'lbs', amount: 5 },
  { id: 'tomato', name: 'Tomato', stock: 12, min: 8, unit: 'lbs', amount: 2 },
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {activeTab === 'truck' && <TruckManagementScreen />}
      {activeTab === 'inventory' && <InventoryScreen items={items} setItems={setItems} />}
      {activeTab === 'dishes' && <ComingSoon title="Dishes" />}
      {activeTab === 'restock' && <ComingSoon title="Restock List" />}
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
