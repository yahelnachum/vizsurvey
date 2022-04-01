import { Enumify } from "enumify";

export class VariableType extends Enumify {
  static none = new VariableType();
  static earlierAmount = new VariableType();
  static laterAmount = new VariableType();
  static _ = this.closeEnum();
}
