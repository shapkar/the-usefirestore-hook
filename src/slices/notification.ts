import { PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from 'models/notification';
import { createGenericSlice, GenericState, StateStatus } from './generic';
import {Timestamp} from '@firebase/firestore-types';

interface NotificationsState {
    data: Notification[]
};

const initialState: NotificationsState = {
    data: []
};

const slice = createGenericSlice({
  name: 'notifications',
  initialState: initialState as GenericState<Notification[]>,
  reducers: {
    success: {
      reducer: (state, action: PayloadAction<Notification[]>) => {
        state.data = action.payload;
        state.status = StateStatus.Done;
      },
      prepare: (notifications: Notification[]) => {
        const mapped = notifications.map(n => {
          return {...n, createdAt: (n.createdAt as Timestamp).toDate().toDateString()}
        })
        return {payload: mapped};
      }
    }
  }
})

export const actions = slice.actions;

export default slice.reducer;
