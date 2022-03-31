import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine";
import { ViewType } from "./ViewType";
import { ChoiceType } from "./ChoiceType";
import { StatusType } from "./StatusType";
import {
  createQuestionAndAnswer,
  createNextAnswer,
  latestAnswer,
  setLatestAnswerChoice,
} from "./QuestionAndAnswer";
import { Question } from "./Question";
import { InteractionType } from "./InteractionType";
import { VariableType } from "./VariableType";

describe("QuestionEngine tests", () => {
  test("1: Initial question and answer will initialize to empty answer array and highup and lowdown to undefined.", () => {
    const q = TestDataFactory.createQuestionLaterTitrate();
    const state = {
      QandA: [createQuestionAndAnswer(q)],
      currentQuestionIdx: 0,
    };
    expect(state.QandA[0].answers).not.toBeUndefined();
    expect(state.QandA[0].answers.length).toBe(0);
    expect(state.QandA[0].highup).toBeUndefined();
    expect(state.QandA[0].lowdown).toBeUndefined();
  });

  test("startSurvey should create a single answer entry for titration question.", () => {
    const state = {
      QandA: [
        createQuestionAndAnswer(TestDataFactory.createQuestionLaterTitrate()),
      ],
      currentQuestionIdx: 0,
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.QandA[0].answers).not.toBeUndefined();
    expect(state.QandA[0].answers.length).toBe(1);
    expect(state.QandA[0].answers[0].amountEarlier).toBe(500);
    expect(state.QandA[0].answers[0].timeEarlier).toBe(1);
    expect(state.QandA[0].answers[0].amountLater).toBe(1000);
    expect(state.QandA[0].answers[0].timeLater).toBe(3);
    expect(state.QandA[0].highup).toBe(500);
    expect(state.QandA[0].lowdown).toBeUndefined();
  });

  test("startSurvey should create a single answer entry for non titraiton question.", () => {
    const state = {
      QandA: [
        createQuestionAndAnswer(TestDataFactory.createQuestionNoTitrate()),
      ],
      currentQuestionIdx: 0,
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.QandA[0].answers).not.toBeUndefined();
    expect(state.QandA[0].answers.length).toBe(1);
    expect(state.QandA[0].answers[0].amountEarlier).toBe(400);
  });

  test("Test example for the values from Read 2001 paper.", () => {
    const QandA = createQuestionAndAnswer(
      TestDataFactory.createQuestionLaterTitrate()
    );
    QandA.highup = 500;
    createNextAnswer(
      QandA,
      QandA.question.amountEarlier,
      QandA.question.amountLater
    );
    const a = latestAnswer(QandA);
    const qe = new QuestionEngine();
    // initial condition from paper uses earlier amount as difference override when calculation titration amount.
    expect(QandA.highup).toBe(500);
    expect(QandA.lowdown).toBeUndefined();
    expect(a.amountEarlier).toBe(500);
    expect(a.amountLater).toBe(1000);
    setLatestAnswerChoice(QandA, ChoiceType.earlier, null);
    // first calc from paper example, use highdown which is initilly set equal to earlier amount
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBeUndefined();
    expect(qe.calcTitrationAmount(undefined, 500, 500)).toBe(250);
    latestAnswer(QandA).amountLater = 1250;
    setLatestAnswerChoice(QandA, ChoiceType.later, null);
    // second calc from paper example there is no lowdown, so passes larger later amount as lowdown
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBe(1250);
    expect(qe.calcTitrationAmount(1250, 1000, null)).toBe(125);
    latestAnswer(QandA).amountLater = 1120;
    setLatestAnswerChoice(QandA, ChoiceType.later, null);
    // third calc from paper example
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBe(1120);
    expect(qe.calcTitrationAmount(1120, 1000, null)).toBe(60);
    latestAnswer(QandA).amountLater = 1060;
    setLatestAnswerChoice(QandA, ChoiceType.earlier, null);
    // fourth calc from paper example
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1060);
    expect(QandA.lowdown).toBe(1120);
    expect(qe.calcTitrationAmount(1120, 1060, null)).toBe(30);
    latestAnswer(QandA).amountLater = 1090;
    setLatestAnswerChoice(QandA, ChoiceType.later, null);
    // fifth calc from paper example
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1060);
    expect(QandA.lowdown).toBe(1090);
    expect(qe.calcTitrationAmount(1090, 1060, null)).toBe(15);
    latestAnswer(QandA).amountLater = 1070;
    setLatestAnswerChoice(QandA, ChoiceType.earlier, null);
    // sixth calc from paper example
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1070);
    expect(QandA.lowdown).toBe(1090); // different from the paper
    expect(qe.calcTitrationAmount(1070, 1060, null)).toBe(5);
  });

  test("Integration test QuestionEngine titrationfrom Read 2001 paper.", () => {
    const testQandA = createQuestionAndAnswer(
      TestDataFactory.createQuestionLaterTitrate()
    );

    const state = {
      QandA: [testQandA],
      currentQuestionIdx: 0,
      treatmentId: 1,
      participantId: 1,
      status: "Unitialized",
      error: null,
    };

    const qe = new QuestionEngine();
    qe.startSurvey(state);
    var cQA = qe.currentQuestionAndAnswer(state);
    expect(cQA.highup).toBe(500);
    expect(cQA.lowdown).toBeUndefined();
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1000);
    // first answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.earlier,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1000);
    expect(cQA.lowdown).toBeUndefined();
    expect(cQA.answers.length).toBe(2);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1250);
    // second answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1000);
    expect(cQA.lowdown).toBe(1250);
    expect(cQA.answers.length).toBe(3);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1120);
    // third answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1000);
    expect(cQA.lowdown).toBe(1120);
    expect(cQA.answers.length).toBe(4);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1060);
    // fourth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.earlier,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1060);
    expect(cQA.lowdown).toBe(1120);
    expect(cQA.answers.length).toBe(5);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1090);
    // fifth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1060);
    expect(cQA.lowdown).toBe(1090);
    expect(cQA.answers.length).toBe(6);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1070);
    // sixth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        // the paper said the last choice was earlier; however, I think it is wrong and meant later.
        // Choice of later seems to make the last value of lowdown work according to the algorithm
        // I derived from the earlier steps in the example.
        choice: ChoiceType.later,
        choiceTimestamp: DateTime.now(),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Complete");
    expect(state.error).toBeNull();
    expect(cQA.highup).toBe(1060);
    expect(cQA.lowdown).toBe(1070);
    expect(cQA.answers.length).toBe(6);
    expect(latestAnswer(cQA).amountEarlier).toBe(500);
    expect(latestAnswer(cQA).amountLater).toBe(1070);
    expect(state.status).toBe(StatusType.Complete);
  });
});

