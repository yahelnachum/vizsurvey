import { Enumify } from "enumify";

export class InteractionType extends Enumify {
  static none = new InteractionType();
  static drag = new InteractionType();
  static titration = new InteractionType();
  static _ = this.closeEnum();
}
