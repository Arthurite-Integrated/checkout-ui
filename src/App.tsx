import {Route,BrowserRouter as Router ,  Routes} from 'react-router-dom';
import Chat from './pages/chat';
import QR from './pages/QR';
import Auth from './pages/Auth';
import useAuth from './store';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
    <ToastContainer />
      <Router>
        <Routes>
          <Route path='/chat/:id' element={<Chat/>}></Route>
          <Route path='/qr/:supermarket_id' element={<QR/>}></Route>
          <Route path='/' element={<Auth/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          {/* <Route path='/escrow' element={}></Route>       
     </Suspense>     <Route path='/court' element={}></Route>        */}
        </Routes>
      </Router>
    </>
  )
}

export default App
