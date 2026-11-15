import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

// Sample recipes: quantities are for one dish, in the inventory's units.
export const INITIAL_DISHES = [
  {
    id: 'chicken-tacos', name: 'Chicken Tacos', minutes: 20,
    description: 'Warm tortillas filled with chicken, tomato, onion, and shredded cheese.',
    ingredients: [
      { id: 'chicken', name: 'Chicken', quantity: 0.5, unit: 'lbs' },
      { id: 'tortillas', name: 'Tortillas', quantity: 3, unit: 'each' },
      { id: 'tomato', name: 'Tomato', quantity: 0.25, unit: 'lbs' },
      { id: 'onion', name: 'Onion', quantity: 0.25, unit: 'lbs' },
      { id: 'cheese', name: 'Shredded Cheese', quantity: 0.125, unit: 'lbs' },
    ],
  },
  {
    id: 'burger', name: 'Cheeseburger', minutes: 15,
    description: 'A ground beef patty on a bun with cheese, lettuce, and tomato.',
    ingredients: [
      { id: 'beef', name: 'Ground Beef', quantity: 0.5, unit: 'lbs' },
      { id: 'buns', name: 'Burger Buns', quantity: 1, unit: 'each' },
      { id: 'cheese', name: 'Shredded Cheese', quantity: 0.125, unit: 'lbs' },
      { id: 'lettuce', name: 'Lettuce', quantity: 0.125, unit: 'heads' },
      { id: 'tomato', name: 'Tomato', quantity: 0.25, unit: 'lbs' },
    ],
  },
  {
    id: 'bean-quesadilla', name: 'Black Bean Quesadilla', minutes: 10,
    description: 'Toasted tortillas with black beans, peppers, and melted cheese, served with sour cream.',
    ingredients: [
      { id: 'tortillas', name: 'Tortillas', quantity: 2, unit: 'each' },
      { id: 'beans', name: 'Black Beans', quantity: 0.5, unit: 'cans' },
      { id: 'peppers', name: 'Bell Peppers', quantity: 1, unit: 'each' },
      { id: 'cheese', name: 'Shredded Cheese', quantity: 0.25, unit: 'lbs' },
      { id: 'sour-cream', name: 'Sour Cream', quantity: 0.125, unit: 'lbs' },
    ],
  },
];

function unavailableIngredients(dish, items) {
  return dish.ingredients.filter((required) => {
    const item = items.find((entry) => entry.id === required.id);
    return !item || item.stock < item.min || item.stock < required.quantity;
  });
}

