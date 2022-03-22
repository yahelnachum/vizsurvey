export class QuestionAndAnswer {
  constructor(question) {
    /**
     * question stores the question parameters loaded from the treatments configuration and is used
     * to create instances of answer with the questions parameters.
     */
    this.question = question;
    /**
     * answer is an array to store titration question parameters (like earlier amounts used in the
     * titraiton) and to capture all answer information like shown timestamp, answered timestamp
     */
    this.answers = [];
  }

  static create(question) {
    return new QuestionAndAnswer(question);
  }
}
