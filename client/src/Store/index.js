import { createSlice, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialAuthState = {
    isLoggedIn: false,
    username:''
  };

const realtimeTextState = {
    details: '',
};

const realtimeTextSlice = createSlice({
  name: 'realtimeText_result',
  initialState: realtimeTextState,
  reducers: {
    setRealtimeText(state,action) {
      state.details = action.payload;
    }
  },
});
  
const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
      login(state,action) {
        var loginDetails = {
          username: action.payload,
          isLoggedIn: true
        }
        Cookies.set('rapidupdate-text', JSON.stringify(loginDetails), { expires: 2 });  
        state.isLoggedIn = true;
        state.username = action.payload;
      },
      logout(state) {
        Cookies.remove('rapidupdate-text');
        state.isLoggedIn = false;
        state.username = '';
      },
    },
  });

  const store = configureStore({
    reducer: { auth: authSlice.reducer, realtimeTextResult: realtimeTextSlice.reducer},
  });
  
  const authActions = authSlice.actions;
  const realtimeTextResult = realtimeTextSlice.actions;

  export {authActions, realtimeTextResult};
  export default store;