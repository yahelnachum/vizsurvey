import { ViewType } from "./ViewType";

export class Question {
  constructor(
    treatmentId,
    position,
    viewType,
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
    height
  ) {
    console.log("In constructor");
    this.treatmentId = treatmentId;
    this.position = position;
    this.viewType = viewType;
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
  }

  static fromCSVRow(row) {
    console.log("in fromCSVRow");
    return new Question(
      +row.treatment_id,
      +row.position,
      ViewType.enumValueOf(row.view_type),
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
      +row.height
    );
  }
}
