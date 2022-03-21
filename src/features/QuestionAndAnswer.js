export class QuestionAndAnswer {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
  }

  static create(question, answer) {
    return new QuestionAndAnswer(question, answer);
  }
}
