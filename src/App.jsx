import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Home from './pages/home/Home'
import Explore from './pages/explore/Explore'
import HashtagPosts from './pages/explore/HashtagPosts'
import Notifications from './pages/notifications/Notifications'
import Profile from './pages/account/Profile'
import UserProfile from './pages/account/UserProfile'
import ChatList from './pages/chat/ChatList'
import ChatRoom from './pages/chat/ChatRoom'
import GroupChat from './pages/chat/GroupChat'
import CreatePost from './pages/post/CreatePost'
import EditPost from './pages/post/EditPost'
import PostDetail from './pages/post/PostDetail'
import Settings from './pages/account/Settings'
import EditProfile from './pages/account/EditProfile'
import PrivacySettings from './pages/account/PrivacySettings'
import AccountSettings from './pages/account/AccountSettings'
import BlockedUsers from './pages/account/BlockedUsers'
import Bookmarks from './pages/account/Bookmarks'
import Connections from './pages/account/Connections'
import ConnectionRequests from './pages/account/ConnectionRequests'
import Verification from './pages/account/Verification'
import FeedA from './pages/sort/FeedA'
import FeedB from './pages/sort/FeedB'
import FeedC from './pages/sort/FeedC'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/chat/group/:id" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/hashtag/:tag" element={<ProtectedRoute><HashtagPosts /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/settings/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/settings/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
        <Route path="/settings/blocked" element={<ProtectedRoute><BlockedUsers /></ProtectedRoute>} />
        <Route path="/settings/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        <Route path="/connections/requests" element={<ProtectedRoute><ConnectionRequests /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/post/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/post/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/feed/a" element={<ProtectedRoute><FeedA /></ProtectedRoute>} />
        <Route path="/feed/b" element={<ProtectedRoute><FeedB /></ProtectedRoute>} />
        <Route path="/feed/c" element={<ProtectedRoute><FeedC /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App