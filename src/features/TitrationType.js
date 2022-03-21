import { Enumify } from "enumify";

export class TitrationType extends Enumify {
  static none = new TitrationType();
  static earlierAmount = new TitrationType();
  static laterAmount = new TitrationType();
  static _ = this.closeEnum();
}
