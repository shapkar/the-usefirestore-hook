import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionCreatorWithPreparedPayload
} from '@reduxjs/toolkit';

export enum StateStatus {
  Loading,
  Error,
  Done
}

export interface GenericState<T> {
  data?: T;
  status?: StateStatus;
  errors?: any;
}

export const createGenericSlice = <
  T,
  Reducers extends SliceCaseReducers<GenericState<T>>
>({
  name = '',
  initialState,
  reducers
}: {
  name: string;
  initialState: GenericState<T>;
  reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>;
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      loading(state) {
        state.status = StateStatus.Loading;
      },
      success(state: GenericState<T>, action: PayloadAction<T>) {
        state.data = action.payload;
        state.status = StateStatus.Done;
      },
      error(state: GenericState<T>, action: PayloadAction<any>) {
        state.errors = action.payload;
        state.status = StateStatus.Error;
      },
      ...reducers
    }
  });
};

export type GenericActions<T> = {
  loading: ActionCreatorWithoutPayload<string>;
  success: ActionCreatorWithPayload<T, string> | ActionCreatorWithPreparedPayload<any, T, string, never, never>;
  error: ActionCreatorWithOptionalPayload<any, string>;
};
