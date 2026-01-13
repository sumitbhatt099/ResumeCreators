import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveUser } from '../../storage/authStorage';
import { useToast } from '../../components/Toast/ToastContext';
import { useTheme } from '../../theme/useTheme';

const RegisterScreen = ({ navigation }: any) => {
  const { showToast } = useToast();
  const { colors, isDark } = useTheme(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const nameShake = useRef(new Animated.Value(0)).current;
  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

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

  const handleRegister = async () => {
    let valid = true;

    setNameError(false);
    setEmailError(false);
    setPasswordError(false);

    if (name.trim().length < 3) {
      setNameError(true);
      shakeField(nameShake);
      showToast('Name must be at least 3 characters', 'error');
      valid = false;
    }

    if (!isValidEmail(email)) {
      setEmailError(true);
      shakeField(emailShake);
      showToast('Please enter a valid email', 'error');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError(true);
      shakeField(passwordShake);
      showToast('Password must be minimum 6 characters', 'error');
      valid = false;
    }

    if (!valid) return;

    await saveUser({ name, email, password });

    showToast('Registration successful 🎉', 'success');

    setTimeout(() => {
      navigation.replace('Login');
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={[
          styles.screen,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TOP */}
        <View style={styles.topSection}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: colors.card },
            ]}
          >
            <Icon
              name="person-add-outline"
              size={40}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            Create Account
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Join and start building resumes
          </Text>
        </View>

        {/* CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Register
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Fill details to continue
          </Text>

          {/* NAME */}
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                borderColor: nameError ? colors.danger : colors.border,
                backgroundColor: colors.background,
                transform: [{ translateX: nameShake }],
              },
            ]}
          >
            <Icon name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Full name"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.textPrimary }]}
              value={name}
              onChangeText={setName}
            />
          </Animated.View>

          {/* EMAIL */}
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                borderColor: emailError ? colors.danger : colors.border,
                backgroundColor: colors.background,
                transform: [{ translateX: emailShake }],
              },
            ]}
          >
            <Icon name="mail-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { color: colors.textPrimary }]}
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>

          {/* PASSWORD */}
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                borderColor: passwordError ? colors.danger : colors.border,
                backgroundColor: colors.background,
                transform: [{ translateX: passwordShake }],
              },
            ]}
          >
            <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Password (min 6 chars)"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.textPrimary }]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>Create Account</Text>
            <Icon name="arrow-forward-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={{ color: colors.textSecondary }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                {' '}Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 22,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  registerBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
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
  footerLink: {
    fontWeight: 'bold',
  },
});
