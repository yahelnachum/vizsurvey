import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setParticipant } from "../features/questionSlice";

export function QueryParam() {
  const search = useLocation().search;
  const participantId = new URLSearchParams(search).get("participant");
  const dispatch = useDispatch();

  dispatch(setParticipant(participantId));
  return null;
}

export default QueryParam;
