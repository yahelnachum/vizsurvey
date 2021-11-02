import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "../features/questionSlice";
import { questionsAPISlice } from "../features/questionsApiSlice";

export const store = configureStore({
  reducer: {
    answer: questionReducer,
    [questionsAPISlice.reducerPath]: questionsAPISlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionsAPISlice.middleware),
});
