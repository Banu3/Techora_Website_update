import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# seam is at x=46, frosted top edge is at y=72
# Let's check text region: y from 75 to 225, x from 45 to 170
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

print("Frosted background stats (x=50..70, y=100..150):")
bg = gray[100:150, 50:70]
print(f"Mean: {bg.mean():.1f}, min: {bg.min()}, max: {bg.max()}")

print("TECHNOVATE letters (x=45..165, y=90..130):")
txt1 = gray[90:130, 45:165]
print(f"Min: {txt1.min()}, max: {txt1.max()}, percent < 140: {(txt1 < 140).mean():.2f}")
print("Percent < 155:", (txt1 < 155).mean())

# Let's inspect rows around 'TECHNOVATE'
for y in range(92, 130, 4):
    row = gray[y, 45:165]
    print(f"y={y}: min={row.min()}, median={np.median(row):.1f}, max={row.max()}")
