import react from 'react'
import { ToastContainer } from "react-toastify";
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Sidebar from './components/Sidebar';


const App = () => {
  return (
    <div className='min-vh-100 d-flex'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick={false}
        theme="colored"
        draggable
      />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chats' element={<Chat/>}/>
      </Routes>
    </div>
  )
}

export default App