import React from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentQuestion,
  selectMaxAmount,
  selectMaxTime,
} from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { axisBottom, axisLeft, scaleLinear, scaleBand, max, range } from "d3";

function BarChart(props) {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);
  const maxTime = useSelector(selectMaxTime);
  const maxAmount = useSelector(selectMaxAmount);

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
      ref={useD3(
        (svg) => {
          const x = scaleBand()
            .domain(domain)
            .rangeRound([margin.left, width - margin.right])
            .padding(0.1);

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

          svg
            .select(".y-axis")
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "steelblue")
            .call(
              axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
            )
            .call((g) => g.select(".domain").remove());

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
