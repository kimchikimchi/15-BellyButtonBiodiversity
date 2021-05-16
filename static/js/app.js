// Global variables
const dataFile = 'data/samples.json';
var metadata, names, samples;

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

        // Use the first dataset as default to initialize the plot with
        const id = metadata[0].id;
        console.log(`id: ${id}`);   

        const plotData = getPlotDataByID(id, 10);
        console.log("Plotdata is: ");
        console.log(plotData);


        // Add chart type info
        // Add .reserve function to list starting with the largest
        const trace = {
            x: plotData.sample_values.reverse(),
            y: plotData.otu_ids.map(id => "OTU "+id).reverse(),
            text: plotData.otu_labels.reverse(),
            orientation: 'h',
            type: 'bar'
        };
        const data = [trace];
        const layout = {
            title: 'Here is title',
        };
        
        Plotly.newPlot('bar', data, layout);
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
        plotData.sample_values = plotData.sample_values.splice(0, firstX);
        plotData.otu_ids =  plotData.otu_ids.splice(0, firstX);
        plotData.otu_labels =  plotData.otu_labels.splice(0, firstX);
    }

    return plotData;
};

const updatePlot = function(trace) {


};


init();