
var myMap;


// function init() {
//     console.log("Entering INIT Function")
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");
//     // Use the list of sample names to populate the select options
//     selector
//         .append("option")
//         .text("Select a school")
//         .property("")
//     d3.json("/coldata").then((sampleNames)=>{
//         sampleNames.forEach((sample)=>{
//             selector
//                 .append("option")
//                 .text(sample.Name)
//                 .property("value",sample.Name);
//         });
//     });
// };

// function init() {
//   console.log("Entering INIT Function")
//   // Grab a reference to the dropdown select element
//   var selector = d3.select("#selDataset");
//   // Use the list of sample names to populate the select options
//   selector
//       .append("option")
//       .text("Select a school")
//       .property("")
//   d3.json("/coldata").then((sampleNames)=>{
//       sampleNames.forEach((sample)=>{
//         if(sample["Total Students"]>15000){
//           selector
//           .append("option")
//           .text(sample.Name)
//           .property("value",sample.Name);
//         }
//       });
//   });
// };

function init() {
  console.log("Entering INIT Function")
  // Read the data set from MongoDB to create the drop down menu
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  var allSchools = [];
  d3.json("/coldata").then((sampleNames)=>
    sampleNames.forEach((sample)=>
    allSchools.push(sample["Name"])));

    console.log(allSchools);
    var allSchoolsSorted = allSchools.reverse();
    console.log(allSchoolsSorted);

    allSchools.sort(function(a, b){return a - b});
    console.log(allSchools);
  
  // Use the list of sample names to populate the select options
  selector
      .append("option")
      .text("Select a school")
      .property("")
  d3.json("/coldata").then((sampleNames)=>{
      sampleNames.forEach((sample)=>{
        if(sample["Total Students"]>35000){
          selector
          .append("option")
          .text(sample.Name)
          .property("value",sample.Name);
        }
      });
  });
};

function updateJumbotron(univName){
    console.log("Entering updateJumbotron");
    var PANEL = d3.select("#jumbotron-data");
    PANEL.html("");
    PANEL.append("h2").text(`${univName}`);
};

function updateAddressMap(nameSchool, latitudeSchool, longitudeSchool){
  console.log("Entering updateAddressMap-x");
    if( $('#address-map').is(':empty') ) {
      console.log("Create Map for 1st time");
      myMap = L.map("address-map", {
          center: [latitudeSchool, longitudeSchool],
          zoom:11
      });
      console.log(myMap);
      // Adding a tile layer (the background map image) to our map
      // We use the addTo method to add objects to our map
      L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
      }).addTo(myMap);
      L.marker([latitudeSchool, longitudeSchool]).addTo(myMap)
      .bindPopup(nameSchool)
      .openPopup();
  }
  else{
    // myMap.panTo([latitudeSchool, longitudeSchool]);
    console.log("Updating map and flying to new location")
    L.marker([latitudeSchool, longitudeSchool]).addTo(myMap)
    .bindPopup(nameSchool)
    .openPopup();
    myMap.flyTo([latitudeSchool, longitudeSchool],10);
  };
};

function updateBasicInfo(name, schoolUrl, state, size, city, admissionRate,loanPercent){
    console.log("Entering UpdateBasicInfo");
    var PANEL = d3.select("#basic-info-text");
    PANEL.html("");
    // PANEL.append("h3").append("u").text(`${name}`);
    PANEL.append("h3").text(`${schoolUrl}`);
    PANEL.append("hr");
    // PANEL.append("h3").text(`${city} , ${state}`);
    PANEL.append("hr");
    console.log(size);
    if (!size){
        PANEL.append("h3").text(`Enrollment: Unknown`).style("color", "#DDE3E4");
    }
    else{
        PANEL.append("h3").text(`Enrollment: ${Math.round(size/1000,0)}K`);
    }
    if (!admissionRate){
        PANEL.append("h3").text(`Admission Rate: Unknown`).style("color","#DDE3E4");
    }
    else{
        PANEL.append("h3").text(`Admission Rate: ${Math.round(admissionRate*100,2)}%`);
    }
    if (!loanPercent){
      PANEL.append("h3").text(`% Students with loan: Unknown`).style("color","#DDE3E4");
  }
  else{
      PANEL.append("h3").text(`% Students with loan: ${Math.round(loanPercent*100,2)}%`);
  }
  PANEL.append("hr");
};

