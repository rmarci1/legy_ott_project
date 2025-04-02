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
import Jobs from './pages/admin/Jobs';
import CreateAd from "./pages/CreateAd.tsx";
import AdminRoute from "@/pages/admin/AdminRoute.tsx";
import ChatRoute from './pages/ChatRoute.tsx';

export default function AppLayout(){
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden font-poppins">
        <AuthProvider>
          {!isAdmin ? <Navbar /> : <AdminNavbar />}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interacted" element={<InteractedJobs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<DashBoard />} />
                <Route path="/admin/users" element={<Users/>} />
                <Route path="/admin/jobs" element={<Jobs/>} />
            </Route>
            <Route path="/createAd" element={<CreateAd />} />
            <Route path="/chat" element={<ChatRoute />}/>
          </Routes>
        </AuthProvider>
      </div>
    );

}