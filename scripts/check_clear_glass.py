import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# Light tube:
left_tube = img[38:46, 50:75]
right_tube = img[36:44, 130:160]

print("Left light tube color (B,G,R):", left_tube.mean(axis=(0,1)))
print("Right light tube color (B,G,R):", right_tube.mean(axis=(0,1)))
print("Ceiling above tube (left):", img[15:30, 50:75].mean(axis=(0,1)))
print("Ceiling above tube (right):", img[15:30, 130:160].mean(axis=(0,1)))
print("Glass below tube (left):", img[50:62, 50:75].mean(axis=(0,1)))
print("Glass below tube (right):", img[50:62, 130:160].mean(axis=(0,1)))
