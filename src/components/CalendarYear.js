import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { select } from "d3";
import * as d3 from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";
import { drawCalendar } from "./CalendarHelper";

function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const monthsMatrix = [
    [
      DateTime.local(q.dateEarlier.year, 1, 1),
      DateTime.local(q.dateEarlier.year, 2, 1),
      DateTime.local(q.dateEarlier.year, 3, 1),
      DateTime.local(q.dateEarlier.year, 4, 1),
    ],
    [
      DateTime.local(q.dateEarlier.year, 5, 1),
      DateTime.local(q.dateEarlier.year, 6, 1),
      DateTime.local(q.dateEarlier.year, 7, 1),
      DateTime.local(q.dateEarlier.year, 8, 1),
    ],
    [
      DateTime.local(q.dateEarlier.year, 9, 1),
      DateTime.local(q.dateEarlier.year, 10, 1),
      DateTime.local(q.dateEarlier.year, 11, 1),
      DateTime.local(q.dateEarlier.year, 12, 1),
    ],
  ];

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;
  const monthTdSquareSizeIn = Math.min(q.heightIn / 3, q.widthIn / 4);
  const monthTdSquareSizePx = Math.round(monthTdSquareSizeIn * dpi);

  // eslint-disable-next-line no-unused-vars
  var dragAmount = null;

  const result = (
    <div>
      <table
        id="year-calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          // eslint-disable-next-line no-unused-vars
          (table) => {
            const yearTable = d3
              .select("#year-calendar")
              .data([null])
              .join("table");
            const yearHead = yearTable
              .selectAll("#year-head")
              .data([null])
              .join("thead")
              .attr("id", "year-head");
            yearHead
              .selectAll("#year-head-row")
              .data([null])
              .join("tr")
              .attr("id", "year-head-row")
              .style("text-align", "center")
              .selectAll("#year-cell")
              .data([q.dateEarlier])
              .join("td")
              .attr("id", "year-cell")
              .attr("style", "font-size: large")
              .attr("colspan", 7)
              .text((d) => d.year);
            const yearBody = yearTable
              .selectAll("#year-calendar-body")
              .data([null])
              .join("tbody")
              .attr("id", "year-calendar-body");
            yearBody
              .selectAll(".months-rows")
              .data(monthsMatrix)
              .join("tr")
              .attr("class", "months-rows")
              .selectAll(".months-cells")
              .data(
                (d) => d,
                (d) => d
              )
              .join("td")
              .attr("class", "months-cells")
              .attr("width", () => monthTdSquareSizePx)
              .attr("height", () => monthTdSquareSizePx)
              .each(function (monthDate) {
                const yearTd = select(this);
                drawCalendar({
                  table: yearTd,
                  question: q,
                  monthDate: monthDate,
                  tableWidthIn: monthTdSquareSizeIn,
                  showYear: false,
                  showAmountOnBar: false,
                  dragCallback: (amount) => {
                    dragAmount = amount;
                  },
                  dispatchCallback: (answer) => {
                    dispatch(answer);
                  },
                });
              });
          },
          [q]
        )}
      ></table>
      {q.interaction === InteractionType.drag ? (
        <Formik
          initialValues={{ choice: ChoiceType.Unitialized }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: ChoiceType.earlier,
                  choiceTimestamp: DateTime.local(),
                })
              );
              setSubmitting(false);
              resetForm();
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        ""
      )}
    </div>
  );

  if (status === StatusType.Complete) {
    return <Redirect to="/vizsurvey/thankyou" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now()));
    return result;
  }
}

export default Calendar;
