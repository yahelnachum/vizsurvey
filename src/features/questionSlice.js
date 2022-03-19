import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { max } from "d3";
import { DateTime } from "luxon";
import { FileDesign } from "./FileDesign";
import { Status } from "./Status";

// Define the initial state of the store for this slicer.
const gistDesign = new FileDesign();

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  gistDesign.fetchQuestions
);

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  gistDesign.writeAnswers
);

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: gistDesign.initialState, // the initial state of our global data (under name slice)
  reducers: {
    setParticipant(state, action) {
      if (state.participantId === null && action.payload !== null) {
        state.participantId = action.payload;
      }
    },
    setQuestionSet(state, action) {
      if (state.treatmentId === null && action.payload !== null) {
        state.treatmentId = action.payload;
      }
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.questions[state.currentQuestion].choice = action.payload;
      state.questions[state.currentQuestion].answerTime =
        DateTime.now().toFormat("MM/dd/yyyy H:mm:ss:SSS ZZZZ");
      state.questions[state.currentQuestion];
      if (state.currentQuestion === state.questions.length - 1) {
        state.status = Status.Complete;
      } else {
        state.currentQuestion += 1;
      }
    },
    nextQuestion(state) {
      state.questions.currentQuestion +=
        state.currentQuestion < state.questions.length ? 1 : 0;
    },
    previousQuestion(state) {
      state.currentQuestion -= state.currentQuestion > 0 ? 1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
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
        if (state.status === Status.Fetched) {
          state.status = Status.Error;
          state.error = action.error;
        }
      });
  },
});

export const selectMaxTime = (state) => {
  return max(state.questions.questions, (d) => d.timeLater);
};

export const selectMaxAmount = (state) => {
  return max(state.questions.questions, (d) =>
    d.amountEarlier > d.amountLater ? d.amountEarlier : d.amountLater
  );
};

export const selectAllQuestions = (state) => {
  return state.questions.questions;
};

export const selectCurrentQuestion = (state) => {
  return state.questions.questions[state.questions.currentQuestion];
};

export const selectparticipantId = (state) => {
  return state.participantId;
};

export const isLastQuestion = (state) => {
  const result =
    state.questions.currentQuestion === state.questions.questions.length - 1;
  return result;
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

// Action creators are generated for each case reducer function
export const {
  answer,
  nextQuestion,
  previousQuestion,
  setParticipant,
  setQuestionSet,
} = questionSlice.actions;

export default questionSlice.reducer;
