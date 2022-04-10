import { csvParse } from "d3";
// import { Octokit } from "octokit";
// import { DateTime } from "luxon";
import { TREATMENTS_CSV } from "./treatments";
import { Question } from "./Question";
import { ViewType } from "./ViewType";
import { InteractionType } from "./InteractionType";
import { VariableType } from "./VariableType";

export class FileIOAdapter {
  constructor() {}

  fetchQuestions = (treatmentId) => {
    treatmentId = +treatmentId;
    const questions = csvParse(TREATMENTS_CSV, (e) => {
      return this.fromCSVRow(e);
    })
      .filter((d) => d.treatmentId === treatmentId)
      .sort((a, b) =>
        a.position < b.position ? -1 : a.position === b.position ? 0 : 1
      );
    return questions;
  };

  fromCSVRow(row) {
    return new Question({
      treatmentId: +row.treatment_id,
      position: +row.position,
      viewType: ViewType.enumValueOf(row.view_type),
      interaction: InteractionType.enumValueOf(row.interaction),
      variableAmount: VariableType.enumValueOf(row.variable_amount),
      amountEarlier: +row.amount_earlier,
      timeEarlier: row.time_earlier ? +row.time_earlier : undefined,
      dateEarlier: row.date_earlier ? new Date(row.date_earlier) : undefined,
      amountLater: +row.amount_later,
      timeLater: row.time_later ? +row.time_later : undefined,
      dateLater: row.date_later ? new Date(row.date_later) : undefined,
      maxAmount: +row.max_amount,
      maxTime: +row.max_time,
      horizontalPixels: +row.horizontal_pixels,
      verticalPixels: +row.vertical_pixels,
      leftMarginWidthIn: +row.left_margin_width_in,
      bottomMarginHeightIn: +row.bottom_margin_height_in,
      graphWidthIn: +row.graph_width_in,
      graphHeightIn: +row.graph_height_in,
      widthIn: +row.width_in,
      heightIn: +row.height_in,
      comment: row.comment,
    });
  }

  convertToCSV(answers) {
    const header = [
      "treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code",
    ];
    const rows = answers.map(
      (a) =>
        `${a.treatmentId},${a.position},${a.viewType},${a.interaction},${a.variableAmount},${a.amountEarlier},${a.timeEarlier},${a.dateEarlier},${a.amountLater},${a.timeLater},${a.dateLater},${a.maxAmount},${a.maxTime},${a.verticalPixels},${a.horizontalPixels},${a.leftMarginWidthIn},${a.bottomMarginHeightIn},${a.graphWidthIn},${a.graphHeightIn},${a.widthIn},${a.heightIn},${a.choice},${a.shownTimestamp},${a.choiceTimestamp},${a.highup},${a.lowdown},${a.participantCode}`
    );
    return header.concat(rows).join("\n");
  }

  writeAnswers = async (answersCSV, { getState }) => {
    const state = getState();
    console.log(answersCSV);
    console.log(JSON.stringify(state));
    // const octokit = new Octokit({
    //   userAgent: "thesis_answers/v1.0",
    //   // eslint-disable-next-line no-undef
    //   auth: atob(process.env.REACT_APP_AUTH_TOKEN),
    // });
    // // eslint-disable-next-line no-undef
    // const gistAnswerId = process.env.REACT_APP_GIST_ANSWER_ID;
    // const url = `PATCH /gists/${gistAnswerId}`;
    // const now = DateTime.now().toFormat("yyyy-MM-dd-H-mm-ss-SSS-ZZZZ");
    // const files = {};
    // answersCSV = `${answersCSV}`;
    // files[`answers-subject-${state.questions.participant_id}-${now}.csv`] = {
    //   content: answersCSV,
    // };
    // const description = `Answer results for participant ${state.questions.participant_id} at ${now}`;
    // console.log("submitting answers for " + description);
    // const payloadObj = {
    //   gist_id: gistAnswerId,
    //   description: description,
    //   files: files,
    // };
    // const response = await octokit.request(url, payloadObj);

    // const status = response.status;
    // console.log("answers submitted with status of " + status);
  };
}
