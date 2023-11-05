document.addEventListener("DOMContentLoaded", function(event) { 
  Dropzone.autoDiscover = false;

  var myDropzone = new Dropzone('#kt_dropzonejs_example_1', {
    url: "#", // Set the url for your upload script location
    paramName: "file", // The name that will be used to transfer the file
    autoQueue: false,
    maxFiles: 1,
    maxFilesize: 2, // MB
    addRemoveLinks: true,
    accept: function(file, done) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function(event) { 
        document.getElementById('image_file').setAttribute('src', event.target.result);
        startImageScan();

    });
    reader.readAsDataURL(file);
    }
  });
  myDropzone.on("addedfile", file => {
     myDropzone.removeFile(file);
  });

  var data = [{
    values: [65,15,10,10],
    labels: ['class 1','class 2','class 3','class 4'],
    hole: .4,
    textinfo:'none',
    type: 'pie'
  }];

  var layout = {
      title: 'Resultat'+'<br> confidence : confidance rate %',
      colorway : ['#0d0d0d', '#404040', '#666666', '#808080', '#a6a6a6', '#bfbfbf', '#e6e6e6'],
      showlegend: true,
      legend: {"orientation": "h"}
  };
  var config = {responsive: true}


  Plotly.newPlot('data_plot', data, layout,config);
});



function startImageScan() {
  document.getElementById("error_message").style.display = "none";

  // Create a variable to initialize the ml5.js image classifier with MobileNet
  const classifier = ml5.imageClassifier('MobileNet');

  // Scan the uploaded image
  classifier.classify(document.getElementById("image_file"), imageScanResult);
}

// Check for errors and display the results if there aren't any
function imageScanResult(error, results) {
  if (error) {
      document.getElementById('error_message').innerHTML=error;
      document.getElementById("error_message").style.display = "block";
      document.getElementById("data_plot").style.display = "none";


  } else {
      document.getElementById("data_plot").style.display = "block";
      const labels = [];
      const confidences = [];
      var best_label= results[0].label;
      var best_confidence= results[0].confidence * 100;
      var sum_confidence=results[0].confidence+results[1].confidence+results[2].confidence;
      var unknown_confidence=(1-sum_confidence)*100;
      labels[0]=results[0].label ;
      labels[1]=results[1].label ;
      labels[2]=results[2].label ;
      labels[3]='Unknown' ;
      confidences[0]=results[0].confidence * 100 ;
      confidences[1]=results[1].confidence * 100 ;
      confidences[2]=results[2].confidence * 100 ;
      confidences[3]=unknown_confidence ;
      console.log(best_label);
      console.log(best_confidence);
      plotData(labels,confidences,best_label,best_confidence.toFixed(2))

  }
}

function plotData(labels,confidences,best_label,best_confidence){
  var data = [{
  values: confidences,
  labels: labels,
  hole: .4,
  textinfo:'none',
  type: 'pie'
  }];

  var layout = {
      title: best_label+'<br> confidence :'+best_confidence+" %",
      colorway : ['#0d0d0d', '#404040', '#666666', '#808080', '#a6a6a6', '#bfbfbf', '#e6e6e6'],
  showlegend: true,
legend: {"orientation": "h"}
  };
  var config = {responsive: true}


  Plotly.newPlot('data_plot', data, layout,config);

}