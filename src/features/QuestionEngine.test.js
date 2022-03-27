import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine";
import { ViewType } from "./ViewType";
import { ChoiceType } from "./ChoiceType";
import { TitrationType } from "./TitrationType";
import { QuestionAndAnswer } from "./QuestionAndAnswer";
import { Question } from "./Question";

describe("QuestionEngine tests", () => {
  test("1: Initial question and answer will initialize to empty answer array and highup and lowdown to undefined.", () => {
    const q = TestDataFactory.createQuestionLaterTitrate();
    const state = {
      QandA: [QuestionAndAnswer.create(q)],
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
        QuestionAndAnswer.create(
          TestDataFactory.createQuestionLaterTitrate(),
          1000,
          undefined
        ),
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
        QuestionAndAnswer.create(
          TestDataFactory.createQuestionNoTitrate(),
          undefined,
          undefined
        ),
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
    const QandA = QuestionAndAnswer.create(
      TestDataFactory.createQuestionLaterTitrate()
    );
    QandA.highup = 500;
    QandA.createNextAnswer(
      QandA.question.amountEarlier,
      QandA.question.amountLater
    );
    const a = QandA.latestAnswer;
    const qe = new QuestionEngine();
    // initial condition from paper
    expect(QandA.highup).toBe(500);
    expect(QandA.lowdown).toBeUndefined();
    expect(a.amountEarlier).toBe(500);
    expect(a.amountLater).toBe(1000);
    QandA.setLatestAnswer(ChoiceType.earlier, null);
    // first calc from paper example
    expect(qe.calcTitrationAmount(undefined, 500)).toBe(250);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBeUndefined();
    QandA.latestAnswer.amountLater = 1250;
    QandA.setLatestAnswer(ChoiceType.later, null);
    // second calc from paper example
    expect(qe.calcTitrationAmount(1250, 1000)).toBe(120);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBe(1250);
    QandA.latestAnswer.amountLater = 1120;
    QandA.setLatestAnswer(ChoiceType.later, null);
    // third calc from paper example
    expect(qe.calcTitrationAmount(1130, 1000)).toBe(60);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1000);
    expect(QandA.lowdown).toBe(1120);
    QandA.latestAnswer.amountLater = 1060;
    QandA.setLatestAnswer(ChoiceType.earlier, null);
    // fourth calc from paper example
    expect(qe.calcTitrationAmount(1120, 1060)).toBe(30);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1060);
    expect(QandA.lowdown).toBe(1120);
    QandA.latestAnswer.amountLater = 1090;
    QandA.setLatestAnswer(ChoiceType.later, null);
    // fifth calc from paper example
    expect(qe.calcTitrationAmount(1090, 1060)).toBe(10);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1060);
    expect(QandA.lowdown).toBe(1090);
    QandA.latestAnswer.amountLater = 1070;
    QandA.setLatestAnswer(ChoiceType.earlier, null);
    // sixth calc from paper example
    expect(qe.calcTitrationAmount(1070, 1060)).toBe(0);
    qe.updateHighupOrLowdown(QandA);
    expect(QandA.highup).toBe(1070);
    expect(QandA.lowdown).toBe(1090); // different from the paper
  });

  test("Integration test QuestionEngine titrationfrom Read 2001 paper.", () => {
    const testQandA = QuestionAndAnswer.create(
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
    expect(cQA.latestAnswer.amountEarlier).toBe(500);
    expect(cQA.latestAnswer.amountLater).toBe(1000);
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
    expect(cQA.latestAnswer.amountEarlier).toBe(500);
    expect(cQA.latestAnswer.amountLater).toBe(1250);
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
    expect(cQA.latestAnswer.amountEarlier).toBe(500);
    expect(cQA.latestAnswer.amountLater).toBe(1120);
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: DateTime.now(),
      },
    });
  });
});

class TestDataFactory {
  static createQuestionLaterTitrate() {
    return new Question({
      treatmentId: 1,
      position: 1,
      viewType: ViewType.enumValueOf("barchart"),
      titration: TitrationType.enumValueOf("laterAmount"),
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
      viewType: ViewType.enumValueOf("barchart"),
      titration: TitrationType.enumValueOf("none"),
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
