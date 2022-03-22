import { Enumify } from "enumify";

export class TitrationStateType extends Enumify {
  static uninitialized = new TitrationStateType();
  static start = new TitrationStateType();
  static topOrBottom = new TitrationStateType();
  static titrate = new TitrationStateType();
  static last = new TitrationStateType();
  static _ = this.closeEnum();
}
