import { DateTime } from "luxon";
import { StatusType } from "./StatusType";
import { Enumify } from "enumify";
import { TitrationType } from "./TitrationType";
import { Answer } from "./Answer";

export class TitrateStateType extends Enumify {
  static start = new TitrateStateType();
  static topOrBottom = new TitrateStateType();
  static titrate = new TitrateStateType();
  static last = new TitrateStateType();
  static _ = this.closeEnum();
}

export class QuestionEngine {
  constructor() {}

  generateAnswerArray(q) {
    if (q.titration === TitrationType.none) {
      return Array(1).push(
        Answer.create(
          q.amountEarlier,
          q.timeEarlier,
          q.dateEarlier,
          q.amountLater,
          q.timeLater,
          q.dateLater
        )
      );
    }
    return Array(q.noTitration)
      .fill(
        new Answer(
          q.amountEarlier,
          q.timeEarlier,
          q.dateEarlier,
          q.amountLater,
          q.timeLater,
          q.dateLater
        )
      )
      .map((a, i) => {
        a.titration === TitrationType.earlierAmount
          ? (a.earlierAmount = (q.earlierAmount / q.noTitration) * i)
          : (a.laterAmount = (q.laterAmount / q.noTitration) * i);
      });
  }

  startSurvey(state) {
    state.currentQuestionIdx = 0;
    state.currentQuestionTitrateIdx = 0;
    for (const q of state.QandA) {
      q.answer = this.generateAnswerArray(q);
    }
  }

  setCurrentQuestionShown(state, action) {
    state.QandA[state.currentQuestionIdx].answer.shownTimestamp =
      action.payload;
  }

  setAnswerCurrentQuestion(state, action) {
    state.QandA[state.currentQuestionIdx].answer.choice = action.payload;
    state.QandA[state.currentQuestionIdx].answerTime = DateTime.now().toFormat(
      "MM/dd/yyyy H:mm:ss:SSS ZZZZ"
    );
    state.QandA[state.currentQuestionIdx];
    if (state.currentQuestionIdx === state.QandA.length - 1) {
      state.status = StatusType.Complete;
    } else {
      state.currentQuestionIdx += 1;
    }
  }

  nextQuestion(state) {
    state.QandA.currentQuestionIdx +=
      state.currentQuestionIdx < state.QandA.length ? 1 : 0;
  }

  selectAllQuestions(state) {
    return state.questions.QandA;
  }

  getCurrentQuestion(state) {
    return state.questions.QandA[state.questions.currentQuestionIdx];
  }
}
