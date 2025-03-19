import { useEffect } from 'react';
import './index.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout.tsx';


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
        <AppLayout />
      </BrowserRouter>
    </>
  )
}

export default App