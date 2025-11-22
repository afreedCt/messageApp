import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './bootstrap.min.morph.css'
import { Context } from './contextAPI/useContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
    <Context>
    <App />
    </Context>
    </BrowserRouter>
  // {/* </StrictMode>, */}
)
