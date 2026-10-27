import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomNav from './components/BottomNav';
import TruckManagementScreen from './screens/TruckManagementScreen';
import InventoryScreen from './screens/InventoryScreen';
import { COLORS } from './theme';

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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {activeTab === 'truck' && <TruckManagementScreen />}
      {activeTab === 'inventory' && <InventoryScreen />}
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
