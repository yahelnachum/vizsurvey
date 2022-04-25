/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { groups, select, format, scaleLinear, drag } from "d3";
import * as d3 from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import { monthNames, dayNames } from "./CalendarHelper";
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
import { ViewType } from "../features/ViewType";
import { AmountType } from "../features/AmountType";

var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const earlierDay = q.dateEarlier.day;
  const laterDay = q.dateLater.day;

  const monthsMatrix = [
    [monthNames[0], monthNames[1], monthNames[2], monthNames[3]],
    [monthNames[4], monthNames[5], monthNames[6], monthNames[7]],
    [monthNames[8], monthNames[9], monthNames[10], monthNames[11]],
  ];
  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;
  const monthTdSquareSizeIn = Math.min(q.heightIn / 3, q.widthIn / 4);
  const monthTdSquareSizePx = Math.round(monthTdSquareSizeIn * dpi);

  const earlierDate = q.dateEarlier;
  const laterDate = q.dateLater;

  const result = (
    <div>
      <table
        id="year-calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
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
              .data([laterDate.year])
              .join("td")
              .attr("id", "year-cell")
              .attr("style", "font-size: large")
              .attr("colspan", 7)
              .text((d) => d);
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
              .data((d) => d)
              .join("td")
              .attr("class", "months-cells")
              .attr("width", () => monthTdSquareSizePx)
              .attr("height", () => monthTdSquareSizePx)
              .each(function (monthName, i, nodes) {
                const monthDays = calendarMatrix(
                  laterDate.year,
                  laterDate.month
                );

                const monthDaysAmounts = monthDays.map((week) =>
                  week.map((day) => {
                    return {
                      day: day,
                      amount:
                        day === earlierDay
                          ? q.amountEarlier
                          : day === laterDay
                          ? q.amountLater
                          : null,
                      type:
                        day === earlierDay
                          ? AmountType.earlierAmount
                          : day === laterDay
                          ? AmountType.laterAmount
                          : AmountType.none,
                    };
                  })
                );

                const lastDayOfMonth = Math.max(...[].concat(...monthDays));
                const firstDaysOfWeek = monthDays.reduce((acc, cv) => {
                  return acc.concat(cv[0]);
                }, []);

                const dayTdSquareSizePx = Math.min(
                  monthTdSquareSizePx / monthDays.length,
                  monthTdSquareSizePx / 7
                );

                const createMonthTable = (parentTd) => {
                  const monthTableId = `#month-calendar-table-${monthName}`;
                  const monthHeadId = `#month-calendar-head-${monthName}`;
                  const monthBodyId = `#month-calendar-body-${monthName}`;

                  const monthTable = parentTd
                    .selectAll(monthTableId)
                    .data([null])
                    .join("table")
                    .attr("id", monthTableId);
                  const monthHead = monthTable
                    .selectAll(monthHeadId)
                    .data([null])
                    .join("thead")
                    .attr("id", monthHeadId);
                  monthHead
                    .selectAll(".month-name-row")
                    .data([null])
                    .join("tr")
                    .attr("class", "month-name-row")
                    .selectAll(".month-name-cell")
                    .data([monthName])
                    .join("td")
                    .attr("class", "month-name-cell")
                    .attr("style", "bold; text-align: center;")
                    .attr("colspan", 7)
                    .text((d) => d);
                  monthHead
                    .selectAll(".weekday-name-row")
                    .data([null])
                    .join("tr")
                    .attr("class", "weekday-name-row")
                    .selectAll(".weekday-name-cell")
                    .data(dayNames)
                    .join("td")
                    .attr("class", "weekday-name-cell")
                    .attr("style", "text-align: center;")
                    .text((d) => d);

                  monthTable
                    .selectAll(monthBodyId)
                    .data([null])
                    .join("tbody")
                    .attr("id", monthBodyId)
                    .selectAll(".month-body-rows")
                    .data(monthDays)
                    .join("tr")
                    .attr("class", "month-body-rows")
                    .selectAll(".month-body-cells")
                    .data(
                      (d) => d,
                      (d) => d
                    )
                    .join("td")
                    .attr("id", (d) =>
                      d.day === earlierDay
                        ? "earlier-day"
                        : d.day === laterDay
                        ? "later-day"
                        : null
                    )
                    .attr("class", "month-body-cells")
                    .attr("width", () => dayTdSquareSizePx)
                    .attr("height", () => dayTdSquareSizePx)
                    .attr("style", (d) =>
                      d > 0
                        ? "font-size:x-small; background-color: lightgrey; border: 2px solid white; border-radius: 5px; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                        : "border: none;"
                    )
                    .text((d) => {
                      if (d <= 0) return "";
                      if (
                        d === 1 ||
                        d === lastDayOfMonth ||
                        firstDaysOfWeek.includes(d)
                      )
                        return d;
                    });
                  //
                  // .on("click", (d) => {
                  //   if (
                  //     q.interaction === InteractionType.titration ||
                  //     q.interaction === InteractionType.none
                  //   ) {
                  //     if (d.target.__data__ === earlierDate) {
                  //       dispatch(
                  //         answer({
                  //           choice: ChoiceType.earlier,
                  //           choiceTimestamp: DateTime.now(),
                  //         })
                  //       );
                  //     } else if (d.target.__data__ === laterDate) {
                  //       dispatch(
                  //         answer({
                  //           choice: ChoiceType.later,
                  //           choiceTimestamp: DateTime.now(),
                  //         })
                  //       );
                  //     }
                  //   }
                  // });
                };

                const yearTd = select(this);
                createMonthTable(yearTd);
              });

            // const earlierDay = q.dateEarlier.getDate();
            // const laterDay = q.dateLater.getDate();

            // const yRange = [0, q.maxAmount];
            // var y = null;
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
                  choiceTimestamp: DateTime.now(),
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
