import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.replace('PostList');
      })
      .catch(error => {
        Alert.alert('Login Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Text style={[styles.tabText, styles.activeTab]}>Log In</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
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

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Link */}
        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Register')}
          >
            Click here
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    color: '#5b21b6', // Purple
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
  loginButton: {
    backgroundColor: '#5b21b6', // Purple
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  loginButtonText: {
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
