import { StatusType } from "./StatusType";
import { VariableType } from "./VariableType";
import { InteractionType } from "./InteractionType";
import { ChoiceType } from "./ChoiceType";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

// TODO Need to capture errors in processing by settings state.status = StatusType.Error
export class QuestionEngine {
  constructor() {}

  allQuestions(state) {
    return state.QandA;
  }

  currentQuestionAndAnswer(state) {
    const result = state.QandA[state.currentQuestionIdx];
    return result;
  }

  startSurvey(state) {
    state.currentQuestionIdx = 0;
    const cqa = this.currentQuestionAndAnswer(state);
    cqa.highup =
      cqa.question.variableAmount === VariableType.laterAmount
        ? cqa.question.amountEarlier
        : cqa.question.amountLater;
    cqa.lowdown = undefined;
    cqa.createNextAnswer(cqa.question.amountEarlier, cqa.question.amountLater);
    console.log("startSurvey presenting:");
    //console.log(JSON.stringify(cqa.latestAnswer()));
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
      currentQandA.question.variableAmount !== VariableType.none,
      "Question variable amount value not set before calling updateHighupOrLowdown."
    );
    console.assert(
      currentQandA.choice !== null &&
        currentQandA.choice !== ChoiceType.unitialized
    );
    const ca = currentQandA.latestAnswer;
    switch (ca.choice) {
      case ChoiceType.earlier:
        var possibleHighup =
          currentQandA.question.variableAmount === VariableType.laterAmount
            ? ca.amountLater
            : ca.amountEarlier;
        if (!currentQandA.highup || possibleHighup > currentQandA.highup)
          currentQandA.highup = possibleHighup;
        break;
      case ChoiceType.later:
        var possibleLowdown =
          currentQandA.question.variableAmount === VariableType.laterAmount
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

  calcTitrationAmount(titratingAmount, highup, override) {
    return (override ? override : titratingAmount - highup) / 2;
  }

  calcNewAmount(QandA, titrationAmount) {
    var adjustmentAmount;
    switch (QandA.question.variableAmount) {
      case VariableType.laterAmount:
        console.assert(
          QandA.latestAnswer.choice &&
            QandA.latestAnswer.choice !== ChoiceType.unitialized
        );
        adjustmentAmount =
          QandA.latestAnswer.choice === ChoiceType.earlier
            ? titrationAmount
            : -1 * titrationAmount;
        return (
          parseInt((QandA.latestAnswer.amountLater + adjustmentAmount) / 10) *
          10
        );
      case VariableType.earlierAmount:
        adjustmentAmount =
          QandA.latestAnswer.choice === ChoiceType.earlier
            ? -1 * titrationAmount
            : titrationAmount;
        return (
          parseInt((QandA.latestAnswer.amountEarlier + adjustmentAmount) / 10) *
          10
        );
      default:
        console.assert(
          true,
          "Invalid value for question titration type in calcEarlierAndLaterAmounts"
        );
        break;
    }
  }

  answerCurrentQuestion(state, action) {
    const cqa = this.currentQuestionAndAnswer(state);
    const cq = cqa.question;
    cqa.setLatestAnswer(
      action.payload.choice,
      action.payload.choiceTimestamp.toFormat(TIMESTAMP_FORMAT)
    );
    if (
      cq.interaction === InteractionType.none ||
      cq.interaction === InteractionType.drag
    ) {
      this.incNextQuestion(state);
    } else if (cq.interaction === InteractionType.titration) {
      const titrationAmount = this.calcTitrationAmount(
        cqa.question.variableAmount === VariableType.laterAmount
          ? cqa.latestAnswer.amountLater
          : cqa.latestAnswer.amountEarlier,
        cqa.highup,
        cqa.isFirstAnswer ? cqa.highup : null
      );
      this.updateHighupOrLowdown(cqa);
      // TODO we need a termination condition for runaway titration
      if (cqa.lowdown - cqa.highup <= 10) {
        this.incNextQuestion(state);
      } else {
        const newAmount = this.calcNewAmount(cqa, titrationAmount);
        if (cq.variableAmount === VariableType.laterAmount) {
          cqa.createNextAnswer(cqa.question.amountEarlier, newAmount);
        } else if (cq.variableAmount === VariableType.earlierAmount) {
          cqa.createNextAnswer(newAmount, cqa.question.amountLater);
        } else {
          console.assert(
            true,
            "Titration not set to amountEarlier or amountLater before calling answerCurrentQuestion"
          );
        }
      }
    }
  }
}
