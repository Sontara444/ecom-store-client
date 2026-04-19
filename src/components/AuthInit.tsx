'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

export default function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch(setCredentials(JSON.parse(userInfo)));
    }
  }, [dispatch]);

  return null;
}
