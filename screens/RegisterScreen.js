import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Account created! You can now log in.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        Alert.alert('Registration Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.tabText}>Log In</Text>
          </TouchableOpacity>
          <Text style={[styles.tabText, styles.activeTab]}>Sign Up</Text>
        </View>
        <View style={styles.separator} />

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link */}
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}
          >
            Click here
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  tabText: {
    marginRight: 20,
    fontSize: 16,
    color: '#999',
  },
  activeTab: {
    color: '#5b21b6',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  registerButton: {
    backgroundColor: '#5b21b6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#444',
  },
  linkText: {
    color: '#5b21b6',
    fontWeight: '500',
  },
});
