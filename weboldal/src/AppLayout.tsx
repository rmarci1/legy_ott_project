import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbars/Navbar';
import MainPage from './pages/MainPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import InteractedJobs from './pages/InteractedJobs';
import ProfilePage from './pages/ProfilePage';
import DashBoard from './pages/admin/DashBoard';
import AdminNavbar from './components/navbars/AdminNavBar';
import Users from './pages/admin/Users';

export default function AppLayout(){
    const location = useLocation(); // Itt már használható a useLocation
    const isAdmin = location.pathname.startsWith('/admin')
    return (
      <div className="flex flex-row h-screen w-full overflow-hidden font-poppins">
        <AuthProvider>
          {!isAdmin ? <Navbar /> : <AdminNavbar />}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interacted" element={<InteractedJobs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path='/admin' >
                <Route path="dashboard" element={<DashBoard/>} />
                <Route path="users" element={<Users/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </div>
    );

}