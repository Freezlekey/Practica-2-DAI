import cv2
from ultralytics import YOLO
from pathlib import Path

yolo_net = YOLO("yolov8n.pt")

frames = Path("frames")
output = Path("detection_mas_10")
output.mkdir(exist_ok=True)

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

    result = detections[0].plot()

    cv2.imwrite(
        str(output / image_path.name),
        result
    )

    print(image_path.name, "->", person_count, "personas")