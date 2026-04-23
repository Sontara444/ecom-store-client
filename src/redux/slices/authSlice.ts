import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userInfo: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userInfo: null, // Start as null to avoid hydration mismatch
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    loginFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCredentials: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
    },
  },
});

export const { loginRequest, loginSuccess, loginFail, setCredentials, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;
