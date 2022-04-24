import { Enumify } from "enumify";

export class AmountType extends Enumify {
  static none = new AmountType();
  static earlierAmount = new AmountType();
  static laterAmount = new AmountType();
  static _ = this.closeEnum();
}
