// Global variables
const dataFile = 'data/samples.json';
const selDataset = d3.select('#selDataset');
const sampleLimit = 10;         // Show top X in the selected sample.
let metadata, names, samples;


// Run once when the page is loaded
const init = function() {
    // Using d3 library to read json file
    d3.json(dataFile)
    .then(json => {
        console.log("JSON data file loaded:");
        console.log(json);
        // Set to the global variables for easy access later
        metadata = json.metadata;
        names = json.names;
        samples = json.samples;

        // Populate the select pulldown list
        names.forEach(name => 
            selDataset.append('option').text(name).attr('value', name));


        // Use the first dataset as default to initialize the plot with
        const id = metadata[0].id;
        console.log(`id: ${id}`);   

        let plotData = getPlotDataByID(id, sampleLimit);
        console.log("Plotdata is: ");
        console.log(plotData);

        displayDemoInfo(plotData.metadata);

        // Prepare bar chart
        // Add .reserve function to list starting with the largest
        let data = [{
            x: plotData.sample_values.reverse(),
            y: plotData.otu_ids.map(id => "OTU "+id).reverse(),
            text: plotData.otu_labels.reverse(),
            orientation: 'h',
            type: 'bar'
        }];
        Plotly.newPlot('bar', data);

        // Prepare bubble chart
        plotData = getPlotDataByID(id);
        data = [{
            x: plotData.otu_ids,
            y: plotData.sample_values,
            text: plotData.otu_labels,
            marker: {
                color: plotData.otu_ids,
                size:  plotData.sample_values,
            },
            mode: 'markers'
        }];
        Plotly.newPlot('bubble', data);

        // Prepare gauge chart
        data = [{
            type: "indicator",
            mode: "gauge+number+delta",
            value: plotData.metadata.wfreq,
            title: { text: "Belly Button Washing Frequency", font: { size: 17 } },
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "firebrick" },
                steps: [
                    { range: [0, 2], color: d3.rgb(230,255,230) },
                    { range: [2, 3], color: d3.rgb(200,240,200) },
                    { range: [3, 4], color: d3.rgb(170,220,170) },
                    { range: [4, 5], color: d3.rgb(140,200,140) },
                    { range: [5, 6], color: d3.rgb(110,180,110) },
                    { range: [6, 7], color: d3.rgb(80,160,80) },
                    { range: [7, 8], color: d3.rgb(50,140,50) },
                    { range: [8, 9], color: d3.rgb(30,120,30) }
                ]
            }
        }];
        Plotly.newPlot('gauge', data);

    })
    .catch(err => {
        console.log(`Error occurred: ${err}`);
    });
};


// Returns plot data based on ID
const getPlotDataByID = function (id, firstX) { 

    // Locate the correct data set by matching ID
    // *ASSUME* there is only one dataset that matches per given ID
    let plotData = {
        metadata: metadata.filter(row => row.id == id)[0],
        name: names.filter(row => row == id)[0],
        sample_values: samples.filter(row => row.id == id)[0].sample_values,
        otu_ids: samples.filter(row => row.id == id )[0].otu_ids,
        otu_labels: samples.filter(row => row.id == id )[0].otu_labels
    };
    
    // Limit the top output by first X, if defined
    if (firstX) {
        plotData.sample_values = plotData.sample_values.slice(0, firstX);
        plotData.otu_ids =  plotData.otu_ids.slice(0, firstX);
        plotData.otu_labels =  plotData.otu_labels.slice(0, firstX);
    }

    return plotData;
};

// Event handler already added via 'onchange' property in HTML
const optionChanged = function(id) {
    // Get the ID number selected
    //const id = selDataset.node().value;
    console.log(`selected id ${id}`);

    // Get trace data based on the ID
    const plotData = getPlotDataByID(id, sampleLimit);
    console.log("Plotdata is: ");
    console.log(plotData);
    
    displayDemoInfo(plotData.metadata);

    // Update bar chart
    let trace = {
        x: plotData.sample_values.reverse(),
        y: plotData.otu_ids.map(id => "OTU "+id).reverse(),
        text: plotData.otu_labels.reverse()
    };
    Plotly.restyle('bar', 'x', [trace.x]);
    Plotly.restyle('bar', 'y', [trace.y]);
    Plotly.restyle('bar', 'text', [trace.text]);

    // Update bubble chart
    plotData = getPlotDataByID(id);
    trace = {
        x: plotData.otu_ids,
        y: plotData.sample_values,
        text: plotData.otu_labels,
        marker: {
            color: plotData.otu_ids,
            size:  plotData.sample_values,
        },
    }
    Plotly.restyle('bubble', 'x', [trace.x]);
    Plotly.restyle('bubble', 'y', [trace.y]);
    Plotly.restyle('bubble', 'text', [trace.text]);
    Plotly.restyle('bubble', 'markers', [{color: trace.marker.color, size: trace.marker.size}]);
};

const displayDemoInfo = function (data) {
    const demoTag = d3.select('#sample-metadata');
    // Emtpy div tag content first
    demoTag.html("");
    Object.keys(data).forEach(key => demoTag.append('p').text(`${key}: ${data[key]}`));
};


init();
