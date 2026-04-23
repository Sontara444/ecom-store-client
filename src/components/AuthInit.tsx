'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { setCartItems, saveShippingAddress, savePaymentMethod } from '@/redux/slices/cartSlice';
import { setWishlistItems } from '@/redux/slices/wishlistSlice';

export default function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate Auth
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch(setCredentials(JSON.parse(userInfo)));
    }

    // Hydrate Cart
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      dispatch(setCartItems(JSON.parse(cartItems)));
    }

    const shippingAddress = localStorage.getItem('shippingAddress');
    if (shippingAddress) {
      dispatch(saveShippingAddress(JSON.parse(shippingAddress)));
    }

    const paymentMethod = localStorage.getItem('paymentMethod');
    if (paymentMethod) {
      dispatch(savePaymentMethod(JSON.parse(paymentMethod)));
    }

    // Hydrate Wishlist
    const wishlistItems = localStorage.getItem('wishlistItems');
    if (wishlistItems) {
      dispatch(setWishlistItems(JSON.parse(wishlistItems)));
    }
  }, [dispatch]);

  return null;
}
