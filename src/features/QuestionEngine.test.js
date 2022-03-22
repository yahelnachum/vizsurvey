// import React from "react"
// import { render } from "react-testing-library"
// import App from "../../../src/index"
// import { Provider } from "react-redux"
// import configureStore from "redux-mock-store"

import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine";
import { ViewType } from "./ViewType";
import { TitrationType } from "./TitrationType";
import { Question } from "./Question";
import { ChoiceType } from "./ChoiceType";

// treatment_id,position,view_type,titration,no_titration,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,horizontal_pixels,vertical_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,comment
const questionEarlierTitrate = new Question(
  1,
  1,
  ViewType.enumValueOf("barchart"),
  TitrationType.enumValueOf("earlierAmount"),
  10,
  400,
  1,
  undefined,
  500,
  3,
  undefined,
  500,
  8,
  480,
  480,
  0.5,
  0.5,
  6,
  6,
  6.5,
  6.5,
  "Titration earlier amount test case."
);

const questionNoTitrate = new Question(
  1,
  1,
  ViewType.enumValueOf("barchart"),
  TitrationType.enumValueOf("none"),
  10,
  400,
  1,
  undefined,
  500,
  3,
  undefined,
  500,
  8,
  480,
  480,
  0.5,
  0.5,
  6,
  6,
  6.5,
  6.5,
  "No titration test case."
);

describe("QuestionEngine tests", () => {
  const state = {
    QandA: [questionEarlierTitrate],
    currentQuestionIdx: 0,
    currentQuestionTitrateIdx: 0,
  };
  const qe = new QuestionEngine();
  qe.startSurvey(state);

  test("startSurvey should create an answer array under each Q and A object in state with the titration amounts.", () => {
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.currentQuestionTitrateIdx).toBe(0);
    expect(state.QandA[0].answer).not.toBeUndefined();
    expect(state.QandA[0].answer.length).toBe(10);
    expect(state.QandA[0].answer[0].amountEarlier).toBe(50);
    expect(state.QandA[0].answer[1].amountEarlier).toBe(100);
    expect(state.QandA[0].answer[2].amountEarlier).toBe(150);
    expect(state.QandA[0].answer[3].amountEarlier).toBe(200);
    expect(state.QandA[0].answer[4].amountEarlier).toBe(250);
    expect(state.QandA[0].answer[5].amountEarlier).toBe(300);
    expect(state.QandA[0].answer[6].amountEarlier).toBe(350);
    expect(state.QandA[0].answer[7].amountEarlier).toBe(400);
    expect(state.QandA[0].answer[8].amountEarlier).toBe(450);
    expect(state.QandA[0].answer[9].amountEarlier).toBe(500);
  });

  const action = {
    payload: {
      choice: ChoiceType.earlier,
      choiceTimestamp: DateTime.now,
    },
  };

  qe.setAnswerCurrentQuestion(state);
  test("setAnswerCurrentQuestion should set the answer fields and increment the current question to the correct titration or the next question for no titration.", () => {
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.currentQuestionTitrateIdx).toBe(1);
    expect(state.QandA[0].answer).not.toBeUndefined();
    expect(state.QandA[0].answer.length).toBe(10);
    expect(state.QandA[0].answer[0].amountEarlier).toBe(50);
    expect(state.QandA[0].answer[1].amountEarlier).toBe(100);
    expect(state.QandA[0].answer[2].amountEarlier).toBe(150);
    expect(state.QandA[0].answer[3].amountEarlier).toBe(200);
    expect(state.QandA[0].answer[4].amountEarlier).toBe(250);
    expect(state.QandA[0].answer[5].amountEarlier).toBe(300);
    expect(state.QandA[0].answer[6].amountEarlier).toBe(350);
    expect(state.QandA[0].answer[7].amountEarlier).toBe(400);
    expect(state.QandA[0].answer[8].amountEarlier).toBe(450);
    expect(state.QandA[0].answer[9].amountEarlier).toBe(500);
  });

  const state2 = {
    QandA: [questionNoTitrate],
    currentQuestionIdx: 0,
  };

  const qe2 = new QuestionEngine();
  qe2.startSurvey(state2);
  test("startSurvey should create a single answer entry for each question.", () => {
    expect(state2.currentQuestionIdx).toBe(0);
    expect(state2.currentQuestionTitrateIdx).toBe(0);
    expect(state2.QandA[0].answer).not.toBeUndefined();
    expect(state2.QandA[0].answer.length).toBe(1);
    expect(state2.QandA[0].answer[0].amountEarlier).toBe(400);
  });
});
