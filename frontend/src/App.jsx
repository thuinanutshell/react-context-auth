import './App.css';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
