import { useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';

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
        <div className="flex h-screen">
          <Navbar/>
          <div className='flex-grow p-4'>
            <Routes>
              <Route path="/home" element={<Home/>}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App