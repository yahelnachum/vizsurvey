export class Answer {
  constructor({
    amountEarlier: amountEarlier,
    timeEarlier: timeEarlier,
    dateEarlier: dateEarlier,
    amountLater: amountLater,
    timeLater: timeLater,
    dateLater: dateLater,
    choice: choice,
    shownTimestamp: shownTimestamp,
    choiceTimestamp: choiceTimestamp,
    highup: highup,
    lowdown: lowdown,
  }) {
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

  static create({
    amountEarlier: amountEarlier,
    timeEarlier: timeEarlier,
    dateEarlier: dateEarlier,
    amountLater: amountLater,
    timeLater: timeLater,
    dateLater: dateLater,
    choice: choice,
    highup: highup,
    lowdown: lowdown,
  }) {
    return new Answer({
      amountEarlier: amountEarlier,
      timeEarlier: timeEarlier,
      dateEarlier: dateEarlier,
      amountLater: amountLater,
      timeLater: timeLater,
      dateLater: dateLater,
      choice: choice,
      highup: highup,
      lowdown: lowdown,
    });
  }
}
