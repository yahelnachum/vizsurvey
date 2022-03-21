export class Answer {
  constructor(choice, shownTimestamp, choiceTimestamp) {
    this.choice = choice;
    this.shownTimestamp = shownTimestamp;
    this.choiceTimestamp = choiceTimestamp;
  }

  setAnswer(choiceTimestamp, choice) {
    this.choiceTimestamp = choiceTimestamp;
    this.choice = choice;
  }

  static create() {
    return new Answer(null, null, null);
  }
}
