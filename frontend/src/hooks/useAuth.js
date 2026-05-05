import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';

const useAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAuthUser(null);
          setIsLoading(false);
          return;
        }

        const res = await axiosInstance.get('/auth/me');
        setAuthUser(res.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { authUser, isLoading, setAuthUser, logout };
};

export default useAuth;
