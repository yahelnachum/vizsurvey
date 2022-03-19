import { Enumify } from "enumify";

export class ViewType extends Enumify {
  static word = new ViewType();
  static barchart = new ViewType();
  static calendar = new ViewType();
  static _ = this.closeEnum();
}
