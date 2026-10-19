import cv2
import numpy as np

orig = cv2.imread('public/images/careers-young-team.webp.orig')

print("Column 1270 around edge (y=95..105):")
for y in range(95, 106):
    print(f"y={y}: {orig[y, 1270]}")

print("\nColumn 1328 around edge (y=90..100):")
for y in range(90, 101):
    print(f"y={y}: {orig[y, 1328]}")
