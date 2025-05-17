import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebase';

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(firestore, 'posts', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          Alert.alert('Error', 'Post not found');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = () => {
      const commentsRef = collection(firestore, 'posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, snapshot => {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(fetched);
      });
    };

    fetchPost();
    const unsubscribe = fetchComments();
    return () => unsubscribe();
  }, [postId]);

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const commentsRef = collection(firestore, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        text: comment.trim(),
        authorName: auth.currentUser?.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffHours < 1) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post Details</Text>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.textGroup}>
            <Text style={styles.name}>{post.authorName || 'Anonymous'}</Text>
            <Text style={styles.linkText}>{post.subject || 'General'}</Text>
          </View>
          <Text style={styles.timeText}>
            {post.createdAt?.toDate
              ? formatTimeAgo(post.createdAt.toDate())
              : 'Unknown time'}
          </Text>
        </View>
        <Text style={styles.bodyText}>{post.content}</Text>
      </View>

      <View style={styles.commentSection}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePostComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{item.authorName}</Text>
              <Text style={styles.timeText}>
                {item.createdAt?.toDate ? formatTimeAgo(item.createdAt.toDate()) : 'Just now'}
              </Text>
            </View>
            <Text style={styles.bodyText}>{item.text}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.header}>Comments</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ScrollView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  textGroup: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  linkText: {
    fontSize: 12,
    color: '#4f46e5',
    textDecorationLine: 'underline',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
  },
  postButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
});
