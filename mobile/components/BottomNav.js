import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { COLORS } from '../theme';

const TABS = [
  { key: 'inventory', label: 'Inventory', icon: 'clipboard' },
  { key: 'dishes', label: 'Dishes', icon: 'disc' },
  { key: 'restock', label: 'Restock List', icon: 'package' },
  { key: 'truck', label: 'My Truck', icon: 'truck' },
];

export default function BottomNav({ activeTab, onTabPress }) {
  return (
    <View style={styles.bottomBar}>
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        const color = active ? COLORS.primary : COLORS.text;
        return (
          <Pressable
            key={tab.key}
            style={styles.navItem}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Feather name={tab.icon} size={22} color={color} />
            <Text style={[styles.navLabel, { color }]}>{tab.label}</Text>
            {active && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: '85%',
    height: 72,
    backgroundColor: COLORS.surface,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
