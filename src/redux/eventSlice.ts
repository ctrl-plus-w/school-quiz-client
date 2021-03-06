import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IEventState {
  events: Array<IEvent>;

  tempEvent: IEvent | null;
}

const initialState: IEventState = {
  events: [],

  tempEvent: null,
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

const setTempEventReducer = (state: IEventState, action: PayloadAction<IEvent>) => {
  state.tempEvent = action.payload;
};

const clearTempEventReducer = (state: IEventState) => {
  state.tempEvent = null;
};

const eventSlice = createSlice({
  name: 'event',

  initialState: initialState,

  reducers: {
    addEvents: addEventsReducer,
    removeEvent: removeEventReducer,
    clearEvents: clearEventsReducer,
    setTempEvent: setTempEventReducer,
    clearTempEvent: clearTempEventReducer,
  },
});

export const { addEvents, removeEvent, clearEvents, clearTempEvent, setTempEvent } = eventSlice.actions;

export const selectEvents = (state: RootState): Array<IEvent> => state.event.events;
export const selectTempEvent = (state: RootState): IEvent | null => state.event.tempEvent;

export default eventSlice.reducer;
