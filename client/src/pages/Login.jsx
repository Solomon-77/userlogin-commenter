import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Fill in username and password.');
      return;
    }

    try {
      const response = await axios.post('https://user-commenter-server.onrender.com/api/login', { username, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      console.log('Login successful');
      navigate(`/dashboard/${username}`);
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    setError('Invalid username and password.');
    console.error('Login error:', error.response?.data?.error || 'Unknown error');
  };

  return (
    <div className="font-inter min-h-screen w-full flex flex-col items-center justify-center p-5">
      <div className="flex flex-col px-6 md:px-12 py-4 rounded-lg border border-neutral-500 bg-white max-w-[20rem] w-full">
        <div className="text-center font-bold my-6 text-3xl">Login</div>
        <input
          placeholder="Username"
          className="border-b py-2 mb-6 border-neutral-500 outline-none"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          className="border-b py-2 mb-3 border-neutral-500 outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 font-medium mb-1 text-center text-sm">{error}</div>}
        <button className="mt-8 mb-4 py-[7px] text-lg bg-neutral-800 hover:bg-neutral-900 rounded-full text-neutral-200 hover:text-white" onClick={handleLogin}>
          Login
        </button>
        <div className="flex items-center justify-center mb-6 text-sm text-neutral-600">
          <Link to="/register/" className="mr-1 text-neutral-700 font-semibold hover:text-neutral-800">Register</Link>to create account
        </div>
      </div>
    </div>
  );
};

export default Login;