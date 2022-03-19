import { csvParse } from "d3";
import { Octokit } from "octokit";
import { DateTime } from "luxon";
import { ViewType } from "./ViewType";
import { Answer } from "./Answer";
import { treatmentsCSV } from "./treatments";

export class FileDesign {
  initialState = {
    questions: [],
    currentQuestion: 0,
    treatmentId: null,
    participantId: null,
    status: "Unitialized",
    error: null,
  };

  constructor() {
    console.log("FileDesign constructor");
  }

  fetchQuestions = async (treatmentId) => {
    treatmentId = +treatmentId;
    const response = csvParse(treatmentsCSV, (e) => {
      return {
        viewType: ViewType.enumValueOf(e.view_type),
        treatmentId: +e.treatment_id,
        position: +e.position,
        amountEarlier: +e.amount_earlier,
        timeEarlier: e.time_earlier ? +(+e.time_earlier) : undefined,
        dateEarlier: e.date_earlier ? new Date(e.date_earlier) : undefined,
        amountLater: +e.amount_later,
        timeLater: e.time_later ? +e.time_later : undefined,
        dateLater: e.date_later ? new Date(e.date_later) : undefined,
        maxAmount: +e.max_amount,
        maxTime: +e.max_time,
        horizontalPixels: +e.horizontal_pixels,
        verticalPixels: +e.vertical_pixels,
        choice: Answer.Unitialized,
        answerTime: undefined,
        participantId: undefined,
      };
    });
    const result = response.filter((d) => d.treatmentId === treatmentId);
    return result;
  };

  writeAnswers = async (answersCSV, { getState }) => {
    const state = getState();
    const octokit = new Octokit({
      userAgent: "thesis_answers/v1.0",
      // eslint-disable-next-line no-undef
      auth: atob(process.env.REACT_APP_AUTH_TOKEN),
    });
    // eslint-disable-next-line no-undef
    const gistAnswerId = process.env.REACT_APP_GIST_ANSWER_ID;
    const url = `PATCH /gists/${gistAnswerId}`;
    const now = DateTime.now().toFormat("yyyy-MM-dd-H-mm-ss-SSS-ZZZZ");
    const files = {};
    answersCSV = `${answersCSV}`;
    files[`answers-subject-${state.questions.participant_id}-${now}.csv`] = {
      content: answersCSV,
    };
    const description = `Answer results for participant ${state.questions.participant_id} at ${now}`;
    console.log("submitting answers for " + description);
    const payloadObj = {
      gist_id: gistAnswerId,
      description: description,
      files: files,
    };
    const response = await octokit.request(url, payloadObj);

    const status = response.status;
    console.log("answers submitted with status of " + status);
  };
}
