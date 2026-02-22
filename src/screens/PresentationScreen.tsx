import { StatusBar } from 'expo-status-bar';
import { removeToken } from '../utils/auth';
import { getToken } from '../utils/auth';
import { API_URL } from "../config/api";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import BottomNavbar from "../../components/BottomNavbar";
import { BackHandler } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  SafeAreaView,
  Image,
  Dimensions,
  ImageBackground,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.78;
const MENU_ITEMS = [
  { label: 'Toriteny rehetra', icon: 'grid-outline' },
  { label: 'SAFIF', icon: 'business-outline' },
  { label: 'SA', icon: 'book-outline' },
  { label: 'AFF', icon: 'sparkles-outline' },
  { label: 'FFP', icon: 'flame-outline' },
  { label: 'Vidéos', icon: 'videocam-outline' },
  { label: 'Audios', icon: 'musical-notes-outline' },
];

export default function PresentationScreen() {
  //NAVIGATION
  const navigation = useNavigation();
  //FONTS
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set<string>());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [selectedCategory, setSelectedCategory] = useState('Toriteny rehetra');
  // ✅ POSTS
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  // ✅ COMMENTAIRES (ICI C’EST BON)
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, any[]>>({})
 
  //AUTH
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/posts`);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response text:', text);
    const data = JSON.parse(text);
    const adapted = data.map((post: any) => ({
      ...post,
      image: post.thumbnail,
      thumbnail: post.thumbnail ?? 'https://picsum.photos/600/340',
      excerpt: post.excerpt,
    }));
    setPosts(adapted);
    console.log('Posts fetched:', adapted);
  } catch (e) {
    console.error('Fetch error:', e);
  } finally {
    setLoading(false);
  }
};
//useeffect auth
useEffect(() => {
  const checkAuth = async () => {
    const token = await getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setIsAuthenticated(true);
      setUser(data);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  checkAuth();
}, []);
//AFFICHAGE COMMENTAIRES
const loadComments = async (postId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/posts/${postId}/comments`);
    if (!res.ok) {
      console.error(`Erreur HTTP pour commentaires de ${postId}: ${res.status}`);
      setCommentsByPost(prev => ({ ...prev, [postId]: [] })); // Set [] en cas d'erreur
      return;
    }
    const data = await res.json();
    console.log(`Commentaires chargés pour ${postId}:`, data); // Log pour déboguer
    setCommentsByPost(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : [] })); // Force tableau
  } catch (error) {
    console.error("Erreur loadComments:", error);
    setCommentsByPost(prev => ({ ...prev, [postId]: [] }));
  }
};
const toggleComments = (postId: string) => {
  setOpenComments(prev => {
    const next = new Set(prev)
    if (next.has(postId)) {
      next.delete(postId)
    } else {
      next.add(postId)
      loadComments(postId)
    }
    return next
  })
}
// POST COMMENT
const postComment = async (postId: string) => {
  const content = newCommentText[postId];
  if (!content) return;
  try {
    const token = await getToken();
    if (!token) {
      console.error("Token manquant");
      return;
    }
    const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const text = await res.text(); // 🔹 Récupérer le texte brut
    console.log("Response POST comment:", text);
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} - ${text}`);
    }
    const newComment = JSON.parse(text);
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setNewCommentText(prev => ({ ...prev, [postId]: "" }));
  } catch (error) {
    console.error("Erreur postComment:", error);
  }
};
//LIKES
const toggleLike = async (postId: string) => {
  const userId = "123"; // Remplacer par l’ID réel connecté
  // Optimistic UI
  setLikedPosts(prev => {
    const newSet = new Set(prev);
    newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
    return newSet;
  });
  try {
    const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    // Met à jour le compteur de likes et l'état local
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: data.likes }
          : post
      )
    );
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      data.liked ? newSet.add(postId) : newSet.delete(postId);
      return newSet;
    });
  } catch (error) {
    console.error("Erreur like post:", error);
  }
};
  // ==========================
  const colors = {
    background: darkMode ? '#001F3F' : '#E0F7FA',
    card: darkMode ? 'rgba(0,31,63,0.85)' : 'rgba(255,255,255,0.2)',
    primary: '#00BFFF',
    text: darkMode ? '#E0F7FA' : '#001F3F',
    muted: darkMode ? '#87CEEB' : '#4682B4',
    border: darkMode ? '#004080' : 'rgba(176,224,230,0.3)',
    selectedBg: darkMode ? 'rgba(0,102,204,0.85)' : 'rgba(240,248,255,0.2)',
    overlay: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    audioBg: darkMode ? 'rgba(0,51,102,0.85)' : 'rgba(224,247,250,0.2)',
    accent: '#EF4444',
    white: '#FFFFFF',
  };
  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }).start();
  };
  const closeMenu = () => {
    Animated.timing(slideAnim, { toValue: -MENU_WIDTH, duration: 280, useNativeDriver: true }).start(() => setIsMenuOpen(false));
  };
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'Toriteny rehetra') return true;
    if (selectedCategory === 'Vidéos') return post.type === 'video';
    if (selectedCategory === 'Audios') return post.type === 'audio';
    return post.tag === selectedCategory;
  });
  const mediaHeight = width * 1.78;
  const renderMedia = (post: any) => {
    if (post.type === 'audio') {
      return (
        <View style={[styles.audioContainer, { backgroundColor: colors.audioBg, borderBottomColor: colors.border }]}>
          <Image source={{ uri: post.thumbnail }} style={styles.audioThumbnail} />
          <View style={styles.audioInfo}>
            <Text style={[styles.audioTitle, { color: colors.text }]}>{post.title}</Text>
            <Text style={[styles.audioAuthor, { color: colors.muted }]}>{post.author}</Text>
            <View style={styles.waveformContainer}>
              <Image source={{ uri: 'https://picsum.photos/id/1060/300/40' }} style={styles.waveform} />
            </View>
          </View>
          <TouchableOpacity style={styles.audioPlayButton}>
            <Ionicons name="play" size={32} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.audioDuration, { color: colors.muted }]}>{post.duration}</Text>
        </View>
      );
    }
    if (post.type === 'text') return null;
    if (post.type === 'quote') {
      return (
        <ImageBackground source={{ uri: post.image }} style={[styles.media, { height: mediaHeight }]}>
          <View style={styles.quoteOverlay}>
            <Text style={styles.quoteText}>{post.excerpt}</Text>
          </View>
        </ImageBackground>
      );
    }
    return (
      <View style={{ height: mediaHeight }}>
        <Image source={{ uri: 'https://picsum.photos/id/1060/300/40' }} style={styles.waveform} resizeMode="contain" />
        {post.duration && (
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={72} color={colors.white} />
            <Text style={styles.duration}>{post.duration}</Text>
          </View>
        )}
      </View>
    );
  };
  if (!fontsLoaded) {
    return <View style={[styles.loading, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Chargement...</Text></View>;
  }
  return (
    <LinearGradient
      colors={['#3B82F6', '#1E3A8A']}
      style={styles.container}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <SafeAreaView style={styles.innerContainer}>
<View style={styles.topBar}>
  <TouchableOpacity 
    style={styles.pill} 
    onPress={() => BackHandler.exitApp()}
  >
    <Ionicons name="close" size={24} color={colors.white} />
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.pill} 
    onPress={() => {
      if (isAuthenticated) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('Login');
      }
    }}
  >
    <Ionicons name="person-outline" size={24} color={colors.white} />
  </TouchableOpacity>
</View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.titleCard}>
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.white }]}>
            FaFi-Aina
          </Text>
          <Text style={[styles.subtitle, { color: colors.white }]}>
           Fampianarana & Fizarana Toriteny ato amin'ny FJKM 
      
          </Text>
        </TouchableOpacity>

        <View style={styles.widgetsColumn}>
          <TouchableOpacity style={styles.widget}>
 <Image
              source={require('../../assets/icons/icon1.png')}
              style={styles.widgetIcon}
              resizeMode="contain"
            />
            <Text style={[styles.widgetText, { color: colors.white }]}>
             Tan-tsoroka ara-panahy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.widget} onPress={() => navigation.navigate('Home')}>
               <Image
              source={require('../../assets/icons/icon3.png')}
              style={styles.widgetIcon}
              resizeMode="contain"
            /> 
            
            <Text style={[styles.widgetText, { color: colors.white }]}>
           Fampiorenam-pinoana
            </Text>
          </TouchableOpacity>

             <TouchableOpacity style={styles.widget} onPress={() => navigation.navigate('Home')}>
               <Image
              source={require('../../assets/icons/icon2.png')}
              style={styles.widgetIcon}
              resizeMode="contain"
            /> 
            
            <Text style={[styles.widgetText, { color: colors.white }]}>
            Fitoriana ny Filazantsara
            </Text>
          </TouchableOpacity>
        </View>

       <View style={styles.controlsBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="book-outline" size={32} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="flame-outline"size={32} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="reader-outline" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>

        <BottomNavbar navigation={navigation} colors={colors} />
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    padding: 8,
  },
  titleCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  widgetsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  widget: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  widgetIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  widgetText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  controlsBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 80, // Space for bottom navbar
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  storiesScroll: { padding: 12 },
  storyWrapper: { alignItems: 'center', marginRight: 16, width: 72 },
  storyRing: { padding: 4, borderRadius: 999, borderWidth: 3, borderColor: '#00BFFF' },
  liveStoryRing: { borderColor: '#EF4444' },
  storyAvatar: { width: 64, height: 64, borderRadius: 32 },
  storyName: { fontSize: 12, marginTop: 6 },
  liveBadge: { position: 'absolute', bottom: 22, backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  liveText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  hamburger: { padding: 8, marginRight: 2 },
  // header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 46, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  card: { marginHorizontal: 16, marginVertical: 10, borderRadius: 20, overflow: 'hidden', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  author: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  time: { fontSize: 14 },
  media: { width: '100%', resizeMode: 'cover' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
  duration: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.8)', color: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 14 },
  quoteOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: 'rgba(0,0,0,0.55)' },
  quoteText: { color: '#FFFFFF', fontSize: 22, textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 19, fontFamily: 'Inter_700Bold', marginBottom: 8 },
  excerpt: { fontSize: 16, lineHeight: 24 },
  audioContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  audioThumbnail: { width: 70, height: 70, borderRadius: 12 },
  audioInfo: { flex: 1, marginLeft: 16 },
  audioTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  audioAuthor: { fontSize: 14, marginTop: 2 },
  waveformContainer: { marginTop: 8 },
  waveform: { width: 140, height: 28, opacity: 0.7 },
  audioPlayButton: { padding: 8 },
  audioDuration: { position: 'absolute', bottom: 16, right: 16, fontSize: 13 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 32 },
  likeButton: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  navbar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#fff', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: -4 }, elevation: 5 },
  navItem: { alignItems: 'center' },
  navItemActive: { alignItems: 'center' },
  navLabel: { fontSize: 11, marginTop: 4 },
  navLabelActive: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4, color: '#00BFFF' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  menuContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, width: MENU_WIDTH, borderTopRightRadius: 24, borderBottomRightRadius: 24, paddingTop: 60, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 20 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: 1 },
  menuTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, gap: 16 },
  menuLabel: { fontSize: 17 },
commentsContainer: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 12,
  backgroundColor: 'rgba(0,0,0,0.02)',
},
comment: {
  marginBottom: 8,
  paddingVertical: 4,
  borderBottomWidth: 0.5,
  borderBottomColor: '#ddd',
},
newCommentRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
},
newCommentInput: {
  flex: 1,
  borderWidth: 1,
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginRight: 8,
},
sendBtn: {
  padding: 6,
},
  logoutBtn: {
    marginTop: "auto", // 🔥 POUSSE EN BAS
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#EF4444",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 14,
},
/* MENU plus à droite */
menuBtn: {
  marginRight: 24, // 👉 pousse le menu vers la droite
  padding: 6,
},
/* Centre réel */
headerCenter: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
/* LOGO PLUS GRAND */

});