const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
  console.log(data);

  let samples = data.samples;
  let dropdown = d3.select("#selDataset");
  let sampleIds = samples.map(sample => sample.id);
  let chart = d3.select("#bar");

  dropdown
    .selectAll("option")
    .data(sampleIds)
    .enter()
    .append("option")
    .attr("value", (d, i) => i)
    .text((d, i) => `${d}`);

  function top10otuvalue(sample) {
        let otuData = sample.otu_ids.map((id, index) => ({
          id: `OTU ${id}`,
          value: sample.sample_values[index],
          label: sample.otu_labels[index]
        }));
        otuData.sort((a, b) => b.value - a.value);
        return {
          otuIds: otuData.map(data => data.id).slice(0, 10).reverse(),
          sampleValues: otuData.map(data => data.value).slice(0, 10).reverse(),
          otuLabels: otuData.map(data => data.label).slice(0, 10).reverse()
        };
      }

  function displayChart(selectedIndex) {
    let selectedSample = samples.find(sample => sample.id === sampleIds[selectedIndex]);
    let { otuIds, sampleValues, otuLabels } = top10otuvalue(selectedSample);
    let trace = {
      x: sampleValues,
      y: otuIds,
      type: 'bar',
      orientation: 'h',
    };
    let data = [trace];
    let layout = {
      margin: { t: 5, r: 5, b: 20, l: 100 }, 
      height: 300 
    };
    Plotly.newPlot('bar', data, layout);
  }

  displayChart(0);

  function optionChanged(selectedIndex) {
    displayChart(selectedIndex);
  }
  
  dropdown.on("change", function() {
    let selectedIndex = +this.value;
    optionChanged(selectedIndex);
  });
});
