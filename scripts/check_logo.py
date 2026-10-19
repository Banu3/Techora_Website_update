import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
# local y 0 to 80, local x 40 to 170
cv2.imwrite('scripts/top_logo_area.png', img[0:85, 40:176])
print("Saved top_logo_area.png")
