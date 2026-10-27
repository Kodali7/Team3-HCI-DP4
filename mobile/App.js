import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truck Management</Text>
      <StatusBar style="auto" />
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>My Trucks</Text>
        <Text style={styles.menuArrow}>{'\u2192'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Events</Text>
        <Text style={styles.menuArrow}>{'\u2192'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Employees</Text>
        <Text style={styles.menuArrow}>{'\u2192'}</Text>
      </Pressable>
      <Pressable style = {styles.menuButton}> 
        <Text style={styles.menuLabel}>Alerts</Text>
        <Text style={styles.menuArrow}>{'\u2192'}</Text>
      </Pressable>
      
      <View style={styles.bottomBar}>
        <View style={styles.navItem}>
          <Feather name="clipboard" size={22} color={COLORS.text} />
          <Text style={styles.navLabel}>Inventory</Text>
        </View>
        <View style={styles.navItem}>
          <Feather name="disc" size={22} color={COLORS.text} />
          <Text style={styles.navLabel}>Dishes</Text>
        </View>
        <View style={styles.navItem}>
          <Feather name="package" size={22} color={COLORS.text} />
          <Text style={styles.navLabel}>Restock List</Text>
        </View>
        <View style={styles.navItem}>
          <Feather name="truck" size={22} color={COLORS.primary} />
          <Text style={[styles.navLabel, {color:COLORS.primary }]}>My Truck</Text>
          <View style={styles.activeIndicator} />
        </View>
      </View>
    </View>
  );
}

const COLORS = {
  background: '#FFF4E6',
  surface: '#FFFFFF',
  primary: '#FF8800',
  text: '#000000',
  secondaryText: '#6B7280',
  border: '#E5E7EB',
  lowStock: '#DC2626',
};

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
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: '85%',
    height:72,
    backgroundColor: COLORS.surface,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }, 
  navIcon: {
    fontSize: 24,
  },
  activeNavItem: {
    alignItems: 'center',
  },
  activeIndicator: {
    width: 16,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
    position: 'absolute',
    bottom: 6,
  }, 
  navItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.text,
    marginTop: 4,
  },
});
