import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axisBottom, axisLeft, scaleLinear, range, format } from "d3";
import { DateTime } from "luxon";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";

function BarChart(props) {
  const dispatch = useDispatch();
  const QandA = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const barWidth = 15;

  const height = QandA.question.verticalPixels;
  const width = QandA.question.horizontalPixels;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };

  const totalHeight = height + parseInt(margin.top) + parseInt(margin.bottom);
  const totalWidth = width + parseInt(margin.left) + parseInt(margin.right);

  const style = {
    height: totalHeight,
    width: totalWidth,
    marginLeft: margin.left + "px",
    marginRight: margin.right + "px",
  };

  // const innerHeight = height - margin.bottom - margin.top;
  // const innerWidth = width - margin.left - margin.right;

  const xTickValues = Array.from(Array(QandA.question.maxTime + 1).keys());
  const data = xTickValues.map((d) => {
    if (d === QandA.question.timeEarlier) {
      return { time: d, amount: QandA.question.amountEarlier };
    } else if (d === QandA.question.timeLater) {
      return { time: d, amount: QandA.question.amountLater };
    } else {
      return { time: d, amount: 0 };
    }
  });

  const result = (
    <svg
      ref={useD3(
        (svg) => {
          var chart = svg
            .selectAll(".plot-area")
            .data([null])
            .join("g")
            .attr("class", "plot-area")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          const x = scaleLinear()
            .domain([0, QandA.question.maxTime])
            .range([0, width]);

          const yRange = [0, QandA.question.maxAmount];
          const y = scaleLinear().domain(yRange).range([height, 0]);

          chart
            .selectAll(".x-axis")
            .data([null])
            .join("g")
            .attr("transform", `translate(0,${height})`)
            .attr("class", "x-axis")
            .call(
              axisBottom(x).tickValues(xTickValues).tickFormat(format(",.0f"))
            );

          const yTickValues = range(yRange[0], yRange[1], yRange[1] / 5);
          yTickValues.push(yRange[1]);

          chart
            .selectAll(".y-axis")
            .data([null])
            .join("g")
            .attr("class", "y-axis")
            //.attr("transform", `translate(${margin.left},${margin.bottom})`)
            .call(
              //axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
              axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.0f"))
            );

          // const yLabelG = svg
          //   .select("#y-axis-label")
          //   .data([1])
          //   .join("g")
          //   .attr("transform", "rotate(-90)");

          // .data(nullData)
          // .join("text")
          // .attr("id", "y-axis-label")
          // .attr("text-anchor", "middle")
          // .attr("x", -innerHeight / 2)
          // .attr("y", -margin.left)

          // .text("Amount in USD");

          chart
            // .selectAll(".plot-area")
            // .attr("fill", "steelblue")
            // .attr("class", "plot-area")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("fill", "steelblue")
            .attr("class", "bar")
            .attr("x", (d) => x(d.time) - barWidth / 2)
            //.attr("width", x.bandwidth())
            .attr("width", barWidth)
            .attr("y", (d) => y(d.amount))
            .on("click", (d) => {
              if (d.target.__data__.amount === QandA.question.amountEarlier) {
                dispatch(
                  answer({
                    choice: ChoiceType.earlier,
                    choiceTimestamp: DateTime.now,
                  })
                );
              } else {
                dispatch(
                  answer({
                    choice: ChoiceType.later,
                    choiceTimestamp: DateTime.now,
                  })
                );
              }
            })
            .attr("height", (d) => y(0) - y(d.amount));
        },
        [data]
      )}
      style={style}
    ></svg>
  );

  if (status === StatusType.Complete) {
    return <Redirect to="/thankyou" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now));
    return result;
  }
}

export default BarChart;
