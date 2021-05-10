import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notificationReducer from '../slices/notification';
import documentExampleReducer from '../slices/documentExample';
import userReducer from '../slices/user';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    documentExample: documentExampleReducer,
    user: userReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
