import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { scaleBand } from "d3";

function BarChart(props) {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);

  const height = props.height;
  const width = props.width;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };

  const domain = Array.from(Array(question.time_later + 1).keys());

  const data = domain.map((d) => {
    if (d == question.time_earlier) {
      return { time: d, amount: question.amount_earlier };
    } else if (d == question.time_later) {
      return { time: d, amount: question.amount_later };
    } else {
      return { time: d, amount: 0 };
    }
  });

  const ref = useD3(
    (svg) => {
      const height = 500;
      const width = 500;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.time))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.amount)])
        .rangeRound([height - margin.bottom, margin.top]);
      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickValues(
              d3
                .ticks(...d3.extent(x.domain()), width / 40)
                .filter((v) => x(v) !== undefined)
            )
            .tickSizeOuter(0)
        );
      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .style("color", "steelblue")
          .call(d3.axisLeft(y).ticks(null, "$"))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .append("text")
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(data.y1)
          );
      svg.select(".x-axis").call(xAxis);
      svg.select(".y-axis").call(yAxis);
      svg
        .select(".plot-area")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.time))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d.amount))
        .attr("height", (d) => y(0) - y(d.amount));
    },
    [data.length]
  );

  return (
    <svg
      ref={ref}
      // ref={useD3(
      //   (svg) => {
      //     const x = scaleBand()
      //       .domain(data.map((d) => d.time))
      //       .rangeRound([margin.left, width - margin.right])
      //       .padding(0.1);

      //     const y = d3
      //       .scaleLinear()
      //       .domain([0, d3.max(data, (d) => d.amount)])
      //       .rangeRound([height - margin.bottom, margin.top]);

      //     svg
      //       .select(".x-axis")
      //       .data([null])
      //       .join("g")
      //       .attr("transform", `translate(0,${height - margin.bottom})`)
      //       .attr("class", "x-axis")
      //       .style("color", "steelblue")
      //       .call(d3.axisBottom(x));

      //     svg
      //       .select(".y-axis")
      //       .data([null])
      //       .join("g")
      //       .attr("transform", `translate(${margin.left},0)`)
      //       .attr("class", "y-axis")
      //       .style("color", "steelblue")
      //       .call(d3.axisLeft(y));

      //     svg.select(".plot-area").data([null]).join("g");

      //     svg
      //       .selectAll(".bar")
      //       .data(data)
      //       .join("rect")
      //       .attr("class", "bar")
      //       .attr("fill", "steelblue")
      //       .attr("x", (d) => x(d.time))
      //       .attr("width", x.bandwidth())
      //       .attr("y", (d) => y(d.amount))
      //       .attr("height", (d) => y(0) - y(d.amount));
      //   },
      //   [data.length]
      // )}
      // style={{
      //   height: "600",
      //   width: "600",
      //   marginRight: "0px",
      //   marginLeft: "10px",
      //   marginBottom: "10px",
      // }}
      style={{
        height: "500",
        width: "100%",
        marginRight: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

export default BarChart;
