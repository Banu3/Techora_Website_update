import cv2
import numpy as np
from PIL import Image

# Read original full image
orig_path = 'public/images/careers-young-team.webp'
img_pil = Image.open(orig_path).convert('RGB')
img = np.array(img_pil) # RGB

# Let's inspect the exact crop [30:260, 1200:1376]
# Let's save a copy of original first as backup if not already done
import shutil, os
if not os.path.exists('public/images/careers-young-team.webp.orig'):
    shutil.copyfile(orig_path, 'public/images/careers-young-team.webp.orig')

detail = img[30:260, 1200:1376].copy()
h, w, c = detail.shape
print(f"Detail shape: h={h}, w={w}")

# Let's inspect the frosted film line and seam
# Vertical seam is near x=39 or 40.
# Let's find exactly where the seam is by column gradients
gray = cv2.cvtColor(detail, cv2.COLOR_RGB2GRAY)
seam_grad = np.abs(np.diff(gray[100:200, :].astype(float), axis=1)).mean(axis=0)
seam_x = np.argmax(seam_grad[30:50]) + 30
print(f"Vertical seam x: {seam_x} (global x={1200 + seam_x})")

# Horizontal frosted glass edge is near y=58..62
edge_grad = np.abs(np.diff(gray[:, seam_x+5:seam_x+35].astype(float), axis=0)).mean(axis=1)
edge_y = np.argmax(edge_grad[45:75]) + 45
print(f"Frosted glass top edge y: {edge_y} (global y={30 + edge_y})")
