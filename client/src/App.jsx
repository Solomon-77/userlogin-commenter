import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const AuthRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('token');
  return isLoggedIn ? element : <Navigate to="/" replace />;
};

const RedirectToDashboard = () => {
  const isLoggedIn = localStorage.getItem('token');
  return isLoggedIn ? <Navigate to={`/dashboard/${localStorage.getItem('username')}`} /> : <Login />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/:username" element={<AuthRoute element={<Dashboard />} />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;