function updateScoresTable(satScore, actScore){
  var PANEL = d3.select("#scores-plot");
  PANEL.html("");
    yValues1 = [satScore];
    yValues2 = [actScore];
    var trace1 = {
        x: ["SAT"],
        y: [satScore],
        name: 'yaxis1 data',
        hoverinfo: 'none',
        type: 'bar',
        marker: { color: '#E48CF3'},
        text: yValues1.map(String),
        textposition: 'auto'
    };
    var trace3 = {
      x: ["SAT"],
      y: [1600-satScore],
      name: 'yaxis1 data',
      hoverinfo: 'none',
      type: 'bar',
      marker: { color: '#F7F2F8'},
      // text: yValues1.map(String),
      // textposition: 'auto'
    };

    var trace2 = {
        x: ["ACT"],
        y: [actScore],
        name: 'yaxis2 data',
        hoverinfo: 'none',
        yaxis: 'y2',
        type: 'bar',
        marker: { color: '#8BD894'},
        text: yValues2.map(String),
        textposition: 'auto'

    };
    var trace4 = {
      x: ["ACT"],
      y: [36-actScore],
      name: 'yaxis2 data',
      hoverinfo: 'none',
      yaxis: 'y2',
      type: 'bar',
      marker: { color: '#EAF3EB'},
      // text: yValues2.map(String),
      // textposition: 'auto'

  };
    var data = [trace1, trace3, trace2, trace4];
    var layout = {
        barmode: 'stack',
        // autosize: true,
        height: 300,
        // openPopup: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        yaxis: {
            range: [0, 1600],
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false

        },
        yaxis2: {
            range: [0, 36],
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        font: {size: 30,
          color: "#C0392B",
          font: "Comic Sans MS"
        },
        margin: {
          t: 55, //top margin
          l: 5, //left margin
          r: 5, //right margin
          b: 35 //bottom margin
        }

    };

    Plotly.newPlot('scores-plot', data, layout);

};
    
function updateDemoGraph(black,asian,white,hispanic,islander,unknown){
  var PANEL = d3.select("#demographics-pie");
  PANEL.html("");
    var data = [{
        values: [black,asian,white,hispanic,islander,unknown],
        labels: ["Black","Asian","White","Hispanic","Islander","Unknown"],
        type: 'pie',
        hoverinfo: 'label+percent',
        // hoverinfo: 'label+percent+name',
        textposition: 'inside',
        hole: 0.5
    }];
      
    var layout = {
    height: 400,
        margin: {
          t: 55, //top margin
          l: 5, //left margin
          r: 5, //right margin
          b: 35 //bottom margin
        },
    legend: {
        "orientation": "h",
        font: {size:12}},
    annotations: [
        {
          font: {
            size: 18
          },
          showarrow: false,
          text: 'Demographics',
          x: 0.5,
          y: 0.5
        }],
    };
      
    Plotly.newPlot('demographics-pie', data, layout);
};

function updateCosts(feesInstate, feesOutstate){
  var PANEL = d3.select("#costs-school");
  PANEL.html("");
    var yValues3 =[Math.round(feesInstate/1000)+"k", Math.round(feesOutstate/1000)+"k"];
    var trace1 = {
        x: ['In-State', 'Out-State'],
        y: [feesInstate, feesOutstate],
        hoverinfo: 'none',
        type: 'bar',
        text: yValues3,
        textposition: 'auto',
        // marker: {'color': 'cyan'}
        marker: {'color': "#FF8C31"}
      };

      var data = [trace1];
      
      var layout = {
        height: 300,
        font: {size: 25
        },
        margin: {
          t: 55, //top margin
          l: 5, //left margin
          r: 5, //right margin
          b: 35 //bottom margin
        },
        yaxis: {
            // showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false

        },
      };
      
      Plotly.newPlot('costs-school', data, layout);

};

