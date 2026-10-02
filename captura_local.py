from pathlib import Path
from datetime import datetime
import cv2
import time

CAMERA_URL = "http://91.108.45.201/onvif/snapshot/1/11"

OUTPUT_DIR = Path("frames")
OUTPUT_DIR.mkdir(exist_ok=True)

while True:
    cap = cv2.VideoCapture(CAMERA_URL)

    ret, frame = cap.read()

    if ret:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = OUTPUT_DIR / f"frame_{timestamp}.jpg"

        cv2.imwrite(str(filename), frame)
        print(f"Frame guardado: {filename}")

    cap.release()
    time.sleep(5)