import { createAnswer } from "./Answer";
import { ChoiceType } from "./ChoiceType";

export class QuestionAndAnswer {
  constructor(question) {
    this.question = question; // stores the question parameters loaded from CSV
    this.answers = []; // stores the parameters to display and choice for a titration step
    this.highup = undefined; // the current highest value judged as too low
    this.lowdown = undefined; // the current lowest value judged as too high
  }
}

export function createQuestionAndAnswer(question) {
  return new QuestionAndAnswer(question);
}

export function createNextAnswer(QandA, amountEarlier, amountLater) {
  QandA.answers.push(
    createAnswer({
      viewType: QandA.question.viewType,
      amountEarlier: amountEarlier,
      timeEarlier: QandA.question.timeEarlier,
      dateEarlier: QandA.question.dateEarlier,
      amountLater: amountLater,
      timeLater: QandA.question.timeLater,
      dateLater: QandA.question.dateLater,
      maxAmount: QandA.question.maxAmount,
      maxTime: QandA.question.maxTime,
      verticalPixels: QandA.question.verticalPixels,
      horizontalPixels: QandA.question.horizontalPixels,
      choice: ChoiceType.unitialized,
      highup: QandA.highup,
      lowdown: QandA.lowdown,
    })
  );
}

export function latestAnswer(QandA) {
  return QandA.length === 0 ? null : QandA.answers[QandA.answers.length - 1];
}

export function setLatestAnswerChoice(QandA, choice, choiceTimestamp) {
  const a = latestAnswer(QandA);
  a.choice = choice;
  a.choiceTimestamp = choiceTimestamp;
}
