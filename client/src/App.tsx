import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/protection/ProtectedRoute';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import AllUsers from './components/pages/AllUsers';
import Conversations from './components/pages/Conversations';
import EditUser from './components/pages/EditUser';
import UserPage from './components/pages/UserPage';
import ChatPage from './components/pages/ChatPage';
// outlets
import BaseOutlet from './components/outlets/Baseoutlet';


const App = () => {
   const isAuthenticated = localStorage.getItem('user');

   return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route 
         path=''
         element={
         <ProtectedRoute >
              <BaseOutlet/>
           </ProtectedRoute>}>
         <Route path="/profile" element={<Profile />} />
         <Route path="/users" element={<AllUsers />} />
         <Route path="/user/:id" element={<UserPage />} />
         <Route path="/edit-user/:id" element={<EditUser />} />
         <Route path="/conversations" element={<Conversations />} />
         <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Route>
     
    </Routes>
  )
}

export default App
