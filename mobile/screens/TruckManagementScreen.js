import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '../theme';

export default function TruckManagementScreen({ items = [], onViewRestock }) {
  const [section, setSection] = useState(null);
  const lowItems = items.filter((item) => item.stock < item.min);
  const sections = ['My Trucks', 'Events', 'Employees', 'Alerts'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truck Management</Text>
      {sections.map((name) => (
        <Pressable key={name} style={styles.menuButton} onPress={() => setSection(name)} accessibilityRole="button">
          <Text style={styles.menuLabel}>{name}{name === 'Alerts' ? ` (${lowItems.length})` : ''}</Text>
          <Text style={styles.menuArrow}>{'→'}</Text>
        </Pressable>
      ))}
      <Modal visible={section !== null} transparent animationType="fade" onRequestClose={() => setSection(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.heading}>{section}</Text>
              <Pressable onPress={() => setSection(null)} accessibilityRole="button" accessibilityLabel="Close truck details" hitSlop={10}>
                <Text style={styles.closeLabel}>Close</Text>
              </Pressable>
            </View>
            <ScrollView>
              {section === 'My Trucks' && (
                <View style={styles.card}>
                  <Text style={styles.name}>Truck 1</Text>
                  <Text style={styles.detail}>Location 1</Text>
                  <Text style={styles.detail}>Richardson, TX 75080</Text>
                </View>
              )}
              {section === 'Events' && (
                <View style={styles.card}>
                  <Text style={styles.name}>Upcoming Event: Community Food Truck Night</Text>
                  <Text style={styles.detail}>Location: Location 1, Richardson, TX 75080</Text>
                  <Text style={styles.detail}>November 21, 2026</Text>
                  <Text style={styles.detail}>Time: 5:00 PM–8:00 PM Central</Text>
                </View>
              )}
              {section === 'Employees' && ['Employee 1', 'Employee 2', 'Employee 3'].map((name) => (
                <View key={name} style={styles.card}><Text style={styles.name}>{name}</Text></View>
              ))}
              {section === 'Alerts' && (
                <>
                  <Text style={styles.detail}>{lowItems.length} ingredient{lowItems.length === 1 ? '' : 's'} below minimum stock.</Text>
                  {lowItems.length === 0 && <Text style={styles.detail}>All ingredients meet their minimum stock levels.</Text>}
                  {lowItems.map((item) => (
                    <View key={item.id} style={[styles.card, styles.lowCard]}>
                      <Text style={styles.name}>{item.name} (low)</Text>
                    </View>
                  ))}
                  <Pressable style={styles.actionButton} accessibilityRole="button" onPress={() => {
                    setSection(null);
                    onViewRestock?.();
                  }}>
                    <Text style={styles.actionLabel}>View Restock List</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  modal: { width: '100%', maxWidth: 420, maxHeight: '85%', alignSelf: 'center', padding: 16, borderRadius: 16, backgroundColor: COLORS.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  heading: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.text },
  closeLabel: { color: COLORS.text, paddingVertical: 12 },
  card: { padding: 12, borderRadius: 12, backgroundColor: COLORS.background, marginBottom: 12 },
  lowCard: { backgroundColor: COLORS.lowStockTint },
  name: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  detail: { fontSize: 14, lineHeight: 21, color: COLORS.text, marginBottom: 6 },
  actionButton: { backgroundColor: COLORS.primary, padding: 12, minHeight: 44, borderRadius: 8, alignItems: 'center' },
  actionLabel: { color: COLORS.surface, fontWeight: '600' },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
  }, 
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 22,
  }, 
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    marginBottom: 12,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  },
  menuLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 22,
    color: COLORS.primary,
  },
});
