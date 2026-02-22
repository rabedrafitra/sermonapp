import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/auth';
import { API_URL } from '../config/api';
import { useRoute } from '@react-navigation/native';

// Typage du post
type Post = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
};

// Typage du commentaire
type Comment = {
  id: string;
  content: string;
  user?: { name: string };
};

export default function SermonScreen() {
  const route = useRoute();
  const post = (route.params as { post: Post }).post; // 🔹 Cast correct

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${post.id}/comments`);
      const data: Comment[] = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async () => {
    if (!newComment) return;
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment }),
      });
      const created: Comment = await res.json();
      setComments(prev => [...prev, created]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

 const editComment = (commentId: string) => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return;

  Alert.prompt(
    "Modifier le commentaire",
    "",
    [
      { text: "Annuler", style: "cancel" },
      {
        text: "OK",
        onPress: (text?: string) => {
          if (!text) return; // 🔹 gère undefined
          setComments(prev =>
            prev.map(c => (c.id === commentId ? { ...c, content: text } : c))
          );
        }
      }
    ],
    "plain-text",
    comment.content
  );
};

  const deleteComment = (commentId: string) => {
    Alert.alert(
      "Supprimer le commentaire ?",
      "Cette action est irréversible",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setComments(prev => prev.filter(c => c.id !== commentId))
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>par {post.author}</Text>
      <Text style={styles.excerpt}>{post.excerpt}</Text>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Commentaires</Text>
        {comments.length > 0 ? (
          comments.map(c => (
            <View key={c.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>{c.user?.name ?? 'Utilisateur'}:</Text>
              <Text>{c.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => editComment(c.id)}>
                  <Text style={styles.actionText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteComment(c.id)}>
                  <Text style={[styles.actionText, { color: 'red' }]}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: '#888', marginTop: 4 }}>Aucun commentaire pour l'instant</Text>
        )}
      </View>

      <View style={styles.newCommentRow}>
        <TextInput
          style={styles.newCommentInput}
          placeholder="Écrire un commentaire..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={postComment} style={styles.sendBtn}>
          <Ionicons name="send" size={24} color="#00BFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  author: { fontSize: 14, color: '#666', marginBottom: 12 },
  excerpt: { fontSize: 16, lineHeight: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  comment: { marginBottom: 8, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#ddd' },
  commentAuthor: { fontWeight: '600', marginBottom: 2 },
  commentActions: { flexDirection: 'row', gap: 16, marginTop: 4 },
  actionText: { color: '#00BFFF', fontWeight: '600' },
  newCommentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  newCommentInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  sendBtn: { padding: 6 },
});