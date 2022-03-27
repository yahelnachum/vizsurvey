import { StatusType } from "./StatusType";
import { TitrationType } from "./TitrationType";
import { ChoiceType } from "./ChoiceType";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

export class QuestionEngine {
  constructor() {}

  allQuestions(state) {
    return state.questions.QandA;
  }

  currentQuestionAndAnswer(state) {
    return state.QandA[state.currentQuestionIdx];
  }

  startSurvey(state) {
    state.currentQuestionIdx = 0;
    const cqa = this.currentQuestionAndAnswer(state);
    cqa.highup = cqa.question.amountEarlier;
    cqa.lowdown = undefined;
    cqa.createNextAnswer(cqa.question.amountEarlier, cqa.question.amountLater);
  }

  setCurrentQuestionShown(state, action) {
    this.currentQuestionAndAnswer(state).latestAnswer.shownTimestamp =
      action.payload;
  }

  isLastQandA(state) {
    return state.currentQuestionIdx === state.QandA.length - 1;
  }

  incNextQuestion(state) {
    if (this.isLastQandA(state)) {
      state.status = StatusType.Complete;
    } else {
      state.currentQuestionIdx += 1;
      const cqa = this.currentQuestionAndAnswer(state);
      cqa.createNextAnswer(
        cqa.question.amountEarlier,
        cqa.question.amountLater
      );
    }
  }

  updateHighupOrLowdown(currentQandA) {
    console.assert(
      currentQandA.question.titration !== TitrationType.none,
      "Question titration value not set before calling updateHighupOrLowdown."
    );
    console.assert(
      currentQandA.choice !== null &&
        currentQandA.choice !== ChoiceType.unitialized
    );
    const ca = currentQandA.latestAnswer;
    switch (ca.choice) {
      case ChoiceType.earlier:
        var possibleHighup =
          currentQandA.question.titration === TitrationType.laterAmount
            ? ca.amountLater
            : ca.amountEarlier;
        if (!currentQandA.highup || possibleHighup > currentQandA.highup)
          currentQandA.highup = possibleHighup;
        break;
      case ChoiceType.later:
        var possibleLowdown =
          currentQandA.question.titration === TitrationType.laterAmount
            ? ca.amountLater
            : ca.amountEarlier;
        if (!currentQandA.lowdown || possibleLowdown < currentQandA.lowdown)
          currentQandA.lowdown = possibleLowdown;
        break;
      default:
        console.assert(
          true,
          "Invalid value for current answer in setAnswerCurrentQuestion"
        );
        break;
    }
  }

  calcTitrationAmount(lowdown, highup) {
    const difference = lowdown ? lowdown - highup : highup;
    var result = difference / 2;
    result = result / 10.0;
    result = parseInt(result);
    result = result * 10;
    return result;
  }

  calcEarlierAndLaterAmounts(QandA, titrationAmount) {
    var earlierAmount;
    var laterAmount;
    const currentAnswer = QandA.latestAnswer;
    switch (currentAnswer.choice) {
      case ChoiceType.earlier:
        earlierAmount =
          QandA.question.titration === TitrationType.earlierAmount
            ? currentAnswer.amountEarlier - titrationAmount
            : QandA.question.amountEarlier;
        laterAmount =
          QandA.question.titration === TitrationType.laterAmount
            ? currentAnswer.amountLater + titrationAmount
            : QandA.question.amountLater;
        return { earlierAmount, laterAmount };
      case ChoiceType.later:
        earlierAmount =
          QandA.question.titration === TitrationType.earlierAmount
            ? currentAnswer.amountEarlier + titrationAmount
            : QandA.question.amountEarlier;
        laterAmount =
          QandA.question.titration === TitrationType.laterAmount
            ? currentAnswer.amountLater - titrationAmount
            : QandA.question.amountLater;
        return { earlierAmount, laterAmount };
      default:
        console.assert(
          true,
          "Invalid value for current answer choice in calcEarlierAndLaterAmounts"
        );
    }
  }

  setAnswerCurrentQuestion(state, action) {
    const cqa = this.currentQuestionAndAnswer(state);
    const cq = cqa.question;
    cqa.setLatestAnswer(
      action.payload.choice,
      action.payload.choiceTimestamp.toFormat(TIMESTAMP_FORMAT)
    );
    if (cq.titration === TitrationType.none) {
      this.incNextQuestion(state);
    } else {
      const titrationAmount = this.calcTitrationAmount(cqa.lowdown, cqa.highup);
      this.updateHighupOrLowdown(cqa);
      // TODO we need a termination condition for runaway titration
      if (cqa.lowdown - cqa.highup < 10) {
        this.incNextQuestion(state);
      } else {
        const { earlierAmount, laterAmount } = this.calcEarlierAndLaterAmounts(
          cqa,
          titrationAmount
        );
        cqa.createNextAnswer(earlierAmount, laterAmount);
      }
    }
  }
}
