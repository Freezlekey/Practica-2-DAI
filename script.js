var chart;

var images = [
    "frame_20260928_203935.jpg",
    "frame_20260928_203942.jpg",
    "frame_20260928_203950.jpg",
    "frame_20260928_203956.jpg",
    "frame_20260928_204003.jpg",
    "frame_20260928_204010.jpg",
    "frame_20260928_204016.jpg",
    "frame_20260928_204024.jpg",
    "frame_20260928_204031.jpg",
    "frame_20260928_204038.jpg",
    "frame_20260928_204045.jpg",
    "frame_20260928_204054.jpg",
    "frame_20260928_204102.jpg",
    "frame_20260928_204108.jpg",
    "frame_20260928_204116.jpg",
    "frame_20260928_204124.jpg",
    "frame_20260928_204130.jpg",
    "frame_20260928_204136.jpg",
    "frame_20260928_204145.jpg",
    "frame_20260928_204152.jpg",
    "frame_20260928_204158.jpg",
    "frame_20260928_204205.jpg",
    "frame_20260928_204211.jpg",
    "frame_20260928_204218.jpg",
    "frame_20260928_204226.jpg",
    "frame_20260928_204233.jpg",
    "frame_20260928_204239.jpg",
    "frame_20260928_204246.jpg",
    "frame_20260928_204254.jpg"
];

var currentImage = 0;


// ==========================
// Загрузка графика
// ==========================

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


            // Обычные точки
            var pointColors = [];

            for (var i = 0; i < values.length; i++) {
                pointColors.push("rgba(54, 162, 235, 1)");
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
                            fill: false,

                            pointBackgroundColor: pointColors,
                            pointBorderColor: pointColors,

                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

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

            // После загрузки графика показываем первую фотографию
            updateImage();
        });
}


// ==========================
// Получить дату и время
// из имени фотографии
// ==========================

function getImageTime(filename) {

    // frame_20260928_203935.jpg

    var name = filename
        .replace("frame_", "")
        .replace(".jpg", "");

    var date = name.substring(0, 8);
    var time = name.substring(9, 15);

    var formattedDate =
        date.substring(0, 4) + "-" +
        date.substring(4, 6) + "-" +
        date.substring(6, 8);

    var formattedTime =
        time.substring(0, 2) + ":" +
        time.substring(2, 4) + ":" +
        time.substring(4, 6);

    return formattedDate + " " + formattedTime;
}


// ==========================
// Обновление фотографии
// ==========================

function updateImage() {

    if (!chart) {
        return;
    }


    var filename = images[currentImage];

    var imageTime = getImageTime(filename);


    // Показываем фотографию

    document.getElementById("reloadImage").src =
        "detection_mas_10/" + filename;


    // Ищем соответствующую точку на графике

    var pointIndex = chart.data.labels.indexOf(imageTime);


    if (pointIndex !== -1) {

        var colors = [];
        var radiuses = [];

        for (var i = 0; i < chart.data.labels.length; i++) {

            if (i === pointIndex) {

                // Текущая точка
                colors.push("red");
                radiuses.push(8);

            } else {

                // Обычная точка
                colors.push("rgba(54, 162, 235, 1)");
                radiuses.push(4);
            }
        }


        chart.data.datasets[0].pointBackgroundColor = colors;
        chart.data.datasets[0].pointBorderColor = colors;
        chart.data.datasets[0].pointRadius = radiuses;

        chart.update();
    }


    // Показываем информацию о текущем кадре

    var currentFrame =
        document.getElementById("currentFrame");

    if (currentFrame) {

        currentFrame.textContent =
            "Frame " +
            (currentImage + 1) +
            " / " +
            images.length +
            " — " +
            imageTime;
    }


    // Следующая фотография

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }
}


// ==========================
// Запуск
// ==========================

loadChart();

setInterval(updateImage, 5000);