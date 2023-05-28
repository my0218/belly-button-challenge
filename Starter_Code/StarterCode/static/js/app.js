const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
  console.log(data);

  let samples = data.samples;
  let dropdown = d3.select("#selDataset");
  let sampleIds = samples.map(sample => sample.id);
  let barchart = d3.select("#bar");
  let bubblechart = d3.select ("#col-md-12")
  let demographicinfo = d3.select ("#sample-metadata")

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

  function barChart(selectedIndex) {
    let selectedSample = samples.find(sample => sample.id === sampleIds[selectedIndex]);
    let { otuIds, sampleValues, otuLabels } = top10otuvalue(selectedSample);
    let trace1 = {
      x: sampleValues,
      y: otuIds,
      type: 'bar',
      orientation: 'h'
    };
    let data1 = [trace1];
    let layout1 = {
      title: 'Top 10 OTUs',
      margin: { t: 50, r: 5, b: 20, l: 100 }, 
      height: 300 
    };
    Plotly.newPlot('bar', data1, layout1);
  }

  barChart(0);

  function bubbleChart(selectedIndex) {
    let selectedSample = samples.find(sample => sample.id === sampleIds[selectedIndex]);

    let trace2 = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Earth'
      }
    };

    let data2 = [trace2];

    let layout2 = {
      margin: { t: 20, r: 5, b: 30, l: 100 },
      height: 400,
      xaxis: {
        title: 'OTU IDs'
      },
      yaxis: {
        title: 'Sample Values'
      }
    };

    Plotly.newPlot('bubble', data2, layout2);
  }

  bubbleChart(0);

  function SampleMetadata(selectedIndex) {
    let selectedMetadata = data.metadata[selectedIndex];
    demographicinfo.html("");
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        demographicinfo.append("p").text(`${key}: ${value}`);
    });
  }

  SampleMetadata(0);

  function optionChanged(selectedIndex) {
    barChart(selectedIndex);
    bubbleChart(selectedIndex);
    SampleMetadata(selectedIndex);
  }

  dropdown.on("change", function() {
    let selectedIndex = +this.value;
    optionChanged(selectedIndex);
  });
});
