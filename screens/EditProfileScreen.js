import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setUniversity(data.university || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !university.trim()) {
      Alert.alert('Invalid Input', 'Both fields are required.');
      return;
    }

    try {
      const docRef = doc(firestore, 'users', user.uid);
      await setDoc(docRef, {
        name: name.trim(),
        university: university.trim(),
      }, { merge: true });

      Alert.alert('Success', 'Profile updated!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>University</Text>
        <TextInput
          value={university}
          onChangeText={setUniversity}
          style={styles.input}
          placeholder="Enter your university"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
