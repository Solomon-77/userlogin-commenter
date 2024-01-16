import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Create a custom route component for authentication
const AuthRoute = ({ element, ...rest }) => {
  const isLoggedIn = localStorage.getItem('token'); // Check if the user is logged in

  return isLoggedIn ? (
    element
  ) : (
    <Navigate to="/" state={{ from: rest.location.pathname }} replace />
  );
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/:username"
            element={<AuthRoute element={<Dashboard />} />}
          />
          {/* Add a catch-all route for invalid paths */}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;