export default function DishScreen({ items, setItems, dishes, setDishes }) {
  const [dialog, setDialog] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [quantities, setQuantities] = useState({});

  const openAddDish = () => {
    setNewName('');
    setNewMinutes('');
    setNewDescription('');
    setQuantities({});
    setError('');
    setDialog('add');
  };

  const addDish = () => {
    const name = newName.trim();
    const description = newDescription.trim();
    const minutes = Number(newMinutes);
    if (!name || !description || !newMinutes.trim() || !Number.isFinite(minutes) || minutes <= 0) {
      setError('Enter a name, description, and cooking time greater than zero.');
      return;
    }
    if (dishes.some((dish) => dish.name.toLowerCase() === name.toLowerCase())) {
      setError('A dish with this name already exists.');
      return;
    }
    const selected = items.filter((item) => quantities[item.id] !== undefined);
    if (!selected.length) {
      setError('Select at least one ingredient and enter its quantity per dish.');
      return;
    }
    if (selected.some((item) => !quantities[item.id].trim() ||
      !Number.isFinite(Number(quantities[item.id])) || Number(quantities[item.id]) < 0.000001)) {
      setError('Each selected ingredient needs a quantity of at least 0.000001.');
      return;
    }
    const dish = {
      id: `dish-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name, description, minutes,
      ingredients: selected.map((item) => ({
        id: item.id, name: item.name, unit: item.unit, quantity: Number(quantities[item.id]),
      })),
    };
    setDishes((prev) => [...prev, dish]);
    setMessage(`${name} added to Dishes.`);
    setDialog(null);
  };

  const openDialog = (dish, nextDialog) => {
    setSelectedDish(dish);
    setError('');
    setDialog(nextDialog);
  };

  const cookDish = () => {
    const missing = unavailableIngredients(selectedDish, items);
    if (missing.length) {
      setError(`Not enough ingredients: ${missing.map((item) => item.name).join(', ')}.`);
      return;
    }

    setItems((prev) => {
      // Recheck the latest shared inventory before deducting any quantities.
      if (unavailableIngredients(selectedDish, prev).length) return prev;
      return prev.map((item) => {
        const required = selectedDish.ingredients.find((entry) => entry.id === item.id);
        return required
          ? { ...item, stock: Number((item.stock - required.quantity).toFixed(6)) }
          : item;
      });
    });
    setMessage(`${selectedDish.name} cooked! Ingredients have been deducted from inventory.`);
    setDialog(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Dishes</Text>
        <Pressable style={styles.addDishButton} onPress={openAddDish} accessibilityRole="button">
          <Feather name="plus" size={16} color={COLORS.surface} />
          <Text style={styles.buttonLabel}>Add Dish</Text>
        </Pressable>
      </View>
      {message ? (
        <View style={styles.success}>
          <Text style={styles.successText} accessibilityLiveRegion="polite">{message}</Text>
          <Pressable onPress={() => setMessage('')} accessibilityRole="button"
            accessibilityLabel="Dismiss cooking confirmation" hitSlop={10}>
            <Feather name="x" size={20} color={COLORS.text} />
          </Pressable>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {dishes.map((dish) => {
          const missing = unavailableIngredients(dish, items);
          const disabled = missing.length > 0;
          return (
            <View key={dish.id} style={styles.card}>
              <Text style={styles.name}>{dish.name}</Text>
              <View style={styles.timeRow}>
                <Feather name="clock" size={14} color={COLORS.secondaryText} />
                <Text style={styles.time}>{dish.minutes} minutes · 1 dish</Text>
              </View>
              <Text style={styles.description}>{dish.description}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.outline} onPress={() => openDialog(dish, 'ingredients')}
                  accessibilityRole="button" accessibilityLabel={`Show ingredients for ${dish.name}`}>
                  <Text style={styles.outlineLabel}>Show Ingredients</Text>
                </Pressable>
                <Pressable style={[styles.button, disabled && styles.disabledButton]}
                  disabled={disabled} onPress={() => openDialog(dish, 'cook')}
                  accessibilityRole="button" accessibilityLabel={`Cook ${dish.name}`}
                  accessibilityState={{ disabled }}>
                  <Text style={[styles.buttonLabel, disabled && styles.disabledLabel]}>Cook</Text>
                </Pressable>
              </View>
              {disabled && (
                <Text style={styles.error}>Not enough ingredients: {missing.map((item) => item.name).join(', ')}.</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={() => setDialog(null)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={[styles.name, styles.dialogTitle]}>
                {dialog === 'add' ? 'Add Dish' : dialog === 'cook' ? `Cook ${selectedDish?.name}?` : selectedDish?.name}
              </Text>
              <Pressable onPress={() => setDialog(null)} accessibilityRole="button"
                accessibilityLabel="Close dish dialog" hitSlop={10}>
                <Feather name="x" size={20} color={COLORS.text} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {dialog === 'add' && (
                <>
                  <Text style={styles.label}>Dish Name</Text>
                  <TextInput style={styles.input} value={newName} onChangeText={setNewName}
                    accessibilityLabel="Dish name" maxLength={80} />
                  <Text style={styles.label}>Time in Minutes</Text>
                  <TextInput style={styles.input} value={newMinutes} onChangeText={setNewMinutes}
                    accessibilityLabel="Cooking time in minutes" keyboardType="decimal-pad" />
                  <Text style={styles.label}>Description</Text>
                  <TextInput style={[styles.input, styles.descriptionInput]} value={newDescription}
                    onChangeText={setNewDescription} accessibilityLabel="Dish description" multiline maxLength={500} />
                  <Text style={styles.label}>Ingredients per Dish</Text>
                  <Text style={styles.description}>Select ingredients and enter the amount used for one dish.</Text>
                  {items.length === 0 && <Text style={styles.description}>Add ingredients in Inventory first.</Text>}
                  {items.map((item) => {
                    const selected = quantities[item.id] !== undefined;
                    return (
                      <View key={item.id} style={styles.ingredientRow}>
                        <Pressable style={styles.ingredientChoice} accessibilityRole="checkbox"
                          accessibilityLabel={item.name} accessibilityState={{ checked: selected }}
                          onPress={() => setQuantities((prev) => {
                            const next = { ...prev };
                            if (selected) delete next[item.id];
                            else next[item.id] = '';
                            return next;
                          })}>
                          <Feather name={selected ? 'check-square' : 'square'} size={20} color={COLORS.text} />
                          <Text style={styles.choiceLabel}>{item.name} ({item.unit})</Text>
                        </Pressable>
                        {selected && <TextInput style={styles.input} value={quantities[item.id]}
                          onChangeText={(value) => setQuantities((prev) => ({ ...prev, [item.id]: value }))}
                          keyboardType="decimal-pad" placeholder={`Quantity in ${item.unit}`}
                          accessibilityLabel={`${item.name} quantity per dish in ${item.unit}`} />}
                      </View>
                    );
                  })}
                  {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
                  <View style={styles.actions}>
                    <Pressable style={styles.outline} onPress={() => setDialog(null)} accessibilityRole="button">
                      <Text style={styles.outlineLabel}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={addDish} accessibilityRole="button">
                      <Text style={styles.buttonLabel}>Add Dish</Text>
                    </Pressable>
                  </View>
                </>
              )}
              {dialog === 'ingredients' && (
                <>
                  <Text style={styles.description}>Ingredients for one dish:</Text>
                  {selectedDish?.ingredients.map((ingredient) => (
                    <Text key={ingredient.id} style={styles.ingredient}>
                      {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                    </Text>
                  ))}
                  <Pressable style={styles.button} onPress={() => setDialog(null)} accessibilityRole="button">
                    <Text style={styles.buttonLabel}>Close</Text>
                  </Pressable>
                </>
              )}
              {dialog === 'cook' && (
                <>
                  <Text style={styles.description}>
                    Cook one dish? The required ingredients will be deducted from your inventory.
                  </Text>
                  {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
                  <View style={styles.actions}>
                    <Pressable style={styles.outline} onPress={() => setDialog(null)} accessibilityRole="button">
                      <Text style={styles.outlineLabel}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={cookDish} accessibilityRole="button">
                      <Text style={styles.buttonLabel}>Confirm Cook</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  addDishButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: 8, padding: 12, minHeight: 44 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, color: COLORS.text, marginBottom: 14, minHeight: 44 },
  descriptionInput: { minHeight: 80, textAlignVertical: 'top' },
  ingredientRow: { marginBottom: 8 },
  ingredientChoice: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  choiceLabel: { flex: 1, color: COLORS.text, fontSize: 14 },
  list: { paddingBottom: 120 },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 10 },
  time: { fontSize: 13, color: COLORS.secondaryText },
  description: { fontSize: 14, color: COLORS.text, lineHeight: 21, marginBottom: 14 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: { flexGrow: 1, backgroundColor: COLORS.primary, borderRadius: 8, padding: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { color: COLORS.surface, fontWeight: '600' },
  outline: { flexGrow: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, padding: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  outlineLabel: { color: COLORS.text, fontWeight: '600' },
  disabledButton: { backgroundColor: COLORS.border },
  disabledLabel: { color: COLORS.secondaryText },
  error: { fontSize: 13, color: COLORS.lowStock, lineHeight: 19, marginTop: 10 },
  success: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: COLORS.primaryTint, marginBottom: 12 },
  successText: { flex: 1, color: COLORS.text, fontSize: 14, lineHeight: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)', justifyContent: 'center', padding: 28 },
  modal: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, maxHeight: '85%', width: '100%', maxWidth: 420, alignSelf: 'center' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dialogTitle: { flex: 1 },
  ingredient: { fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 10 },
});
