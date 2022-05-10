class Visualizer {
    constructor(id, genome) {
        this.id = id;
        this.genome = genome;
    }


    draw(width = 400, height = 400, container = "svgContainer") {
        let element = document.getElementById(this.id);
        if (!!element) {
            element.parentNode.removeChild(element);
        }

        let svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", this.id);

        let connections = Object.values(this.genome.connections).map(connection => {
            return {
                source: connection.input,
                target: connection.output,
                weight: connection.weight,
                enabled: connection.enabled
            };
        });

        let num_inputs = this.genome.input_neurons.length;
        let num_outputs = this.genome.output_neurons.length;
        let nodes = this.genome.input_neurons.map(key => {
            return {
                id: key,
                type: 'input'
            };
        });

        Object.values(this.genome.neurons).forEach(neuron => {
            if (this.genome.output_neurons.includes(neuron.key)) {
                nodes.push({
                    id: neuron.key,
                    type: 'output'
                });
            } else {
                nodes.push({
                    id: neuron.key,
                    type: 'hidden'
                });
            }
        });

        let chart = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().id(d => d.id))
            .force('charge', d3.forceManyBody())
            .on('tick', function () {
                nodes.forEach(node => {
                    if (node.type === 'input') {
                        node.x = ((width / num_inputs) * -node.id) - (width / num_inputs) / 2;
                        node.y = height - (height * 0.2);
                    }

                    if (node.type === 'output') {
                        node.x = ((width / num_outputs) * node.id) - (width / num_outputs) / 2;
                        node.y = height * 0.2;
                    }
                })

                svg.selectAll('line')
                    .data(connections)
                    .join('line')
                    .style("stroke-width", d => (d.enabled ? (d.weight > 0 ? 0.3 + d.weight : 0.3 + d.weight * -1) : 0) * 0.1)
                    .style("stroke", d => d.weight > 0 ? "#0d0" : "#f00")
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                svg.selectAll('circle')
                    .data(nodes)
                    .join('circle')
                    .attr('r', 15)
                    .attr("fill", d => d.type === 'input' ? "#33f" : d.type === 'output' ? "#f33" : "#555")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);

                svg.selectAll('text')
                    .data(nodes)
                    .join('text')
                    .text(d => d.id)
                    .style('font-weight', 'bold')
                    .attr('x', d => d.x - 3)
                    .attr('y', d => d.y)
                    .attr('dy', 5);
            });

        chart.force("link").links(connections);

        element = document.getElementById(this.id);
        document.getElementById(container).append(element);
    }
}