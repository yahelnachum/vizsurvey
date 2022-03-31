export class Answer {
  constructor({
    viewType: viewType,
    amountEarlier: amountEarlier,
    timeEarlier: timeEarlier,
    dateEarlier: dateEarlier,
    amountLater: amountLater,
    timeLater: timeLater,
    dateLater: dateLater,
    maxAmount: maxAmount,
    maxTime: maxTime,
    verticalPixels: verticalPixels,
    horizontalPixels: horizontalPixels,
    choice: choice,
    shownTimestamp: shownTimestamp,
    choiceTimestamp: choiceTimestamp,
    highup: highup,
    lowdown: lowdown,
  }) {
    this.viewType = viewType;
    this.amountEarlier = amountEarlier;
    this.timeEarlier = timeEarlier;
    this.dateEarlier = dateEarlier;
    this.amountLater = amountLater;
    this.timeLater = timeLater;
    this.dateLater = dateLater;
    this.maxAmount = maxAmount;
    this.maxTime = maxTime;
    this.verticalPixels = verticalPixels;
    this.horizontalPixels = horizontalPixels;
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
}

export function createAnswer({
  viewType: viewType,
  amountEarlier: amountEarlier,
  timeEarlier: timeEarlier,
  dateEarlier: dateEarlier,
  amountLater: amountLater,
  timeLater: timeLater,
  dateLater: dateLater,
  maxAmount: maxAmount,
  maxTime: maxTime,
  verticalPixels: verticalPixels,
  horizontalPixels: horizontalPixels,
  choice: choice,
  highup: highup,
  lowdown: lowdown,
}) {
  return new Answer({
    viewType: viewType,
    amountEarlier: amountEarlier,
    timeEarlier: timeEarlier,
    dateEarlier: dateEarlier,
    amountLater: amountLater,
    timeLater: timeLater,
    dateLater: dateLater,
    maxAmount: maxAmount,
    maxTime: maxTime,
    verticalPixels: verticalPixels,
    horizontalPixels: horizontalPixels,
    choice: choice,
    highup: highup,
    lowdown: lowdown,
  });
}
