import { PayloadAction } from '@reduxjs/toolkit';
import { createGenericSlice, GenericState, StateStatus } from './generic';
import { User } from '../models/user';
import * as immer from 'immer';
import _ from 'lodash';

interface UsersState {
    data: User[]
};

const initialState: UsersState = {
    data: []
};

const slice = createGenericSlice({
  name: 'users',
  initialState: initialState as GenericState<User[]>,
  reducers: {
    success(state, action: PayloadAction<User[]>) {
        const updated = immer.produce(state.data, draft => {
            action.payload.forEach(newUser => {
                const index = draft!.findIndex(res => res.id === newUser.id);
                if (index !== -1) {
                    draft![index] = _.merge(draft![index], newUser);
                } else {
                    draft!.push(newUser);
                }
            })
        })
        state.data = updated;
        state.status = StateStatus.Done;
    },
    reset(state) {
        state.data = [];
    }
  }
})

export const actions = slice.actions;

export default slice.reducer;
