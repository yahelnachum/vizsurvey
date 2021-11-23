import React from "react";

import { useSelector } from "react-redux";
import {
  selectCurrentQuestion,
  selectMaxTime,
} from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { axisBottom, axisLeft, scaleLinear, scaleBand, max, range } from "d3";

function BarChart(props) {
  const question = useSelector(selectCurrentQuestion);
  const maxTime = useSelector(selectMaxTime);

  const height = props.height;
  const width = props.width;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };
  const style = {
    height: height,
    width: width,
    marginLeft: margin.left + "px",
    marginRight: margin.right + "px",
  };

  // const innerHeight = height - margin.bottom - margin.top;
  // const innerWidth = width - margin.left - margin.right;

  const domain = Array.from(Array(maxTime + 1).keys());

  const data = domain.map((d) => {
    if (d == question.time_earlier) {
      return { time: d, amount: question.amount_earlier };
    } else if (d == question.time_later) {
      return { time: d, amount: question.amount_later };
    } else {
      return { time: d, amount: 0 };
    }
  });

  return (
    <svg
      width={width}
      height={height}
      ref={useD3(
        (svg) => {
          const x = scaleBand()
            .domain(domain)
            .rangeRound([margin.left, width - margin.right]);

          const rangeValues = [0, max(data, (d) => d.amount)];

          const y = scaleLinear()
            .domain(rangeValues)
            .rangeRound([height - margin.bottom, margin.top]);

          svg
            .select(".x-axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(axisBottom(x).tickValues(domain).tickSizeOuter(0));

          const yTickValues = range(
            rangeValues[0],
            rangeValues[1],
            rangeValues[1] / 5
          );
          yTickValues.push(rangeValues[1]);

          svg
            .select(".y-axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(
              axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
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

          svg
            .select(".plot-area")
            .attr("fill", "steelblue")
            .attr("class", "plot-area")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.time))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.amount))
            .attr("height", (d) => y(0) - y(d.amount));
        },
        [data]
      )}
      style={style}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

export default BarChart;
