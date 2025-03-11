import { useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import MainPage from "./pages/MainPage.tsx";
import InteractedJobs from "./components/InteractedJobs.tsx";

function App() {
  useEffect(() => {
    document.title = 'Légy ott!';

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.rel = 'icon';
    link.href = '/icon.png'; 
    document.head.appendChild(link);

  }, [])

  return (
    <>
      <BrowserRouter >
        <div className="flex flex-row h-screen w-full overflow-hidden font-poppins">

            <AuthProvider>
               <Navbar/>
                <Routes>
                    <Route path='/' element={<MainPage/>}/>
                    <Route path='/login' element={<Login /> } />
                    <Route path='/register' element={<Register />} />
                    <Route path='/interacted' element={<InteractedJobs/>} />
                    <Route path='/profile' element={<ProfilePage />} />
                </Routes>
            </AuthProvider>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App