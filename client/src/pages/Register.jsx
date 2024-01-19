import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Fill in username and password.');
      setSuccessMessage('');
      return;
    }

    try {
      await axios.post('https://user-commenter-server.onrender.com/api/register', { username, password });
      setSuccessMessage('User Registered');
      setError('');
      console.log('User registered successfully');
    } catch (error) {
      handleRegistrationError(error);
    }
  };

  const handleRegistrationError = (error) => {
    const status = error.response?.status || 500;
    setError(`Registration error: ${error.response?.data?.error || 'Unknown error'}`);
    setSuccessMessage('');

    if (status === 409) {
      setError('User already exists.');
    }

    console.error('Registration error:', error.response?.data?.error || 'Unknown error');
  };

  return (
    <div className='font-inter min-h-screen w-full flex flex-col items-center justify-center p-5'>
      <div className='flex flex-col px-6 md:px-12 py-4 rounded-lg border max-w-[20rem] w-full border-neutral-500 bg-white'>
        <div className='text-center font-bold my-6 text-3xl'>Register</div>
        <input
          placeholder='Username'
          className='border-b py-2 mb-6 border-neutral-500 outline-none'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder='Password'
          className='border-b py-2 mb-3 border-neutral-500 outline-none'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 font-medium mb-1 text-center text-sm">{error}</div>}
        {successMessage && <div className="text-green-600 font-medium mb-1 text-center text-sm">{successMessage}</div>}
        <button className='mt-8 mb-4 py-[7px] text-lg bg-neutral-800 hover:bg-neutral-900 rounded-full text-neutral-200 hover:text-white' onClick={handleRegister}>Register</button>
        <div className='flex items-center justify-center mb-6 text-sm text-neutral-600'>
          <Link to='/' className='mr-1 text-neutral-700 hover:text-neutral-800 font-semibold'>Login</Link>here my nig
        </div>
      </div>
    </div>
  );
};

export default Register;