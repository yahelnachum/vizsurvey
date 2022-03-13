import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentQuestion,
  fetchStatus,
  Answer,
  answer,
  Status,
} from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { axisBottom, axisLeft, scaleLinear, range } from "d3";

function BarChart(props) {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const barWidth = 15;

  const height = question.vertical_pixels;
  const width = question.horizontal_pixels;
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

  const xTickValues = Array.from(Array(question.max_time + 1).keys());
  const data = xTickValues.map((d) => {
    if (d == question.time_earlier) {
      return { time: d, amount: question.amount_earlier };
    } else if (d == question.time_later) {
      return { time: d, amount: question.amount_later };
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
            .domain([0, question.max_time])
            .range([0, width]);

          const yRange = [0, question.max_amount];
          const y = scaleLinear().domain(yRange).range([height, 0]);

          chart
            .selectAll(".x-axis")
            .data([null])
            .join("g")
            .attr("transform", `translate(0,${height})`)
            .attr("class", "x-axis")
            .call(
              axisBottom(x)
                .tickValues(xTickValues)
                .tickFormat(d3.format(",.0f"))
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
              if (d.target.__data__.amount === question.amount_earlier) {
                dispatch(answer(Answer.Earlier));
              } else {
                dispatch(answer(Answer.Later));
              }
            })
            .attr("height", (d) => y(0) - y(d.amount));
        },
        [data]
      )}
      style={style}
    ></svg>
  );

  if (status === Status.Complete) {
    return <Redirect to="/thankyou" />;
  } else {
    return result;
  }
}

export default BarChart;
