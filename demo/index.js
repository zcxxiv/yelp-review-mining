
$(document).ready(function () {
    $.getJSON("top_restaurants.json", function (top_restaurants) {
        // console.log(restaurant["processed_reviews"][0]);

        restaurant_ids = [];
        for (var restaurant_id in top_restaurants) {
            if (top_restaurants.hasOwnProperty(restaurant_id)) {
                restaurant_ids.push(restaurant_id);
            }
        }

        restaurant = top_restaurants[restaurant_ids[Math.floor(Math.random()*restaurant_ids.length)]];
        // restaurant = top_restaurants[restaurant_ids[0]];
        restaurant_info_html = "<h2 id="restaurant_name">" + restaurant["business_name"] + "</h2>";
        $(".left_container").append(restaurant_info_html);

        categories = ["food", "service", "price", "other"];

        review_html = "";

        reviews = restaurant["processed_reviews"];

        var selected = [38, 42, 10, 15, 29, 31, 55, 49, 96];

        for (var i = 0; i < selected.length; i++) {
            selected_id = selected[i];
            count = [0, 0, 0];
            score = [0, 0, 0];
            review_html += "<div class="review">";
            for (var j = 0; j < reviews[selected_id].length; j++) {
                sentence = reviews[selected_id][j];
                if (sentence) {
                    review_html += "<span class=" + categories[sentence[2]] + ">"
                                + sentence[0] + "&nbsp;"
                                + "</span>";
                    score[sentence[2]] += +sentence[1];
                    count[sentence[2]] += 1;
                }
            }
            score_html = "<div class="review_score">";

            for (var k = 0; k < score.length; k++) {
                if (count[k] > 0) {
                    rating = (score[k] * 1.0 / count[k]).toPrecision(3);
                    score_html += "<span class=" + categories[k] + ">"
                               + categories[k].toUpperCase() + ": " + rating + "&emsp;&nbsp;"
                               + "</span>";
                }
            }
            score_html += "</div>";
            review_html += score_html;

            review_html += "</div>";
        }

        $(".left_container").append(review_html);

        var food_html = "";
        for (var i = 0; i < 5; i++) {
            food_html += "<p>" + restaurant["food"]["sentences"][i] + "</p>";
        }
        $(".food_highlights").append(food_html);

        var service_html = "";
        for (var i = 0; i < 5; i++) {
            service_html += "<p>" + restaurant["service"]["sentences"][i] + "</p>";
        }
        $(".service_highlights").append(service_html);

        var price_html = "";
        for (var i = 0; i < 5; i++) {
            price_html += "<p>" + restaurant["price"]["sentences"][i] + "</p>";
        }
        $(".price_highlights").append(price_html);

        category_distribution = [];
        category_distribution.push({"id": 3, "n_sentences": restaurant["other"]["sentences"].length});
        category_distribution.push({"id": 2, "n_sentences": restaurant["price"]["sentences"].length});
        category_distribution.push({"id": 1, "n_sentences": restaurant["service"]["sentences"].length});
        category_distribution.push({"id": 0, "n_sentences": restaurant["food"]["sentences"].length});

        var width = 320,
        height = 320,
        radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
        .range(["#dfbb5f", "#d04f41", "#6085d7", "#55b46a"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 70)
            .innerRadius(radius - 70);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.n_sentences; });

        var svg = d3.select(".pie_chart").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var g = svg.selectAll(".arc")
            .data(pie(category_distribution))
          .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.id); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("fill", "white")
            .attr("dy", ".4em")
            .attr("dx", "-1em")
            .text(function(d) { return categories[d.data.id]; });


        var rating_data = [];
        rating_data.push({"id": 0, "name": "Food \u00a0 \u00A0" + restaurant["food"]["stars"].toPrecision(3), "rating": restaurant["food"]["stars"]});
        rating_data.push({"id": 1, "name": "Service \u00a0 \u00A0" + restaurant["service"]["stars"].toPrecision(3), "rating": restaurant["service"]["stars"]});
        rating_data.push({"id": 2, "name": "Price \u00a0 \u00A0" + restaurant["price"]["stars"].toPrecision(3), "rating": restaurant["price"]["stars"]});
        rating_data.push({"id": 3, "name": "Overall \u00a0 \u00A0" + restaurant["avg_stars"].toPrecision(3), "rating": restaurant["avg_stars"]});

        var x = d3.scale.linear()
            .domain([0, 5])
            .range([0, 320]);

        d3.select(".bar_chart")
          .selectAll("div")
            .data(rating_data)
          .enter().append("div")
            .style("width", function(d) { return x(d.rating) + "px"; })
            .style("background-color", function (d) { return color(d.id); })
            .text(function(d) { return d.name; });
    });

});
