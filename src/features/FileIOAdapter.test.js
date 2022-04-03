import { FileIOAdapter } from "./FileIOAdapter";
import { InteractionType } from "./InteractionType";
import { VariableType } from "./VariableType";
import { ViewType } from "./ViewType";
import { TestDataFactory } from "./QuestionEngine.test";

describe("FileIOAdapter tests", () => {
  test("Validate treatment CSV fields are loaded correctly.", async () => {
    const io = new FileIOAdapter();
    const questions = await io.fetchQuestions(1);
    expect(questions.length).toBe(1);
    expect(questions[0].treatmentId).toBe(1);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.word);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(VariableType.none);
    expect(questions[0].amountEarlier).toBe(500);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(1000);
    expect(questions[0].timeLater).toBe(3);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBe(0);
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBe(0);
    expect(questions[0].verticalPixels).toBe(0);
    expect(questions[0].leftMarginWidthIn).toBeNaN();
    expect(questions[0].bottomMarginHeightIn).toBeNaN();
    expect(questions[0].graphWidthIn).toBe(0);
    expect(questions[0].graphHeightIn).toBe(0);
    expect(questions[0].width).toBeNaN();
    expect(questions[0].height).toBeNaN();
    expect(questions[0].comment).toBe("Read 2001 example, absolute size");
  });

  const io = new FileIOAdapter();
  const answers = [TestDataFactory.createInitialAnswerTitrate()];
  const result = io.convertToCSV(answers);
  expect(result)
    .toBe(`treatment_id,position,view_type,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,choice,shown_timestamp,answer_timestamp,highup,lowdown,participant_code
1, undefined, ViewType.barchart, 500, 1, undefined, 1000, 3, undefined, , 2000, 8, undefined, ,null, null, null, null, undefined`);
});
