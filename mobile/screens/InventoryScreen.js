import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

const ITEMS = [
  { id: 'onion', name: 'Onion', stock: 16, min: 10, unit: 'lbs', amount: 1 },
  { id: 'rice', name: 'Rice', stock: 8, min: 5, unit: 'bags', amount: 1 },
  { id: 'chicken', name: 'Chicken', stock: 20, min: 12, unit: 'lbs', amount: 5 },
  { id: 'tomato', name: 'Tomato', stock: 12, min: 8, unit: 'lbs', amount: 2 },
];

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.image}>
              <Feather name="image" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>current stock: {item.stock} {item.unit}</Text>
              <Text style={styles.detail}>minimum stock: {item.min} {item.unit}</Text>
            </View>
            <View style={styles.controls}>
              <Pressable style={styles.dots} accessibilityLabel={`Edit ${item.name}`}>
                <Feather name="more-vertical" size={18} color={COLORS.text} />
              </Pressable>
              <View style={styles.stepper}>
                <Pressable style={styles.stepButton} accessibilityLabel={`Decrease ${item.name}`}>
                  <Text style={styles.stepSymbol}>-</Text>
                </Pressable>
                <Text style={styles.amount}>{item.amount}</Text>
                <Pressable style={styles.stepButton} accessibilityLabel={`Increase ${item.name}`}>
                  <Text style={styles.stepSymbol}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 22,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    color: COLORS.text,
  },
  controls: {
    alignItems: 'flex-end',
  },
  dots: {
    padding: 2,
    marginBottom: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  stepButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  amount: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.text,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    lineHeight: 36,
  },
});
