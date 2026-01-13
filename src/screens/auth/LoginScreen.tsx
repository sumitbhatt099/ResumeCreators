import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../navigation/AppNavigator';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ❌ error states
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // 📳 shake animation
  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

  const { setIsLoggedIn } = useContext(AuthContext);

  const shakeField = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = async () => {
    let valid = true;

    // reset errors
    setEmailError(false);
    setPasswordError(false);

    if (!isValidEmail(email)) {
      setEmailError(true);
      shakeField(emailShake);
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError(true);
      shakeField(passwordShake);
      valid = false;
    }

    if (!valid) return;

    try {
      const userData = await AsyncStorage.getItem('USER_DATA');

      if (!userData) {
        Alert.alert('Error', 'User not registered');
        return;
      }

      const user = JSON.parse(userData);

      if (user.email === email && user.password === password) {
        await AsyncStorage.setItem('USER_TOKEN', 'true');
        setIsLoggedIn(true);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TOP */}
        <View style={styles.topSection}>
          <View style={styles.logoCircle}>
            <Icon name="document-text-outline" size={42} color="#4CAF50" />
          </View>
          <Text style={styles.brandTitle}>Resume Creator</Text>
          <Text style={styles.brandSubtitle}>
            Build professional resumes in minutes
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back 👋</Text>
          <Text style={styles.cardSubtitle}>Login to continue</Text>

          {/* EMAIL */}
          <Animated.View
            style={[
              styles.inputWrapper,
              emailError && styles.errorBorder,
              { transform: [{ translateX: emailShake }] },
            ]}
          >
            <Icon name="mail-outline" size={20} style={styles.inputIcon} />
            <TextInput
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
          </Animated.View>

          {/* PASSWORD */}
          <Animated.View
            style={[
              styles.inputWrapper,
              passwordError && styles.errorBorder,
              { transform: [{ translateX: passwordShake }] },
            ]}
          >
            <Icon name="lock-closed-outline" size={20} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(p => !p)}
              style={styles.eyeBtn}
            >
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </Animated.View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
            <Icon name="arrow-forward-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#F4F8F6',
    paddingHorizontal: 20,
  },

  topSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },

  logoCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  brandSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    elevation: 6,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    marginTop: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },

  errorBorder: {
    borderColor: '#E53935',
  },

  inputIcon: {
    marginRight: 6,
    color: '#777',
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },

  eyeBtn: {
    padding: 4,
  },

  loginBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  footerText: {
    color: '#666',
  },

  footerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
