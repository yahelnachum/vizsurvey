import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchQuestions,
  fetchStatus,
  Status,
  setQuestionSet,
} from "../features/questionSlice";
import ReactLoading from "react-loading";

export function QueryParam() {
  const dispatch = useDispatch();
  const loadingStatus = useSelector(fetchStatus);
  const search = useLocation().search;
  const questionSetId = new URLSearchParams(search).get("treatment_id");

  dispatch(setQuestionSet(questionSetId));

  useEffect(() => {
    if (loadingStatus === Status.Unitialized) {
      dispatch(fetchQuestions(questionSetId));
    }
  }, [loadingStatus, dispatch]);

  return (
    <div>
      {loadingStatus === Status.Fetching && (
        <ReactLoading type="spinningBubbles" color="#444" />
      )}
    </div>
  );
}

export default QueryParam;
