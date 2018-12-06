function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var meta = d3.json('/metadata/' + sample);

  // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  panel.html('');
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  var tbl = panel.append('table').append('tbody');
  meta.then((kv) => {
    Object.keys(kv).forEach(function (key) {
      var val = kv[key];
      console.log(key + '-' + val);
      var tRow = tbl.append('tr')
      tRow.html(`<td>${key}</td>
  <td>:</td>
  <td>${val}</td>`)
    })
  });
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  console.log(sample);
  var data = [];

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sd = d3.json('/samples/' + sample);

  // @TODO: Build a Bubble Chart using the sample data
  // Use the list of sample names to populate the select options
  sd.then((sampleNames) => {

    var otu_ids = sampleNames['otu_ids'];
    var otu_labels = sampleNames['otu_labels'];
    var sample_values = sampleNames['sample_values'];

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      type: "bubble",
      name: otu_labels,
      marker: {
        color:  otu_ids,
        symbol: "circle",
        size: sample_values
      }
    };


    // Create the data array for the plot
    var data = [trace1];
    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values);
    console.log(otu_ids.length);

    // Create the data array for the plot


    // Define the plot layout
    var layout = {
      title: "Bio Diversity",
      xaxis: {
        title: "OTU IDs"
      },
      yaxis: {
        title: "Sample Values"
      }
    };

    console.log("data is :" + data);
    // Plot the chart to a div tag with id "bubble"
    Plotly.newPlot("bubble", data, layout);

  });


  // @TODO: Build a Pie Chart
  var pieData = [];
  d3.json('/samples/' + sample).then((sampleNames) => {
  
    var piedict= {
      values : sampleNames.sample_values.slice(0,10),
      labels : sampleNames.otu_ids.slice(0,10),
      hover : sampleNames.otu_labels.slice(0,10),

      // values : sampleNames['sample_values'].slice(0,10),
      // labels : sampleNames['otu_ids'].slice(0,10),
      // hover : sampleNames['otu_labels'].slice(0,10),
      type : "pie",
    };
  pieData.push(piedict);

var layout = {
    title : "Belly Button Pie Chart"
    };
    Plotly.newPlot("pie", pieData, layout);
  });

  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();