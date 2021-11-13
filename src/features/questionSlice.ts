import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { csv, DSVRowString, max } from "d3";

export enum Answer {
  Unitialized,
  Earlier,
  Later,
};

export enum Status  {
  Unitialized,
  Fetching,
  Fetched,
  Error,
};

type Question = {
  question_set: number,
  position: number,
  amount_earlier: number,
  time_earlier: number,
  amount_later: number,
  time_later: number,
  choice: Answer
}

interface QuestionState {
  questions: Array<Question>,
  currentQuestion: number,
  status: Status,
  error?: SerializedError,
}

// Define the initial state of the store for this slicer.
const initialState: QuestionState = {
  questions: [],
  currentQuestion: 0,
  status:Status.Unitialized,
  error: undefined,
};

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  async () => {
    const response = await csv(
      "https://gist.githubusercontent.com/pcordone/f8095509f669e2a3ac98bbfa586d16d9/raw/"
    );
    response.forEach((e) => {
      // @ts-ignore 
      e.question_set = +e.question_set!;
      // @ts-ignore 
      e.position = +e.position!;
      // @ts-ignore 
      e.amount_earlier = +e.amount_earlier!;
      // @ts-ignore 
      e.time_earlier = +e.time_earlier!;
      // @ts-ignore 
      e.amount_later = +e.amount_later!;
      // @ts-ignore 
      e.time_later = +e.time_later!;
      // @ts-ignore 
      e.choice = Answer.Unitialized;
      return response;
    });
    return response;
  }
);

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState, // the initial state of our global data (under name slice)
  reducers: {
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.questions[state.currentQuestion].choice = action.payload;
      state.currentQuestion +=
        state.currentQuestion < state.questions.length - 1 ? 1 : 0;
    },
    nextQuestion(state, action) {
      state.currentQuestion +=
        state.currentQuestion < state.questions.length - 1 ? 1 : 0;
    },
    previousQuestion(state, action) {
      state.currentQuestion -= state.currentQuestion > 0 ? 1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state, action) => {
        if (state.status === Status.Unitialized) {
          state.status = Status.Fetching;
        }
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.currentQuestion = 0;
        state.status = Status.Fetched;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        if (state.status === Status.Unitialized) {
          state.status = Status.Error;
          state.error = action.error;
        }
      });
  },
});

export const selectMaxTime = (state) => {
  return max(state.questions.questions, (d) => d.time_later);
};

export const selectMaxAmount = (state) => {
  return max(state.questions.questions, (d) =>
    d.amount_earlier > d.amount_later ? d.amount_earlier : d.amount_greater
  );
};

export const selectAllQuestions = (state) => {
  return state.questions.questions;
};

export const selectCurrentQuestion = (state) => {
  return state.questions.questions[state.questions.currentQuestion];
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

// Action creators are generated for each case reducer function
export const { answer, nextQuestion, previousQuestion } = questionSlice.actions;

export default questionSlice.reducer;
