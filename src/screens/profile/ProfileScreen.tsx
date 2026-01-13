import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';

const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const data = await AsyncStorage.getItem('USER_DATA');
    if (data) {
      setUser(JSON.parse(data));
    }
  };

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.card }]}>
            <Icon name="person-outline" size={50} color={colors.primary} />
          </View>

          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {user.name}
          </Text>

          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user.email}
          </Text>
        </View>

        {/* INFO CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ProfileItem
            icon="person-outline"
            label="Name"
            value={user.name}
            colors={colors}
          />
          <ProfileItem
            icon="mail-outline"
            label="Email"
            value={user.email}
            colors={colors}
          />
          <ProfileItem
            icon="lock-closed-outline"
            label="Password"
            value="••••••••"
            colors={colors}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

/* ================= REUSABLE ROW ================= */
const ProfileItem = ({ icon, label, value, colors }: any) => (
  <View style={styles.row}>
    <Icon name={icon} size={20} color={colors.primary} style={{ width: 30 }} />
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
});
