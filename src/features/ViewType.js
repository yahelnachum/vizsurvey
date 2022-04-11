import { Enumify } from "enumify";

export class ViewType extends Enumify {
  static word = new ViewType();
  static barchart = new ViewType();
  static calendarGraph = new ViewType();
  static calendarWord = new ViewType();
  static calendarIcon = new ViewType();
  static _ = this.closeEnum();
}
