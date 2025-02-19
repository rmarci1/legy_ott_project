import { useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';
import Profile from './components/Profile';
import { AuthProvider } from './components/Context/AuthContext';

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

            <Navbar/>

            <AuthProvider>
              {/*<div className=' p-4 '>*/}
                <Routes>
                  <Route path="/home" element={<Home />}/>
                  <Route path='/login' element={<Login /> } />
                  <Route path='/register' element={<Register />} />
                  <Route path='/profile' element={<Profile />} />
                </Routes>
              {/*</div>*/}
            </AuthProvider>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App