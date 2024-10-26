import { Routes, Route } from 'react-router-dom';
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
import UserOutlet from './components/outlets/UserOutlet';
import ChatOutlet from './components/outlets/ChatOutlet';


const App = () => {
   return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='' element={<BaseOutlet/>} >
         <Route path="/profile" element={<Profile />} />
         <Route path="/users" element={<AllUsers />} />
         <Route path="/conversations" element={<Conversations />} />
         <Route path="/edit/:id" element={<EditUser />} />
      </Route>

      <Route element={<UserOutlet />}>
         <Route path="/user/:id" element={<UserPage />} />
      </Route>

      <Route element={<ChatOutlet />}>
         <Route path="/user/:id" element={<ChatPage />} />
      </Route>
     
    </Routes>
  )
}

export default App
