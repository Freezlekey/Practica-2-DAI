import cv2
from ultralytics import YOLO
from pathlib import Path
import csv
from datetime import datetime

yolo_net = YOLO("yolov8n.pt")

frames = Path("frames")

with open("database.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow(["fecha", "hora", "personas"])

    for image_path in frames.glob("*.jpg"):

        frame = cv2.imread(str(image_path))

        detections = yolo_net.predict(
            source=frame,
            conf=0.1,
            classes=0
        )

        person_count = 0

        for detection in detections[0]:
            class_id = detection.boxes.cls.item()
            confidence = detection.boxes.conf.item()

            if class_id == 0 and confidence >= 0.1:
                person_count += 1

        timestamp = datetime.fromtimestamp(
            image_path.stat().st_mtime
        )

        fecha = timestamp.strftime("%Y-%m-%d")
        hora = timestamp.strftime("%H:%M:%S")

        writer.writerow([
            fecha,
            hora,
            person_count
        ])

        print(fecha, hora, "->", person_count, "personas")