class TestDataFactory {
  static createQuestionLaterTitrate() {
    return new Question({
      treatmentId: 1,
      position: 1,
      viewType: ViewType.barchart,
      interaction: InteractionType.titration,
      variableAmount: VariableType.laterAmount,
      amountEarlier: 500,
      timeEarlier: 1,
      dateEarlier: undefined,
      amountLater: 1000,
      timeLater: 3,
      dateLater: undefined,
      maxAmount: 2000,
      maxTime: 8,
      horizontalPixels: 480,
      verticalPixels: 480,
      leftMarginWidthIn: 0.5,
      bottomMarginHeightIn: 0.5,
      graphWidthIn: 6,
      graphHeightIn: 6,
      width: 6.5,
      height: 6.5,
      comment: "Titration earlier amount test case.",
    });
  }

  static createQuestionNoTitrate() {
    return new Question({
      treatmentId: 1,
      position: 1,
      viewType: ViewType.barchart,
      interaction: InteractionType.none,
      variableAmount: VariableType.laterAmount,
      amountEarlier: 400,
      timeEarlier: 1,
      dateEarlier: undefined,
      amountLater: 500,
      timeLater: 3,
      dateLater: undefined,
      maxAmount: 500,
      maxTime: 8,
      horizontalPixels: 480,
      verticalPixels: 480,
      leftMarginWidthIn: 0.5,
      bottomMarginHeightIn: 0.5,
      graphWidthIn: 6,
      graphHeightIn: 6,
      width: 6.5,
      height: 6.5,
      comment: "No titration test case.",
    });
  }
}
