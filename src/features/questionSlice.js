import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const Answer = {
  Unitialized: "Unitialized",
  Earlier: "Earlier",
  Later: "Later",
};

export const Condition = {
  Unitialized: "Unitialized",
  AbsoluteMoneyDelayFraming: "AbsoluteMoneyDelayFraming",
  RelativeMoneyDelayFraming: "RelativeMoneyDelayFraming",
  StandardMEL: "StandardMEL",
  RelativeMoneySpeedupFraming: "RelativeMoneySpeedupFraming",
  AbsoluteMoneySpeedupFraming: "AbsoluteMoneySpeedupFraming",
};

export const questionSlice = createSlice({
  name: "answer",
  initialState: {
    question_set: 0,
    position: 0,
    condition: Condition.Unitialized,
    first_amount: 0,
    first_time: 0,
    second_amount: 0,
    second_time: 0,
    choice: Answer.Unitialized,
  },
  reducers: {
    answer(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      console.log(JSON.stringify(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { answer } = questionSlice.actions;

export default questionSlice.reducer;
