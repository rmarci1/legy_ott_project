import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import InteractedJobs from './pages/InteractedJobs';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/admin/AdminPage';

export default function AppLayout(){
    const location = useLocation();

    return (
      <div className="flex flex-row h-screen w-full overflow-hidden font-poppins">
        <AuthProvider>
          {location.pathname !== "/admin" && <Navbar />}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interacted" element={<InteractedJobs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AuthProvider>
      </div>
    );

}