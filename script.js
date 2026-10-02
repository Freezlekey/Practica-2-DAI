var chart;

function loadChart() {

    fetch("database_10.csv")
        .then(response => response.text())
        .then(data => {

            var lines = data.trim().split("\n");

            var labels = [];
            var values = [];

            for (var i = 1; i < lines.length; i++) {

                var parts = lines[i].split(",");

                labels.push(parts[0] + " " + parts[1]);
                values.push(parseInt(parts[2]));
            }

            chart = new Chart(
                document.getElementById("personCountChart"),
                {
                    type: "line",

                    data: {
                        labels: labels,

                        datasets: [{
                            label: "Personas",
                            data: values,
                            borderWidth: 2,
                            fill: false
                        }]
                    },

                    options: {
                        responsive: true,

                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1
                                }
                            }]
                        }
                    }
                }
            );
        });
}


function updateImage() {

    fetch("latest_image")
        .then(response => response.text())
        .then(filename => {

            document.getElementById("reloadImage").src =
                "detection_mas_10/" + filename + "?" + new Date().getTime();
        });
}


// График загружается только один раз
loadChart();

// Картинка обновляется каждые 5 секунд
updateImage();

setInterval(updateImage, 5000);