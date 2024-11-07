import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useStateContext } from '../contexts/ContextProvider';
import api from '../utils/api';

const Login = () => {
  const [isProfileLogin, setIsProfileLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isProfileLogin ? '/api/auth/profile-login' : '/api/auth/login';
      const credentials = isProfileLogin 
        ? { username, password }
        : { email, password };

      console.log('Login attempt:', { endpoint, isProfileLogin, username: credentials.username });

      const response = await api.post(endpoint, credentials);
      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please check your credentials and try again.'
      );
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await api.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const response = await api.post('/api/auth/google', {
          token: tokenResponse.access_token,
          user: userInfo.data
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/');
      } catch (error) {
        console.error('Google sign in error:', error);
        setError('Google sign in failed');
      }
    },
    onError: () => {
      setError('Google sign in failed');
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <div className="mb-4">
          <button
            onClick={() => {
              setIsProfileLogin(!isProfileLogin);
              setError('');
            }}
            className="text-blue-500 underline"
          >
            {isProfileLogin ? 'Switch to Email Login' : 'Switch to Profile Login'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isProfileLogin ? (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        
        {!isProfileLogin && (
          <div className="mt-4">
            <button
              onClick={() => googleLogin()}
              className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center justify-center hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              Sign in with Google
            </button>
          </div>
        )}
        
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-500 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;