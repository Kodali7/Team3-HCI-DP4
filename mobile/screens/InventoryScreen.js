import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

export default function InventoryScreen({ items, setItems, restock = false, onViewRestock }) {
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [minInput, setMinInput] = useState('');
  const [error, setError] = useState('');
  const visibleItems = restock ? items.filter((item) => item.stock < item.min) : items;

  // Hide the confirmation banner a few seconds after each change
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const updateItem = (id, changes) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const showStockChange = (item, stock, min) => {
    if (stock < min && item.stock >= item.min) {
      setMessage(`${item.name} was added to the Restock List`);
    }
  };

  const changeStock = (item, direction) => {
    const stock = Math.max(0, item.stock + direction * item.amount);
    updateItem(item.id, { stock });
    showStockChange(item, stock, item.min);
  };

  const openEditor = (item) => {
    setEditing(item);
    setStockInput(String(item.stock));
    setMinInput(String(item.min));
    setError('');
  };

  const saveItem = () => {
    const stock = Number(stockInput);
    const min = Number(minInput);
    if (!stockInput.trim() || !minInput.trim() ||
        !Number.isFinite(stock) || !Number.isFinite(min) || stock < 0 || min < 0) {
      setError('Enter a valid quantity of zero or more.');
      return;
    }
    updateItem(editing.id, { stock, min });
    showStockChange(editing, stock, min);
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restock ? 'Restock List' : 'Inventory'}</Text>
      {message && (
        <Pressable style={styles.banner} onPress={onViewRestock} accessibilityRole="button"
          accessibilityLabel={`${message}. View Restock List`}>
          <Text style={styles.bannerText} accessibilityLiveRegion="polite">{message} · View →</Text>
        </Pressable>
      )}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {restock && visibleItems.length === 0 && (
          <Text style={styles.emptyText}>All ingredients meet their minimum stock levels.</Text>
        )}
        {visibleItems.map((item) => {
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
                <Pressable style={styles.dots} onPress={() => openEditor(item)} accessibilityLabel={`Edit ${item.name}`}>
                  <Feather name="more-vertical" size={18} color={COLORS.text} />
                </Pressable>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => updateItem(item.id, { amount: Math.max(1, item.amount - 1) })}
                    disabled={item.amount <= 1}
                    accessibilityRole="button"
                    accessibilityLabel={`Decrease selected quantity for ${item.name}`}
                  >
                    <Text style={styles.stepSymbol}>-</Text>
                  </Pressable>
                  <Text style={styles.amount}>{item.amount}</Text>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => updateItem(item.id, { amount: item.amount + 1 })}
                    accessibilityRole="button"
                    accessibilityLabel={`Increase selected quantity for ${item.name}`}
                  >
                    <Text style={styles.stepSymbol}>+</Text>
                  </Pressable>
                </View>
                <View style={styles.stockActions}>
                  <Pressable style={styles.addButton} onPress={() => changeStock(item, 1)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${item.amount} ${item.unit} of ${item.name}`}>
                    <Text style={styles.saveLabel}>Add</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.useButton, item.amount > item.stock && styles.disabledButton]}
                    onPress={() => changeStock(item, -1)}
                    disabled={item.amount > item.stock}
                    accessibilityRole="button"
                    accessibilityLabel={`Use ${item.amount} ${item.unit} of ${item.name}`}>
                    <Text style={styles.useLabel}>Use</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.name}>{editing?.name}</Text>
              <Pressable onPress={() => setEditing(null)} accessibilityLabel="Close editor" hitSlop={10}>
                <Feather name="x" size={20} color={COLORS.text} />
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>Minimum Level:</Text>
            <TextInput style={styles.input} value={minInput} onChangeText={setMinInput}
              keyboardType="decimal-pad" accessibilityLabel="Minimum level" />
            <Text style={styles.inputLabel}>Current Stock:</Text>
            <TextInput style={styles.input} value={stockInput} onChangeText={setStockInput}
              keyboardType="decimal-pad" accessibilityLabel="Current stock" />
            {error ? <Text style={styles.lowText} accessibilityLiveRegion="polite">{error}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable style={styles.deleteButton} onPress={() => {
                setItems((prev) => prev.filter((item) => item.id !== editing.id));
                setEditing(null);
              }}>
                <Text style={styles.lowText}>Delete</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveItem}>
                <Text style={styles.saveLabel}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    backgroundColor: COLORS.lowStockTint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 13,
    color: COLORS.lowStock,
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
  stockActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.4,
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
  emptyText: {
    fontSize: 15,
    color: COLORS.secondaryText,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    padding: 28,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    color: COLORS.text,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lowStock,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveLabel: {
    color: COLORS.surface,
    fontWeight: '600',
  },
});
