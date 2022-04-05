export class Question {
  constructor({
    treatmentId,
    position,
    viewType,
    interaction,
    variableAmount,
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater,
    maxAmount,
    maxTime,
    horizontalPixels,
    verticalPixels,
    leftMarginWidthIn,
    bottomMarginHeightIn,
    graphWidthIn,
    graphHeightIn,
    width,
    height,
    comment,
  }) {
    this.treatmentId = treatmentId;
    this.position = position;
    this.viewType = viewType;
    this.interaction = interaction;
    this.variableAmount = variableAmount;
    this.amountEarlier = amountEarlier;
    this.timeEarlier = timeEarlier;
    this.dateEarlier = dateEarlier;
    this.amountLater = amountLater;
    this.timeLater = timeLater;
    this.dateLater = dateLater;
    this.maxAmount = maxAmount;
    this.maxTime = maxTime;
    this.horizontalPixels = horizontalPixels;
    this.verticalPixels = verticalPixels;
    this.leftMarginWidthIn = leftMarginWidthIn;
    this.bottomMarginHeightIn = bottomMarginHeightIn;
    this.graphWidthIn = graphWidthIn;
    this.graphHeightIn = graphHeightIn;
    this.width = width;
    this.height = height;
    this.comment = comment;
    this.highup = null;
    this.lowdown = null;
  }
}
