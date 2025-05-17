import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { auth, firestore } from '../firebase/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

export default function ProfileScreen({ navigation }) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', university: '' });

  const user = auth.currentUser;
  const isFocused = useIsFocused(); // Track if screen is focused

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            name: data.name || 'N/A',
            university: data.university || 'N/A',
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile info.');
      }
    };

    if (isFocused) {
      fetchProfile();  // Refetch profile when screen is focused
    }

    const postsQuery = query(
      collection(firestore, 'posts'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      snapshot => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);
        setLoading(false);
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigation, user, isFocused]); // Add isFocused to deps

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(error => Alert.alert('Logout Failed', error.message));
  };

  const handlePostPress = post => {
    Alert.alert('Post Options', 'What would you like to do?', [
      { text: 'Edit', onPress: () => handleEdit(post) },
      { text: 'Delete', onPress: () => handleDelete(post.id), style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEdit = post => {
    let newTitle = post.title;
    let newContent = post.content;

    Alert.prompt(
      'Edit Title',
      'Update your post title:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Next',
          onPress: titleInput => {
            if (!titleInput) return;
            newTitle = titleInput;

            Alert.prompt(
              'Edit Content',
              'Update your post content:',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Save',
                  onPress: async contentInput => {
                    if (!contentInput) return;
                    newContent = contentInput;

                    try {
                      await updateDoc(doc(firestore, 'posts', post.id), {
                        title: newTitle.trim(),
                        content: newContent.trim(),
                      });
                      Alert.alert('Success', 'Post updated successfully!');
                    } catch (error) {
                      Alert.alert('Error', error.message);
                    }
                  },
                },
              ],
              'plain-text',
              newContent
            );
          },
        },
      ],
      'plain-text',
      newTitle
    );
  };

  const handleDelete = async postId => {
    try {
      await deleteDoc(doc(firestore, 'posts', postId));
      Alert.alert('Deleted', 'Post deleted successfully.');
    } catch (error) {
      Alert.alert('Error', error.message);
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
      <Text style={styles.header}>Profile</Text>

      {/* Profile Info Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{user?.email || 'N/A'}</Text>
        <Text style={styles.university}>{profile.university}</Text>
      </View>

      {/* My Posts Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Posts</Text>
        {userPosts.length === 0 ? (
          <Text style={styles.noPostsText}>You have not created any posts yet.</Text>
        ) : (
          <FlatList
            data={userPosts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onLongPress={() => handlePostPress(item)}>
                <View style={styles.postItem}>
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Text style={styles.postContent}>{item.content}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginBottom: 16,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  university: {
    fontSize: 14,
    color: '#777',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noPostsText: {
    fontSize: 14,
    color: '#666',
  },
  postItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  postContent: {
    fontSize: 14,
    color: '#555',
  },
  settingButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 14,
    color: '#b91c1c',
    fontWeight: '600',
    textAlign: 'center',
  },
});
