import { useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';

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
        <div className="flex h-screen font-poppins">
          <Navbar/>
          <div className='flex-grow p-4 place-content-center'>
            <Routes>
              <Route path="/home" element={<Home />}/>
              <Route path='/login' element={<Login /> } />
              <Route path='/register' element={<Register />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App