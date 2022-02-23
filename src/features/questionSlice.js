import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csv, max } from "d3";
import { Octokit } from "octokit";
import { DateTime } from "luxon";
import { Enumify } from "enumify";

// eslint-disable-next-line no-undef
const gistToken = atob(process.env.REACT_APP_AUTH_TOKEN);
// eslint-disable-next-line no-undef
const gistAnswerId = process.env.REACT_APP_GIST_ANSWER_ID;
// eslint-disable-next-line no-undef
const gistQuestionURL = process.env.REACT_APP_GIST_QUESTION_URL;

export const Answer = {
  Unitialized: "Unitialized",
  Earlier: "Earlier",
  Later: "Later",
};

export const Status = {
  Unitialized: "Unitialized",
  Fetching: "Fetching",
  Fetched: "Fetched",
  Complete: "Complete",
  Error: "Error",
};

export class ViewType extends Enumify {
  static barchart = new ViewType();
  static calendar = new ViewType();
  static _ = this.closeEnum();
}

// Define the initial state of the store for this slicer.
const initialState = {
  questions: [],
  currentQuestion: 0,
  question_set_id: null,
  participant_id: null,
  status: "Unitialized",
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  "survey/getQuestions",
  async (questionSetId /*{ getState }*/) => {
    questionSetId = +questionSetId;
    const response = await csv(gistQuestionURL);
    response.forEach((e) => {
      e.view_type = ViewType.enumValueOf(e.view_type);
      e.question_set_id = +e.question_set_id;
      e.position = +e.position;
      e.amount_earlier = +e.amount_earlier;
      if (e.time_earlier) {
        e.time_earlier = +e.time_earlier;
      }
      if (e.date_earlier) {
        e.date_earlier = Date(e.date_earlier);
      }
      e.amount_later = +e.amount_later;
      if (e.time_later) {
        e.time_later = +e.time_later;
      }
      if (e.date_later) {
        e.date_later = Date(e.date_later);
      }
      e.max_amount = +e.max_amount;
      e.max_time = +e.max_time;
      e.horizontal_pixels = +e.horizontal_pixels;
      e.vertical_pixels = +e.vertical_pixels;
      e.choice = Answer.Unitialized;
      e.answer_time = undefined;
      e.participant_id = undefined;
    });
    const result = response.filter((d) => d.question_set_id === questionSetId);
    return result;
  }
);

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  async (answersCSV, { getState }) => {
    const state = getState();
    const octokit = new Octokit({
      userAgent: "thesis_answers/v1.0",
      auth: gistToken,
    });
    const url = `PATCH /gists/${gistAnswerId}`;
    const now = DateTime.now().toFormat("yyyy-MM-dd-H-mm-ss-SSS-ZZZZ");
    const files = {};
    answersCSV = `${answersCSV}`;
    files[`answers-subject-${state.questions.participant_id}-${now}.csv`] = {
      content: answersCSV,
    };
    const description = `Answer results for participant ${state.questions.participant_id} at ${now}`;
    console.log("submitting answers for " + description);
    const payloadObj = {
      gist_id: gistAnswerId,
      description: description,
      files: files,
    };
    const response = await octokit.request(url, payloadObj);

    const status = response.status;
    console.log("answers submitted with status of " + status);
  }
);

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState, // the initial state of our global data (under name slice)
  reducers: {
    setParticipant(state, action) {
      if (state.participant_id === null && action.payload !== null) {
        state.participant_id = action.payload;
      }
    },
    setQuestionSet(state, action) {
      if (state.questionSetId === null && action.payload !== null) {
        state.question_set_id = action.payload;
      }
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.questions[state.currentQuestion].choice = action.payload;
      state.questions[state.currentQuestion].answer_time =
        DateTime.now().toFormat("MM/dd/yyyy H:mm:ss:SSS ZZZZ");
      state.questions[state.currentQuestion].participant_id =
        state.participant_id;
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

export const selectparticipantId = (state) => {
  return state.participant_id;
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
