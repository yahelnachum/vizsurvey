import React from "react";
import { version } from "../package.json";

export const Footer = () => (
  <div className="footer">
    <p>Version: {version}</p>
  </div>
);

export default Footer;
