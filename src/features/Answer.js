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
    choiceTimestamp,
    highup,
    lowdown
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
    this.highup = highup;
    this.lowdown = lowdown;
  }

  setAnswer(choiceTimestamp, choice) {
    this.choiceTimestamp = choiceTimestamp;
    this.choice = choice;
  }

  static create(
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater,
    choice,
    highup,
    lowdown
  ) {
    return new Answer(
      amountEarlier,
      timeEarlier,
      dateEarlier,
      amountLater,
      timeLater,
      dateLater,
      choice,
      highup,
      lowdown
    );
  }
}
