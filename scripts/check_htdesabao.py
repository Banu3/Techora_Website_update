import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# Let's crop lines around HTDESABAO, INOIA: y from 160 to 220
cv2.imwrite('scripts/htdesabao_crop.png', img[160:220, 45:170])
print("Saved htdesabao_crop.png")
