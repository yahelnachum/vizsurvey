import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setTreatmentId } from "../features/questionSlice";

export function QueryParam() {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const treatmentId = new URLSearchParams(search).get("treatment_id");
  dispatch(setTreatmentId(treatmentId));
  return "";
}

export default QueryParam;
