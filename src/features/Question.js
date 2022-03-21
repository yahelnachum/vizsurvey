import { ViewType } from "./ViewType";
import { TitrationType } from "./TitrationType";

export class Question {
  constructor(
    treatmentId,
    position,
    viewType,
    titration,
    noTitration,
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
    comment
  ) {
    console.log("In constructor");
    this.treatmentId = treatmentId;
    this.position = position;
    this.viewType = viewType;
    this.titration = titration;
    this.noTitration = +noTitration;
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
  }

  get titationAmount() {
    switch (this.titration) {
      case TitrationType.earlierAmount:
        return this.earlierAmount;
      case TitrationType.laterAmount:
        return this.laterAmount;
      default:
        return undefined;
    }
  }

  static fromCSVRow(row) {
    console.log("in fromCSVRow");
    return new Question(
      +row.treatment_id,
      +row.position,
      ViewType.enumValueOf(row.view_type),
      TitrationType.enumValueOf(row.titration),
      +row.no_titration,
      +row.amount_earlier,
      row.time_earlier ? +row.time_earlier : undefined,
      row.date_earlier ? new Date(row.date_earlier) : undefined,
      +row.amount_later,
      row.time_later ? +row.time_later : undefined,
      row.date_later ? new Date(row.date_later) : undefined,
      +row.max_amount,
      +row.max_time,
      +row.horizontal_pixels,
      +row.vertical_pixels,
      +row.left_margin_width,
      +row.bottom_margin_height,
      +row.graph_width_in,
      +row.graph_height_in,
      +row.width,
      +row.height,
      row.comment
    );
  }
}
