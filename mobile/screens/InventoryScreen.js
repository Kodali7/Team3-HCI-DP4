import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

export default function InventoryScreen({ items, setItems }) {
  const [message, setMessage] = useState(null);

  // Hide the confirmation banner a few seconds after each change
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const updateItem = (id, changes) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  // -/+ only change the amount in the selector; Use/Add apply it to the stock
  const changeAmount = (item, delta) => {
    updateItem(item.id, { amount: Math.max(1, item.amount + delta) });
  };

  const applyAmount = (item, direction) => {
    if (direction < 0 && item.amount > item.stock) {
      setMessage(
        `Not enough ${item.name}. Only ${item.stock} ${item.unit} available.`
      );
      return;
    }
    const stock = Math.max(0, item.stock + direction * item.amount);
    updateItem(item.id, { stock });
    const verb = direction < 0 ? 'Used' : 'Added';
    setMessage(`${verb} ${item.amount} ${item.unit} of ${item.name} · ${stock} ${item.unit} left`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      {message && (
        <View style={styles.banner} accessibilityLiveRegion="polite">
          <Feather name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.bannerText}>{message}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {items.map((item) => {
          const low = item.stock < item.min;
          return (
            <View key={item.id} style={[styles.card, low && styles.cardLow]}>
              <View style={styles.cardTop}>
                <View style={styles.image}>
                  <Feather name="image" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, low && styles.lowText]}>
                    {item.name}{low ? '  (LOW)' : ''}
                  </Text>
                  <Text style={styles.detail}>current stock: {item.stock} {item.unit}</Text>
                  <Text style={styles.detail}>minimum stock: {item.min} {item.unit}</Text>
                </View>
                <Pressable style={styles.dots} accessibilityLabel={`Edit ${item.name}`}>
                  <Feather name="more-vertical" size={18} color={COLORS.text} />
                </Pressable>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => changeAmount(item, -1)}
                    accessibilityLabel={`Decrease ${item.name} amount`}
                  >
                    <Text style={styles.stepSymbol}>-</Text>
                  </Pressable>
                  <Text style={styles.amount}>{item.amount}</Text>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => changeAmount(item, 1)}
                    accessibilityLabel={`Increase ${item.name} amount`}
                  >
                    <Text style={styles.stepSymbol}>+</Text>
                  </Pressable>
                </View>
                <View style={styles.actions}>
                  <Pressable style={[styles.actionButton, styles.useButton]} onPress={() => applyAmount(item, -1)}>
                    <Text style={styles.useLabel}>Use</Text>
                  </Pressable>
                  <Pressable style={[styles.actionButton, styles.addButton]} onPress={() => applyAmount(item, 1)}>
                    <Text style={styles.addLabel}>Add</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 13,
    color: COLORS.text,
    flexShrink: 1,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  },
  cardLow: {
    backgroundColor: COLORS.lowStockTint,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
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
  lowText: {
    color: COLORS.lowStock,
  },
  detail: {
    fontSize: 12,
    color: COLORS.text,
  },
  dots: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  amount: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.text,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    lineHeight: 40,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    height: 40,
    minWidth: 64,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  useLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  addLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
