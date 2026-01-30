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

        // Clip Path ensures the chart doesn't spill out of the axes
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.price) * 0.95, d3.max(data, d => d.price) * 1.05])
            .range([height, 0]);

        // Axes
        const xAxis = svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')));

        const yAxis = svg.append('g')
            .call(d3.axisLeft(y).tickFormat(d => `$${d / 1000}k`));

        // Style axes
        svg.selectAll('.tick text').style('fill', '#a0a0a0');
        svg.selectAll('.domain, .tick line').style('stroke', '#a0a0a0');

        // Line Generator
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

        // Line Path Group (clipped)
        const lineGroup = svg.append('g').attr("clip-path", "url(#clip)");

        const path = lineGroup.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Zoom Behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // Zoom limit: 1x to 10x
            .extent([[0, 0], [width, height]])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", updateChart);

        // Invisible Overlay for Zoom & Tooltips
        const overlay = svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .call(zoom);

        // Focus Circle (Tooltip cursor)
        const focus = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focus.append('circle')
            .attr('r', 5)
            .attr('fill', '#fff');

        // Tooltip Div
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

        let newX = x; // Keep track of current scale for tooltip

        function updateChart(event) {
            // Recover the new scale
            newX = event.transform.rescaleX(x);

            // Update axes with new scale
            xAxis.call(d3.axisBottom(newX).ticks(5).tickFormat(d3.timeFormat('%b %d')));

            // Re-apply styles to new axis elements
            xAxis.selectAll('text').style('fill', '#a0a0a0');
            xAxis.selectAll('.domain, .tick line').style('stroke', '#a0a0a0');

            // Update line position
            path.attr('d', d3.line()
                .x(d => newX(d.date))
                .y(d => y(d.price))
                .curve(d3.curveMonotoneX)
            );
        }

        // Mouse Events for Tooltip (Attached to overlay)
        overlay
            .on('mouseover', () => focus.style('display', null))
            .on('mouseout', () => {
                focus.style('display', 'none');
                tooltip.style('opacity', 0);
            })
            .on('mousemove', function (event) {
                // Use newX for inversion to handle zoomed state
                const x0 = newX.invert(d3.pointer(event)[0]);
                const bisect = d3.bisector(d => d.date).left;
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                // Handle edge cases where i might be out of bounds
                const d = (d0 && d1) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : (d0 || d1);

                if (d) {
                    focus.attr('transform', `translate(${newX(d.date)},${y(d.price)})`);

                    tooltip.transition().duration(50).style("opacity", .9);
                    tooltip.html(`Date: ${d3.timeFormat('%Y-%m-%d')(d.date)}<br/>Price: $${d.price.toFixed(2)}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            });

        return () => {
            tooltip.remove();
        }

    }, [data]);

    return <svg ref={svgRef} className="chart-svg"></svg>;
};

export default CryptoLineChart;
