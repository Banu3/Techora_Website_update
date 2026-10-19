import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# At y=215 (below HTDESABAO), check color across x=50 to 170
patch = img[215:225, 50:170]
for x in range(50, 170, 20):
    b, g, r = img[215:225, x:x+10].mean(axis=(0,1))
    print(f"x={x:3d}: B={b:.1f}, G={g:.1f}, R={r:.1f}")
