// JSON-Daten laden
$.getJSON("data.json", function(data) { //data.json wird von 
    // Daten parsen
    var chartData = {
      labels: data.labels,
      datasets: [{
        label: data.label,
        backgroundColor: "rgba(65, 105, 225, 0.4)",
        borderColor: "rgba(65, 105, 225, 1)",
        data: data.data
      }]
    };
  
    // Chart-Objekt erstellen
    var chartObject = document.getElementById("myChart");
    var chart = new Chart(chartObject, {
      type: "line",
      data: chartData
    });
  });