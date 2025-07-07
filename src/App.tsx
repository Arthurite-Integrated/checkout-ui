import {Route,BrowserRouter as Router ,  Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QR from './pages/Protected Routes/QR';
import Auth from './pages/Public Routes/Auth';
import Dashboard from './pages/Protected Routes/Dashboard';
import ProtectedRoute from './components/ProtectedRoute ';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/qr/:supermarket_id' element={<QR/>}></Route>
          <Route path='/' element={<Auth/>}></Route>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </>
  )
}

export default App