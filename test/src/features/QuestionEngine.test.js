import { QuestionEngine } from "../../../src/features/QuestionEngine";
import { ViewType } from "../../../src/features/ViewType";
import { TitrationType } from "../../../src/features/TitrationType";
import { Question } from "../../../src/features/Question";

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
  };
  const qe = new QuestionEngine();
  qe.startSurvey(state);

  test("nextQuestion should create the titration schedule in state at the start of the titration.", () => {
    expect(state.).toBe(3);
  });
});
