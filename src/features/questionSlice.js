import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { csv, max } from "d3";
import { Octokit, App } from "octokit";

const gistToken = "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";
const gistQuestionId = "f8095509f669e2a3ac98bbfa586d16d9";
const gistAnswerId = "d2d5617ce3c6b4436ec781854ba10341";
const gistQuestionURL = `https://gist.githubusercontent.com/pcordone/${gistQuestionId}/raw/`;

export const Answer = {
  Unitialized: "Unitialized",
  Earlier: "Earlier",
  Later: "Later",
};

export const Status = {
  Unitialized: "Unitialized",
  Fetching: "Fetching",
  Fetched: "Fetched",
  Error: "Error",
};

// Define the initial state of the store for this slicer.
const initialState = {
  questions: [],
  currentQuestion: 0,
  status: "Unitialized",
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  async () => {
    const response = await csv(gistQuestionURL);
    response.forEach((e) => {
      e.question_set = +e.question_set;
      e.position = +e.position;
      e.amount_earlier = +e.amount_earlier;
      e.time_earlier = +e.time_earlier;
      e.amount_later = +e.amount_later;
      e.time_later = +e.time_later;
      e.choice = Answer.Unitialized;
      //return response;
    });
    return response;
  }
);

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  async (answersCSV) => {
    // TODO commit the results to gist
    const octokit = new Octokit({
      userAgent: "thesis_answers/v1.0",
      auth: gistToken,
    });
    const url = `PATCH /gists/${gistAnswerId}`;
    const response = await octokit.request(url, {
      gist_id: gistAnswerId,
      description: "description",
      files: { "answers-subject-x.csv": { content: answersCSV } },
    });
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
      state.questions.currentQuestion +=
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
          //state.status = "Fetching";
        }
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.currentQuestion = 0;
        state.status = Status.Fetched;
        //state.status = "Fetched";
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        if (state.status === "pending") {
          state.status = Status.Error;
          //state.status = "Error";
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

export const isLastQuestion = (state) => {
  const result =
    state.questions.currentQuestion === state.questions.questions.length - 1;
  console.log(result);
  return result;
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

// Action creators are generated for each case reducer function
export const { answer, nextQuestion, previousQuestion } = questionSlice.actions;

export default questionSlice.reducer;
