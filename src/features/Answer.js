export class Answer {
  constructor(
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater,
    choice,
    shownTimestamp,
    choiceTimestamp
  ) {
    this.amountEarlier = amountEarlier;
    this.timeEarlier = timeEarlier;
    this.dateEarlier = dateEarlier;
    this.amountLater = amountLater;
    this.timeLater = timeLater;
    this.dateLater = dateLater;
    this.choice = choice;
    this.shownTimestamp = shownTimestamp;
    this.choiceTimestamp = choiceTimestamp;
  }

  setAnswer(choiceTimestamp, choice) {
    this.choiceTimestamp = choiceTimestamp;
    this.choice = choice;
  }

  setShownTimestamp(shownTimestamp) {
    this.shownTimestamp = shownTimestamp;
  }

  static create(
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater
  ) {
    return new Answer(
      amountEarlier,
      timeEarlier,
      dateEarlier,
      amountLater,
      timeLater,
      dateLater
    );
  }
}
