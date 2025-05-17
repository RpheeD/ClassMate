import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { firestore, auth } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be signed in to create a post.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'posts'), {
        title: title.trim(),
        content: content.trim(),
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Post created!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Post</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Write your post..."
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#444',
  },
  postButton: {
    backgroundColor: '#5b21b6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
