import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileIOAdapter } from "./FileIOAdapter";
import { QuestionEngine } from "./QuestionEngine";
import { StatusType } from "./StatusType";

// Define the initial state of the store for this slicer.
const io = new FileIOAdapter();
const qe = new QuestionEngine();

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  io.fetchQuestions
);

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  io.writeAnswers
);

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    treatmentId: null,
    participantId: null,
    questions: [],
    answers: [],
    currentQuestionIdx: 0,
    highup: undefined,
    lowdown: undefined,
    status: StatusType.Unitialized,
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
      qe.setLatestAnswerShown(state, action);
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      qe.answerCurrentQuestion(state, action);
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
        state.questions = action.payload;
        state.status = StatusType.Fetched;
        qe.startSurvey(state);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        if (state.status === StatusType.Fetched) {
          state.status = StatusType.Error;
          state.error = action.error;
        }
      });
  },
});

export const selectAllQuestions = (state) => {
  return qe.allQuestions(state.questions);
};

export const selectCurrentTreatment = (state) => {
  return qe.currentTreatment(state);
};

export const selectCurrentQuestion = (state) => {
  return qe.latestAnswer(state.questions);
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

// Action creators are generated for each case reducer function
export const {
  setQuestionShownTimestamp,
  answer,
  setParticipant,
  setTreatment,
} = questionSlice.actions;

export default questionSlice.reducer;
