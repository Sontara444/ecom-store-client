import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  _id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
}

const initialState: WishlistState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find((x) => x._id === item._id);

      if (existItem) {
        state.wishlistItems = state.wishlistItems.filter((x) => x._id !== item._id);
      } else {
        state.wishlistItems = [...state.wishlistItems, item];
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
      }
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlistItems = action.payload;
    },
  },
});

export const { toggleWishlist, setWishlistItems } = wishlistSlice.actions;

export default wishlistSlice.reducer;