function updateSalaryInfo(totCost, pctEarnings, avgEarnings){
    console.log("updateSalaryInfo");
    var PANEL = d3.select("#salary-info-text");
    PANEL.html("");
    if (totCost){
      PANEL.append("h3").text(`Cost`).style("color","#D820C7");
      PANEL.append("h2").text(`$${Math.round(totCost/1000,0)}K`).append("hr").style("color", "#D82068");
    }
    if (pctEarnings){
      PANEL.append("h3").text(`%Grads earning > $25K`).style("color", "#D820C7");
      PANEL.append("h2").text(`${Math.round(pctEarnings*100)}%`).append("hr").style("color", "#D82068");
    }
    if(avgEarnings){
      PANEL.append("h3").text(`Average Earnings after 9 years`).style("color","#D820C7");
      PANEL.append("h2").text(`$${Math.round(avgEarnings/1000,0)}K`).append("hr").style("color", "#D82068");
    }
};


function updateGenderGuage(women,men) {
  var PANEL = d3.select("#gender-guage");
  PANEL.html("");
    // Enter the washing frequency between 0 and 180
    var level = parseFloat(women) * 180;
  
    // Trig to calc meter point
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 15, color: "black" },
        showlegend: false,
        name: "Freq",
        text: level,
        hoverinfo: 'skip'
      },
      {
        values: [women*50, 50-women*50, 50],
        rotation: 90,
        text: ["Women", "Men", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(219, 10, 91, 1)",
            "rgba(31, 58, 147, 1)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels: [Math.round((women*100),3)+"%",Math.round((men*100),3), ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];
  
    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "black",
          line: {
            color: "black"
          }
        }
      ],
      autosize: true,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
  
    var GAUGE = document.getElementById("gender-guage");
    Plotly.newPlot(GAUGE, data, layout);
};


function optionChanged(newSample) {
    console.log("Entering optionChanged:-");
    console.log(newSample);

    d3.json("/coldata").then((data) => {
        // console.log(data);
        var selectedSchool = data.filter(function(element){ return element.Name == newSample });
        // console.log("Selectedd School:")
        // console.log(selectedSchool);
        // console.log(selectedSchool[0].Latitude);
        console.log(selectedSchool);
        d3.select("#temp").html("");
        updateJumbotron(selectedSchool[0].Name);
        updateAddressMap(selectedSchool[0].Name, selectedSchool[0].Latitude, selectedSchool[0].Longitude);
        updateBasicInfo(selectedSchool[0].Name, selectedSchool[0].Website, selectedSchool[0].State, selectedSchool[0]["Total Students"],
          selectedSchool[0].City, selectedSchool[0]["Admission Rate"], selectedSchool[0]["Pct Students with Loan"]);
        updateScoresTable(selectedSchool[0]["Avg SAT"], selectedSchool[0]["Mid ACT"])
        updateCosts(selectedSchool[0]["In State Tuition"],selectedSchool[0]["Out-of-State Tuition"])
        updateSalaryInfo(selectedSchool[0]["Cost Attendance"],selectedSchool[0]["Pct Earning > $25K"],selectedSchool[0]["Avg Earnings (9yrs)"]);
        updateDemoGraph(selectedSchool[0]["Black"],selectedSchool[0]["Asian"],selectedSchool[0]["White"],selectedSchool[0]["Hispanic"],selectedSchool[0]["Islander"],selectedSchool[0]["Unknown"]);
        updateGenderGuage(selectedSchool[0]["Women"],selectedSchool[0]["Men"]);
    });
    
};

// Initialize the dashboard for index.html
init();