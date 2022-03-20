import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { max } from "d3";
import { DateTime } from "luxon";
import { FileDesign } from "./FileDesign";
import { StatusType } from "./StatusType";

// Define the initial state of the store for this slicer.
const design = new FileDesign();

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  design.fetchQuestions
);

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  design.writeAnswers
);

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    QandA: [],
    currentQuestion: 0,
    treatmentId: null,
    participantId: null,
    status: "Unitialized",
    error: null,
  }, // the initial state of our global data (under name slice)
  reducers: {
    setParticipant(state, action) {
      if (state.participantId === null && action.payload !== null) {
        state.participantId = action.payload;
      }
    },
    setTreatment(state, action) {
      if (state.treatmentId === null && action.payload !== null) {
        state.treatmentId = action.payload;
      }
    },
    setQuestionShownTimestamp(state, action) {
      state.QandA[state.currentQuestion].answer.shownTimestamp = action.payload;
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.QandA[state.currentQuestion].answer.choice = action.payload;
      state.QandA[state.currentQuestion].answerTime = DateTime.now().toFormat(
        "MM/dd/yyyy H:mm:ss:SSS ZZZZ"
      );
      state.QandA[state.currentQuestion];
      if (state.currentQuestion === state.QandA.length - 1) {
        state.status = StatusType.Complete;
      } else {
        state.currentQuestion += 1;
      }
    },
    nextQuestion(state) {
      state.QandA.currentQuestion +=
        state.currentQuestion < state.QandA.length ? 1 : 0;
    },
    previousQuestion(state) {
      state.currentQuestion -= state.currentQuestion > 0 ? 1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        if (state.status === StatusType.Unitialized) {
          state.status = StatusType.Fetching;
        }
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.QandA = action.payload;
        state.currentQuestion = 0;
        state.status = StatusType.Fetched;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        if (state.status === StatusType.Fetched) {
          state.status = StatusType.Error;
          state.error = action.error;
        }
      });
  },
});

export const selectMaxTime = (state) => {
  return max(state.questions.QandA, (d) => d.question.timeLater);
};

export const selectMaxAmount = (state) => {
  return max(state.questions.QandA, (d) =>
    d.question.amountEarlier > d.question.amountLater
      ? d.question.amountEarlier
      : d.question.amountLater
  );
};

export const selectAllQuestions = (state) => {
  return state.questions.QandA;
};

export const selectCurrentQuestion = (state) => {
  const result = state.questions.QandA[state.questions.currentQuestion];
  return result;
};

export const selectparticipantId = (state) => {
  return state.participantId;
};

export const isLastQuestion = (state) => {
  const result =
    state.questions.currentQuestion === state.questions.QandA.length - 1;
  return result;
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

// Action creators are generated for each case reducer function
export const {
  setQuestionShownTimestamp,
  answer,
  nextQuestion,
  previousQuestion,
  setParticipant,
  setTreatment,
} = questionSlice.actions;

export default questionSlice.reducer;
