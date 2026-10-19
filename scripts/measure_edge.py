import cv2
import numpy as np
from PIL import Image

im = Image.open('public/images/careers-young-team.webp').convert('RGB')
img = np.array(im)[:, :, ::-1].copy() # BGR

# Crop around the glass wall region:
# x from 1100 to 1376, y from 0 to 300
sub = img[0:300, 1100:1376].copy()

# Look at the top edge of the frosted band.
# At x=1150 (clean area to the left), where does the frosted band start?
# In column 50 (x=1150):
col = sub[:, 50]
# Print out brightness values along this column to find the exact top edge of the frosted band:
gray_col = cv2.cvtColor(sub, cv2.COLOR_BGR2GRAY)[:, 50]
print("Gradient along clean column x=1150:")
for y in range(40, 90, 5):
    print(f"y={y}: gray={gray_col[y]}")

cv2.imwrite('scripts/glass_sub.png', sub)
