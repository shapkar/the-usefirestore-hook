import type { DocumentExample } from 'models/documentExample';
import { createGenericSlice, GenericState } from './generic';


interface DocumentState {
    data?: Notification
};

const initialState: DocumentState = {

};

const slice = createGenericSlice({
  name: 'documentexample',
  initialState: initialState as GenericState<DocumentExample>,
  reducers: {},
})

export const actions = slice.actions;

export default slice.reducer;
