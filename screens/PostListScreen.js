import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

export default function PostListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'ClassMate',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => {
        Alert.alert('Logout Failed', error.message);
      });
  };

  const formatTimeAgo = timestamp => {
    if (!timestamp?.toDate) return 'Just now';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffHours < 1) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.authorName || 'Anonymous'}</Text>
          <Text style={styles.subject}>{item.subject || 'General'}</Text>
        </View>
        <Text style={styles.time}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePost')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111',
  },
  subject: {
    fontSize: 13,
    color: '#6b21a8',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#5b21b6',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    marginBottom: 2,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#d9534f',
    fontSize: 16,
  },
  profileButton: {
    marginRight: 10,
    padding: 6,
  },
  profileText: {
    color: '#5b21b6',
    fontSize: 16,
    fontWeight: '600',
  },
});
