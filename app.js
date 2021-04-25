// Declare Variables
let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countiesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countiesData;
let educationData;

let values = [];

let width = 850;
let height = 600;
let padding = 65;

let canvas = d3.select("#canvas");
// canvas.attr("width", width);
// canvas.attr("height", height);

let tooltip = d3.select("#tooltip");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(countiesData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "#52b2bf";
      } else if (percentage <= 30) {
        return "#3944bc";
      } else if (percentage <= 45) {
        return "#2832c2";
      } else {
        return "#051094";
      }
    })
    .attr("data-fips", (countyDataItem) => countyDataItem["id"])
    .attr("data-education", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countyDataItem) => {
      tooltip.transition().style("visibility", "visible");

      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        `${county["fips"]} - ${county["area_name"]}, ${county["state"]} : ${county["bachelorsOrHigher"]}%`
      );
      tooltip.attr('data-education', county["bachelorsOrHigher"])
    })
    .on("mouseout", countyDataItem => {
      tooltip.transition().style("visibility", "hidden")
    })
};

d3.json(countiesURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countiesData = topojson.feature(data, data.objects.counties).features;
    console.log(countiesData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});
