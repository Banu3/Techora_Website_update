import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# seam is at x=46.
# Let's check columns in the adjacent panel (x=10..40) and below text (y=210..225)
# In frosted film, light comes from the office, creating a smooth vertical gradient.
# Let's print mean color at different y levels in the clean area (x=15..40)
for y in range(75, 225, 15):
    patch = img[y:y+10, 15:40]
    b, g, r = patch.mean(axis=(0,1))
    std = patch.std(axis=(0,1)).mean()
    print(f"y={y:3d}: B={b:.1f}, G={g:.1f}, R={r:.1f}, std={std:.2f}")
