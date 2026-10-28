import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '../theme';

export default function TruckManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truck Management</Text>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>My Trucks</Text>
        <Text style={styles.menuArrow}>{'→'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Events</Text>
        <Text style={styles.menuArrow}>{'→'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Employees</Text>
        <Text style={styles.menuArrow}>{'→'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Alerts</Text>
        <Text style={styles.menuArrow}>{'→'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
