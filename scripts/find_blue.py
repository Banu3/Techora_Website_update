import cv2
import numpy as np

res = cv2.imread('scripts/test_inpaint_clean.png')
# Find where B > R + 10 in y=50..90
b, g, r = res[:, :, 0], res[:, :, 1], res[:, :, 2]
diff = b.astype(int) - r.astype(int)
ys, xs = np.where(diff[50:90, 70:130] > 10)
for y, x in zip(ys, xs):
    print(f"Blue at y={y+50}, x={x+70}: B={b[y+50, x+70]}, G={g[y+50, x+70]}, R={r[y+50, x+70]}")
