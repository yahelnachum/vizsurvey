import MELForm from "./MELForm";
import BarChart from "./BarChart";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";
import { ViewType } from "../features/ViewType";
import { selectCurrentQuestion } from "../features/questionSlice";

export function Survey() {
  const question = useSelector(selectCurrentQuestion);

  // Got from https://stackoverflow.com/questions/31217268/center-div-on-the-middle-of-screen
  const divCenterContentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={divCenterContentStyle}>
      {question.viewType === ViewType.barchart ? (
        <BarChart />
      ) : question.viewType === ViewType.word ? (
        <MELForm />
      ) : (
        <Calendar
          top_margin="20"
          right_margin="20"
          bottom_margin="30"
          left_margin="30"
        />
      )}
    </div>
  );
}

export default Survey;
