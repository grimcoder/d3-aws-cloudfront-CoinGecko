import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CryptoLineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        // Dimensions
        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.price) * 0.95, d3.max(data, d => d.price) * 1.05])
            .range([height, 0]);

        // Axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
            .attr('color', '#a0a0a0')
            .selectAll('text')
            .style('fill', '#a0a0a0');

        svg.append('g')
            .call(d3.axisLeft(y).tickFormat(d => `$${d / 1000}k`))
            .attr('color', '#a0a0a0')
            .selectAll('text')
            .style('fill', '#a0a0a0');

        // Grid lines (optional, but nice)
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
            .attr('color', 'rgba(255, 255, 255, 0.05)');

        // Line
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.price))
            .curve(d3.curveMonotoneX);

        // Gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(d3.min(data, d => d.price)))
            .attr("x2", 0)
            .attr("y2", y(d3.max(data, d => d.price)));

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#00d4ff");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#005bea");

        // Path
        const path = svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Initial Animation
        const totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeCubicOut)
            .attr("stroke-dashoffset", 0);

        // Hover effects (Tooltip)
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("font-size", "12px");

        // Overlay for gathering events
        const overlay = svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all');

        const focus = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focus.append('circle')
            .attr('r', 5)
            .attr('fill', '#fff');

        overlay
            .on('mouseover', () => focus.style('display', null))
            .on('mouseout', () => {
                focus.style('display', 'none');
                tooltip.style('opacity', 0);
            })
            .on('mousemove', function (event) {
                const x0 = x.invert(d3.pointer(event)[0]);
                const bisect = d3.bisector(d => d.date).left;
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.attr('transform', `translate(${x(d.date)},${y(d.price)})`);

                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`pDate: ${d3.timeFormat('%Y-%m-%d')(d.date)}<br/>Price: $${d.price.toFixed(2)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            });

        return () => {
            tooltip.remove();
        }

    }, [data]);

    return <svg ref={svgRef} className="chart-svg"></svg>;
};

export default CryptoLineChart;
