$(document).ready(function() {
    var width = 610,
        height = 420;

    var fill1 = d3.scale.category20();
    var fill2 = d3.scale.ordinal()
            .range(['#ea5928', '#c32b10', '#9f3815', '#4f1f12', '#18110f']);

    var tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('padding', '5px 5px')
            .style('background', 'white')
            .style('opacity', 0);

    d3.csv('/data/positive_words.csv')
        .row(function(d) {
            return { key: d.word, value: +d.count };
        })
        .get(function(error, rows) {
            words = rows.map(function(d) {
                return {text: d.key, size: d.value};
            });

            var scale = d3.scale.linear()
                    .domain([d3.min(rows, function(d) { return d.value; }),
                             d3.max(rows, function(d) { return d.value; })])
                    .range([10, 80]);

            d3.layout.cloud().size([width, height])
                .words(words)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return scale(d.size); })
                .on("end", draw)
                .start();

            function draw(words) {
                d3.select("#wc1").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill1(i); })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; })
                    .on('mouseover', function(d, i) {
                        d3.select(this).style('opacity', 0.7);
                        tooltip.transition().style('opacity', 0.8);
                        tooltip.html(i+1)
                            .style('left', (d3.event.pageX) + 'px')
                            .style('top', (d3.event.pageY) + 'px');
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).style('opacity', 1.0);
                        tooltip.transition().style('opacity', 0);
                    })
                ;
            }
        });

        d3.csv('/data/negative_words.csv')
        .row(function(d) {
            return { key: d.word, value: +d.count };
        })
        .get(function(error, rows) {
            words = rows.map(function(d) {
                return {text: d.key, size: d.value};
            });

            var scale = d3.scale.linear()
                    .domain([d3.min(rows, function(d) { return d.value; }),
                             d3.max(rows, function(d) { return d.value; })])
                    .range([10, 80]);

            d3.layout.cloud().size([width, height])
                .words(words)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return scale(d.size); })
                .on("end", draw)
                .start();

            function draw(words) {
                d3.select("#wc2").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill2(i); })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; })
                    .on('mouseover', function(d, i) {
                        d3.select(this).style('opacity', 0.7);
                        tooltip.transition().style('opacity', 0.8);
                        tooltip.html(i+1)
                            .style('left', (d3.event.pageX) + 'px')
                            .style('top', (d3.event.pageY) + 'px');
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).style('opacity', 1.0);
                        tooltip.transition().style('opacity', 0);
                    })
                ;
            }
        });
});
