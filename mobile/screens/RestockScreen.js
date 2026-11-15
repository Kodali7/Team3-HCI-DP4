import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

export default function RestockScreen({ items, contacts, setContacts, vendors, setVendors, onViewInventory }) {
  const [step, setStep] = useState(null);
  const [kind, setKind] = useState('contact');
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);
  const lowItems = items.filter((item) => item.stock < item.min);
  const people = kind === 'contact' ? contacts : vendors;
  const setPeople = kind === 'contact' ? setContacts : setVendors;
  const validName = name.trim().length > 0;
  const validPhone = /^[+\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7 && phone.replace(/\D/g, '').length <= 15;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validPerson = validName && validPhone && validEmail;

  const openList = (nextKind) => {
    setKind(nextKind);
    setSelected(null);
    setNotes('');
    setStep('list');
  };

  const addPerson = () => {
    if (!validPerson) return;
    setPeople((prev) => [...prev, { id: `${kind}-${Date.now()}`, name: name.trim(), phone: phone.trim(), email: email.trim() }]);
    setStep('list');
  };

  const send = () => {
    if (!selected || lowItems.length === 0) return;
    // DP4 prototype: record the confirmation locally; no SMS or order is transmitted.
    setReceipt({ name: selected.name, count: lowItems.length, notes: notes.trim() });
    setStep('sent');
  };

  const title = step === 'list' ? (kind === 'contact' ? 'Contact List' : 'Vendor List')
    : step === 'add' ? (kind === 'contact' ? 'New Contact' : 'New Vendor')
    : step === 'preview' ? `Order to ${selected?.name}` : 'Contact Info';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restock List</Text>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {lowItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.image}><Feather name="image" size={22} color={COLORS.primary} /></View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>current stock: {item.stock} {item.unit}</Text>
              <Text style={styles.detail}>minimum stock: {item.min} {item.unit}</Text>
              <Text style={styles.detail}>needed: {Number((item.min - item.stock).toFixed(3))} {item.unit}</Text>
            </View>
          </View>
        ))}
        {lowItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.name}>You're stocked up</Text>
            <Text style={styles.muted}>All ingredients meet their minimum stock levels.</Text>
            <Pressable style={styles.button} onPress={onViewInventory} accessibilityRole="button">
              <Text style={styles.buttonLabel}>View Inventory</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={() => openList('contact')} accessibilityRole="button">
              <Text style={styles.buttonLabel}>Text List</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => openList('vendor')} accessibilityRole="button">
              <Text style={styles.buttonLabel}>Send Order</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <Modal visible={step !== null} transparent animationType="fade" onRequestClose={() => setStep(null)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={[styles.name, styles.info]}>{title}</Text>
              <Pressable onPress={() => setStep(null)} accessibilityRole="button" accessibilityLabel="Close dialog" hitSlop={10}>
                <Feather name="x" size={20} color={COLORS.text} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {step === 'list' && <>
                {people.length === 0 && <Text style={styles.muted}>No {kind === 'contact' ? 'contacts' : 'vendors'} yet. Add one to continue.</Text>}
                {people.map((person) => (
                  <Pressable key={person.id} style={styles.person} accessibilityRole="button" accessibilityLabel={`Select ${person.name}`}
                    onPress={() => { setSelected(person); setStep('info'); }}>
                    <Feather name="user" size={16} color={COLORS.primary} />
                    <Text style={styles.personName}>{person.name}</Text>
                    <Feather name="arrow-right" size={18} color={COLORS.primary} />
                  </Pressable>
                ))}
                <Pressable style={styles.centerButton} accessibilityRole="button" onPress={() => {
                  setName(''); setPhone(''); setEmail(''); setStep('add');
                }}><Text style={styles.buttonLabel}>Add</Text></Pressable>
              </>}
              {step === 'add' && <>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} accessibilityLabel="Name" maxLength={80} />
                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} accessibilityLabel="Phone" keyboardType="phone-pad" maxLength={25} />
                {phone.length > 0 && !validPhone && <Text style={styles.error}>Enter a phone number with 7 to 15 digits.</Text>}
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} accessibilityLabel="Email" keyboardType="email-address" autoCapitalize="none" maxLength={254} />
                {email.length > 0 && !validEmail && <Text style={styles.error}>Enter a valid email address.</Text>}
                <View style={styles.actions}>
                  <Pressable style={styles.outline} onPress={() => setStep('list')} accessibilityRole="button"><Text>Cancel</Text></Pressable>
                  <Pressable style={[styles.button, !validPerson && styles.disabled]} onPress={addPerson} disabled={!validPerson} accessibilityRole="button" accessibilityState={{ disabled: !validPerson }}>
                    <Text style={styles.buttonLabel}>Add</Text>
                  </Pressable>
                </View>
              </>}
              {(step === 'info' || step === 'preview') && selected && <>
                <View style={styles.personHeading}><Feather name="user" size={18} color={COLORS.primary} /><Text style={[styles.name, styles.info]}>{selected.name}</Text></View>
                {step === 'info' && <>
                  <Text style={styles.contactDetail}>Phone: {selected.phone}</Text>
                  <Text style={styles.contactDetail}>Email: {selected.email}</Text>
                  {kind === 'contact' && <Text style={styles.muted}>Text the current Restock List ({lowItems.length} {lowItems.length === 1 ? 'ingredient' : 'ingredients'}).</Text>}
                  <View style={styles.actions}>
                    <Pressable style={styles.deleteButton} accessibilityRole="button" onPress={() => setStep('delete')}><Text style={styles.error}>Delete</Text></Pressable>
                    <Pressable style={styles.button} accessibilityRole="button" onPress={() => kind === 'contact' ? send() : setStep('preview')}>
                      <Text style={styles.buttonLabel}>{kind === 'contact' ? 'Text' : 'Order'}</Text>
                    </Pressable>
                  </View>
                  <Pressable style={styles.back} onPress={() => setStep('list')} accessibilityRole="button"><Text style={styles.muted}>Back to {kind === 'contact' ? 'contacts' : 'vendors'}</Text></Pressable>
                </>}
                {step === 'preview' && <>
                  <Text style={styles.label}>Order List:</Text>
                  {lowItems.map((item) => <Text key={item.id} style={styles.contactDetail}>{item.name}: {Number((item.min - item.stock).toFixed(3))} {item.unit}</Text>)}
                  <Text style={styles.label}>Note:</Text>
                  <TextInput style={[styles.input, styles.note]} multiline value={notes} onChangeText={setNotes} placeholder="Add a note (optional)" accessibilityLabel="Order note" maxLength={500} />
                  <View style={styles.actions}>
                    <Pressable style={styles.deleteButton} onPress={() => setStep('info')} accessibilityRole="button"><Text style={styles.error}>Cancel</Text></Pressable>
                    <Pressable style={styles.button} onPress={send} accessibilityRole="button"><Text style={styles.buttonLabel}>Send</Text></Pressable>
                  </View>
                </>}
              </>}
              {step === 'delete' && <>
                <Text style={styles.contactDetail}>Delete {selected?.name} from your {kind === 'contact' ? 'contacts' : 'vendors'}?</Text>
                <View style={styles.actions}>
                  <Pressable style={styles.outline} onPress={() => setStep('info')} accessibilityRole="button"><Text>Cancel</Text></Pressable>
                  <Pressable style={styles.deleteButton} accessibilityRole="button" onPress={() => {
                    setPeople((prev) => prev.filter((person) => person.id !== selected.id)); setSelected(null); setStep('list');
                  }}><Text style={styles.error}>Delete</Text></Pressable>
                </View>
              </>}
              {step === 'sent' && <>
                <View style={styles.personHeading}><Feather name="user" size={18} color={COLORS.primary} /><Text style={[styles.name, styles.info]}>{receipt?.name}</Text></View>
                <View style={styles.success}><Feather name="check" size={22} color={COLORS.primary} /><Text style={styles.name}>{kind === 'contact' ? 'Text Sent!' : 'Order Sent!'}</Text></View>
                <Text style={styles.muted}>Demo confirmation for {receipt?.count} {receipt?.count === 1 ? 'ingredient' : 'ingredients'}. Nothing was transmitted.</Text>
                {!!receipt?.notes && <Text style={styles.contactDetail}>Note: {receipt.notes}</Text>}
                <Pressable style={styles.centerButton} accessibilityRole="button" onPress={() => setStep(null)}><Text style={styles.buttonLabel}>Done</Text></Pressable>
              </>}
              {step !== 'sent' && <Text style={styles.demo}>Prototype: texts and orders are simulated.</Text>}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: 22 },
  list: { paddingBottom: 120 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: 12, marginBottom: 12 },
  image: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  detail: { fontSize: 12, color: COLORS.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  button: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  centerButton: { alignSelf: 'center', backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, marginTop: 16, minHeight: 44 },
  buttonLabel: { color: COLORS.surface, fontWeight: '600' },
  disabled: { backgroundColor: '#D1D5DB' },
  outline: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  deleteButton: { flex: 1, borderWidth: 1, borderColor: COLORS.lowStock, borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)', justifyContent: 'center', padding: 28 },
  modal: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, maxHeight: '85%', width: '100%', maxWidth: 420, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.background, borderRadius: 8, padding: 12, marginBottom: 8, minHeight: 44 },
  personName: { flex: 1, fontSize: 14, color: COLORS.text },
  personHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  contactDetail: { fontSize: 13, color: COLORS.text, marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, color: COLORS.text, marginBottom: 10, minHeight: 44 },
  note: { minHeight: 70, textAlignVertical: 'top' },
  error: { color: COLORS.lowStock, fontSize: 13 },
  muted: { fontSize: 13, color: COLORS.secondaryText, lineHeight: 20 },
  demo: { fontSize: 11, color: COLORS.secondaryText, textAlign: 'center', marginTop: 16 },
  success: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  back: { alignItems: 'center', padding: 12, marginTop: 4 },
  empty: { gap: 12 },
});
