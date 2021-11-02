import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const answersUrl = [
  "https://gist.github.com/",
  "pcordone/",
  "d2d5617ce3c6b4436ec781854ba10341",
].join("");

export const questionsAPISlice = createApi({
  reducerPath: "questionsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://gist.githubusercontent.com/pcordone/f8095509f669e2a3ac98bbfa586d16d9/raw/",
  }),
  endpoints: (builder) => ({
    fetchQuestions: builder.query({
      query: () => `thesis_questions.csv`,
    }),
  }),
});

export const { useFetchQuestionsQuery } = questionsAPISlice;
