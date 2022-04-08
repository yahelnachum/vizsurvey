import React from "react";

import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const q = useSelector(selectCurrentQuestion);

  const heightIn = q.heightIn;
  const widthIn = q.widthIn;

  const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;

  // const totalHeight = height + parseInt(margin.top) + parseInt(margin.bottom);
  // const totalWidth = width + parseInt(margin.left) + parseInt(margin.right);

  const tableSizeSquareScaledIn = Math.min(
    heightIn * pixelRatioScale,
    widthIn * pixelRatioScale
  );

  const monthDays = calendarMatrix(q.dateEarlier);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = q.dateEarlier.getMonth();
  const monthName = monthNames[month];

  const style = {
    // display: "table",
    // borderCollapse: "separate",
    // boxSizing: "border-box",
    // textIndent: "initial",
    // borderSpacing: "2px",
    // borderColor: "gray",
    height: tableSizeSquareScaledIn + "in",
    width: tableSizeSquareScaledIn + "in",
    borderCollapse: "collapse",
    //    tableLayout: "fixed",
    // marginLeft: margin.left + "px",
    // marginRight: margin.right + "px",
  };

  //   const dateMonth = question.dateEarlier.getMonth();
  //   const dateYear = question.dateEarlier.getFullYear();

  return (
    <div>
      <h2>{monthName}</h2>
      <table
        id="calendar"
        style={style}
        ref={useD3((table) => {
          table.html(
            `<thead>
                <tr>
                    <td style='text-align: center;'>Sunday</td>
                    <td style='text-align: center;'>Monday</td>
                    <td style='text-align: center;'>Tuesday</td>
                    <td style='text-align: center;'>Wednesday</td>
                    <td style='text-align: center;'>Thursday</td>
                    <td style='text-align: center;'>Friday</td>
                    <td style='text-align: center;'>Saturday</td>
                </tr>
            </thead>
            <tbody id='calendarBody'></tbody>`
          );

          const calendar = d3.select("#calendar");

          const tbody = calendar.select("#calendarBody");

          const rows = tbody.selectAll("tbody").data(monthDays).join("tr");

          const earlierDay = q.dateEarlier.getDate();
          const laterDay = q.dateLater.getDate();

          rows
            .selectAll("td")
            .data((d) => d)
            .join("td")
            .attr("id", (d) =>
              d === earlierDay
                ? "earlierAmount"
                : d === laterDay
                ? "laterAmount"
                : ""
            )
            .attr("class", function (d) {
              return d > 0 ? "day" : "dayEmpty";
            })
            .attr("width", (d, i, nodes) =>
              Math.min(nodes[i].offsetWidth, nodes[i].offsetHeight)
            )
            .attr("height", (d, i, nodes) =>
              Math.min(nodes[i].offsetWidth, nodes[i].offsetHeight)
            )
            .join("div")
            .attr("style", "text-align: right")
            .text((d) => (d > 0 ? d : ""));
          //.text((d) => (d > 0 ? d : ""));
          // .html((d) => {
          //   if (d !== earlierDay && d != laterDay && d > 0) {
          //     return d;
          //   }
          // });
          //   //parentElement.clientWidth;
          //   console.log(i);
          //   console.log(d);
          //   console.log(nodes[i].__data__);
          //   console.log(nodes[i].clientWidth);
          //   var result = `<div>${d}</div>`;
          //   if (d === earlierDay || d === laterDay) {
          //     result =
          //       result +
          //       `<svg>
          //         <text id="${
          //           d === earlierDay ? "earlierAmount" : "laterAmount"
          //         }">$</text>
          //       </svg>`;
          //   }

          // if (d === earlierDay || d === laterDay) {
          //   return `<div>${d}</div>
          //   <svg id='${
          //     d === earlierDay ? "earlierAmount" : "laterAmount"
          //   } width=''></svg>`;
          // } else if (d > 0) {
          //   return d;
          // } else {
          //   return "";
          // }
          //});

          // .text(function (d) {
          //   return d > 0 ? d : "";
          // });
          // .html((d) => {
          //   if (d === earlierDay || d === laterDay) {
          //     return `<div>${d}</div><svg id='${
          //       d === earlierDay ? "earlierAmount" : "laterAmount"
          //     }'></svg>`;
          //   } else if (d > 0) {
          //     return d;
          //   } else {
          //     return "";
          //   }
          // });

          rows.select("#earlierAmount").data([q.amountEarlier]).join("svg");

          //   .text(function (d) {
          //     return d > 0 ? d : "";
          //   });

          // const cellId = "#day-" + question.dateEarlier.getDay();
          // const earlierDayCell = rows.select(cellId);
          // const earlierDayHTML = `<td id="${cellId}`

          // earlierDayCell.html(earlierDayCell.node() + '<svg id=""></svg>')
          // rows.select(cellId).data([question.amountEarlier]).join("svg");
        }, q)}
      ></table>
    </div>
  );
}

export default Calendar;
