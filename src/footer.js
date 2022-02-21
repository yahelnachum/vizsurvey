import React from "react";
import { version } from "../package.json";
import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "./features/questionSlice";

export const Footer = () => {
  const question = useSelector(selectCurrentQuestion);

  return (
    <div className="footer">
      Version: {version}
      <div className="stickRight">{question ? question.comment : ""}</div>
    </div>
  );
};

export default Footer;
