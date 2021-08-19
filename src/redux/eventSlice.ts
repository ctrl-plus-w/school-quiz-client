import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IEventState {
  events: Array<IEvent>;
}

const initialState: IEventState = {
  events: [],
};

const addEventsReducer = (state: IEventState, action: PayloadAction<Array<IEvent>>) => {
  state.events = state.events.concat(action.payload);
};

const removeEventReducer = (state: IEventState, action: PayloadAction<number>) => {
  state.events = state.events.filter((event) => event.id !== action.payload);
};

const clearEventsReducer = (state: IEventState) => {
  state.events = [];
};

const eventSlice = createSlice({
  name: 'event',

  initialState: initialState,

  reducers: {
    addEvents: addEventsReducer,
    removeEvent: removeEventReducer,
    clearEvents: clearEventsReducer,
  },
});

export const { addEvents, removeEvent, clearEvents } = eventSlice.actions;

export const selectEvents = (state: RootState): Array<IEvent> | null => state.event.events;

export default eventSlice.reducer;
