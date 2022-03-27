import { Answer } from "./Answer";
import { ChoiceType } from "./ChoiceType";

export class QuestionAndAnswer {
  constructor(question) {
    this.question = question; // stores the question parameters loaded from CSV
    this.answers = []; // stores the parameters to display and choice for a titration step
    this.highup = undefined; // the current highest value judged as too low
    this.lowdown = undefined; // the current lowest value judged as too high
  }

  get latestAnswer() {
    console.assert(
      this.answers.length != 0,
      "answer array is empty so there isn't a latest answer to return."
    );
    return this.answers[this.answers.length - 1];
  }

  setLatestAnswer(choice, answerTime) {
    const a = this.answers[this.answers.length - 1];
    a.choice = choice;
    a.answerTime = answerTime;
  }

  createNextAnswer(amountEarlier, amountLater) {
    this.answers.push(
      Answer.create({
        amountEarlier: amountEarlier,
        timeEarlier: this.question.timeEarlier,
        dateEarlier: this.question.dateEarlier,
        amountLater: amountLater,
        timeLater: this.question.timeLater,
        dateLater: this.question.dateLater,
        choice: ChoiceType.unitialized,
        highup: this.highup,
        lowdown: this.lowdown,
      })
    );
  }

  static create(question) {
    return new QuestionAndAnswer(question);
  }
}
