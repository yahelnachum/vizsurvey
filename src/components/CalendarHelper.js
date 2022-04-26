import * as d3 from "d3";
import { select, format, scaleLinear, drag } from "d3";
import { DateTime } from "luxon";
import { answer } from "../features/questionSlice";
import { ViewType } from "../features/ViewType";
import { AmountType } from "../features/AmountType";
import { ChoiceType } from "../features/ChoiceType";
import { InteractionType } from "../features/InteractionType";

var calendarMatrix = require("calendar-matrix");

export const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

export const drawCalendar = (
  table,
  q,
  monthDate,
  tableWidthIn,
  showYear,
  dragCallback,
  dispatchCallback
) => {
  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;
  const tableSquareSizeIn = tableWidthIn / 7;
  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

  const monthDays = calendarMatrix(monthDate.toJSDate());

  const monthDaysAmounts = monthDays.map((week) =>
    week.map((day) => {
      const date =
        day <= 0 ? null : DateTime.local(monthDate.year, monthDate.month, day);
      return {
        day: day,
        amount:
          date === null
            ? null
            : date.equals(q.dateEarlier)
            ? q.amountEarlier
            : date.equals(q.dateLater)
            ? q.amountLater
            : null,
        type:
          date === null
            ? AmountType.none
            : date.equals(q.dateEarlier)
            ? AmountType.earlierAmount
            : date.equals(q.dateLater)
            ? AmountType.laterAmount
            : null,
        date: date,
      };
    })
  );

  const lastDayOfMonth = Math.max(...[].concat(...monthDays));
  const firstDaysOfWeek = monthDaysAmounts.reduce((acc, cv) => {
    return acc.concat(cv[0].day);
  }, []);

  const thead = table
    .selectAll("#month-head")
    .data([null])
    .join("thead")
    .attr("id", "month-head");

  thead
    .selectAll("#month-head-year-row")
    .data([null])
    .join("tr")
    .attr("id", "month-head-year-row")
    .style("text-align", "center")
    .selectAll("#month-year-cell")
    .data([monthDate])
    .join("td")
    .attr("id", "month-year-cell")
    .attr("style", "font-size: large")
    .attr("colspan", 7)
    .text((d) => `${d.monthLong}${showYear ? " " + d.year : ""}`);
  thead
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

  const tbody = table
    .selectAll("#calendar-body")
    .data([null])
    .join("tbody")
    .attr("id", "calendar-body");

  const yRange = [0, q.maxAmount];
  const y = scaleLinear().domain(yRange).range([tableSquareSizePx, 0]);

  const drawBar = (parent, idPrefix, dayAndAmount) => {
    const svg = parent
      .append("svg")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-svg`)
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", tableSquareSizePx)
      .attr("height", tableSquareSizePx)
      .attr("style", "text-align: center");
    svg
      .append("rect")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-rect`)
      .attr("class", "bar")
      .attr("fill", "black")
      .attr("x", "0")
      .attr("y", (d) => y(d.amount))
      .attr("width", tableSquareSizePx)
      .attr("height", (d) => {
        const y0 = y(0);
        const yamt = y(d.amount);
        return y0 - yamt;
      });
    svg
      .append("text")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-text`)
      .attr("x", tableSquareSizePx / 2)
      .attr("y", (d) => y(d.amount))
      .attr("style", "font-size:large;")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .text((d) => format("$,.0f")(d.amount));
  };

  const updateBar = (parent, idPrefix) => {
    console.log("in updateBar");
    parent
      .select(`#${idPrefix}-text`)
      .attr("y", (d) => y(d.amount))
      .text((d) => format("$,.0f")(d.amount));
    parent
      .select(`#${idPrefix}-rect`)
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => {
        console.log(`d.amount=${d.amount}`);
        const y0 = y(0);
        const yamt = y(d.amount);
        return y0 - yamt;
      });
  };

  const drawWord = (parent, idPrefix, dayAndAmount) => {
    parent
      .append("div")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-div`)
      .attr("class", "amount-div")
      .attr(
        "style",
        "font-size:1vw; position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); font-weight: bold;"
      )
      .text(format("$,.0f")(dayAndAmount.amount));
  };

  const updateWord = (parent, idPrefix) => {
    const selection = parent.select(`#${idPrefix}-div`);
    selection.text((d) => format("$,.0f")(d.amount));
  };

  tbody
    .selectAll(".day-rows")
    .data(monthDaysAmounts, (d) => d.day)
    .join("tr")
    .attr("class", "day-rows")
    .selectAll(".day-cells")
    .data(
      (d) => d,
      (d) => d.day
    )
    .join(
      (enter) => {
        enter
          .append("td")
          .attr("class", "day-cells")
          .attr("id", (d) =>
            d.type === AmountType.earlierAmount
              ? "earlier-day"
              : d.type === AmountType.laterAmount
              ? "later-day"
              : null
          )
          .attr("width", tableSquareSizePx)
          .attr("height", tableSquareSizePx)
          .attr("style", (d) =>
            d.day > 0
              ? //? "border: 1px solid black; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                `font-size: 1vw; background-color: lightgrey; border: 2px solid white; border-radius: 5px; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;`
              : `border: none;`
          )
          .on("click", (d) => {
            if (
              q.interaction === InteractionType.titration ||
              q.interaction === InteractionType.none
            ) {
              if (d.target.__data__.type === AmountType.earlierAmount) {
                dispatchCallback(
                  answer({
                    choice: ChoiceType.earlier,
                    choiceTimestamp: DateTime.local(),
                  })
                );
              } else if (d.target.__data__.type === AmountType.laterAmount) {
                dispatchCallback(
                  answer({
                    choice: ChoiceType.later,
                    choiceTimestamp: DateTime.local(),
                  })
                );
              }
            }
          })
          .each(function (d) {
            const td = select(this);
            if (d.day >= 0) {
              td.append("div")
                .attr("style", "float: right")
                .attr("class", "day-div")
                .text((d) => {
                  if (d.day <= 0) return "";
                  if (
                    d.day === 1 ||
                    d.day === lastDayOfMonth ||
                    firstDaysOfWeek.includes(d.day)
                  )
                    return d.day;
                });
            }
            if (
              d.type === AmountType.earlierAmount ||
              d.type === AmountType.laterAmount
            ) {
              if (q.viewType === ViewType.calendarWord) {
                drawWord(
                  td,
                  d.type === AmountType.earlierAmount ? "earlier" : "later",
                  d
                );
              } else if (q.viewType === ViewType.calendarBar) {
                drawBar(
                  td,
                  d.type === AmountType.earlierAmount ? "earlier" : "later",
                  d
                );
              }
            }
          });
      },
      (update) => {
        console.log("In update");
        if (q.viewType === ViewType.calendarBar) {
          updateBar(update, "earlier");
          updateBar(update, "later");
        } else if (q.viewType === ViewType.calendarWord) {
          updateWord(update, "earlier");
          updateWord(update, "later");
        }
      },
      (exit) => exit.remove()
    );
  if (q.interaction === InteractionType.drag) {
    var dragHandler = drag().on("drag", function (d) {
      if (d.subject.type === q.variableAmount) {
        const newAmount = y.invert(d.y);
        if (newAmount > q.maxAmount) return;
        d.subject.amount = newAmount;
        select(this)
          .attr("y", d.y)
          .attr("height", y(0) - d.y);
        dragCallback(d.subject);
        d3.select(
          `#${d.type === AmountType.earlierAmount ? "earlier" : "later"}-text`
        )
          .attr("y", (d) => y(d.amount))
          .text(() => format("$,.0f")(d.subject.amount));
      }
    });
    dragHandler(table.selectAll(".bar"));
  }
};
