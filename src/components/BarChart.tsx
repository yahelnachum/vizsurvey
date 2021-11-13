import React from "react";

import { useAppDispatch, useAppSelector} from "./../hooks/hooks";

import {
  selectCurrentQuestion,
  selectMaxAmount,
  selectMaxTime,
} from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { axisBottom, axisLeft, scaleLinear, scaleBand, max, range } from "d3";

function BarChart(props: { height: any; width: any; top_margin: any; right_margin: any; bottom_margin: any; left_margin: any; }) {
  const dispatch = useAppDispatch();
  const question = useAppSelector(selectCurrentQuestion);
  const maxTime = useAppSelector(selectMaxTime);
  const maxAmount = useAppSelector(selectMaxAmount);

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
        (svg: { select: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; call: { (arg0: d3.Axis<string> & string[]): void; new(): any; }; style: { (arg0: string, arg1: string): { (): any; new(): any; call: { (arg0: d3.Axis<d3.NumberValue>): { (): any; new(): any; call: { (arg0: (g: any) => any): void; new(): any; }; }; new(): any; }; }; new(): any; }; attr: { (arg0: string, arg1: string): { (): any; new(): any; selectAll: { (arg0: string): { (): any; new(): any; data: { (arg0: { time: number; amount: any; }[]): { (): any; new(): any; join: { (arg0: string): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => number | undefined): { (): any; new(): any; attr: { (arg0: string, arg1: number): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => number): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => number): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => {
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
