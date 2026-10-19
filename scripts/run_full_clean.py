import cv2
import numpy as np
from PIL import Image

# Load original full image
orig_im = Image.open('public/images/careers-young-team.webp').convert('RGB')
img = np.array(orig_im)[:, :, ::-1].copy() # BGR
H, W = img.shape[:2]

# In global coordinates:
# The partition of interest is x in [1246, 1376], y in [20, 240]
# Seam is at x = 1246
# Frosted edge line equation:
# At x=1246: y=103
# At x=1376: y=92
# y_edge(x) = 103 - ((103 - 92) / (1376 - 1246)) * (x - 1246) = 103 - (11/130) * (x - 1246)

def get_edge_y(x):
    return int(round(103.0 - (11.0 / 130.0) * (x - 1246)))

# 1. Clean the clear glass above the frosted edge (y < get_edge_y(x))
# The logo is between x = 1272 and x = 1326, y between 35 and get_edge_y(x)
# Left anchor column: x = 1270
# Right anchor column: x = 1328
x_l = 1270
x_r = 1328

for x in range(x_l, x_r + 1):
    alpha = (x - x_l) / (x_r - x_l)
    edge_y = get_edge_y(x)
    # Clear glass region from y=30 to edge_y - 2
    for y in range(30, edge_y - 1):
        # Sample left and right anchors
        img[y, x] = (1 - alpha) * img[y, x_l] + alpha * img[y, x_r]
    
    # Frosted bevel edge transition (2 pixels)
    for dy in (-1, 0, 1):
        y = edge_y + dy
        edge_l = get_edge_y(x_l) + dy
        edge_r = get_edge_y(x_r) + dy
        img[y, x] = (1 - alpha) * img[edge_l, x_l] + alpha * img[edge_r, x_r]

# 2. Text and logo remnants on the frosted glass:
# All frosted glass is below get_edge_y(x) + 1 down to y=235
# In this region:
# - Logo lower stem: y in [get_edge_y(x)+1, 118], x in [1275, 1322]
# - TECHNOVATE: y in [118, 160], x in [1246, 1374]
# - SOLUTIONS: y in [162, 198], x in [1252, 1346]
# - HTDESABAO, INOIA: y in [200, 226], x in [1256, 1338]

# Let's create a precise mask of the text on the frosted glass:
mask = np.zeros((H, W), dtype=np.uint8)

# Logo stem on frosted glass:
for x in range(1275, 1322):
    ey = get_edge_y(x)
    roi = img[ey+1:118, x]
    # mask blue/dark pixels
    b, g, r = roi[:, 0], roi[:, 1], roi[:, 2]
    gray = cv2.cvtColor(roi.reshape(-1, 1, 3), cv2.COLOR_BGR2GRAY).flatten()
    m = ((b.astype(int) - r.astype(int) > 5) | (gray < 145)).astype(np.uint8) * 255
    mask[ey+1:118, x] = m

# TECHNOVATE:
roi1 = img[116:162, 1244:1375]
g1 = cv2.cvtColor(roi1, cv2.COLOR_BGR2GRAY)
mask[116:162, 1244:1375] = (g1 < 146).astype(np.uint8) * 255

# SOLUTIONS:
roi2 = img[162:198, 1250:1350]
g2 = cv2.cvtColor(roi2, cv2.COLOR_BGR2GRAY)
mask[162:198, 1250:1350] = (g2 < 146).astype(np.uint8) * 255

# HTDESABAO, INOIA:
roi3 = img[198:226, 1254:1340]
g3 = cv2.cvtColor(roi3, cv2.COLOR_BGR2GRAY)
mask[198:226, 1254:1340] = (g3 < 143).astype(np.uint8) * 255

# Dilate mask by 3px to encompass all anti-aliased letter outlines
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)

# Inpaint with Telea radius 4
img_clean = cv2.inpaint(img, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

# Save result preview of top right
preview = img_clean[20:250, 1150:1376]
cv2.imwrite('scripts/final_preview.png', preview)
print("Saved final_preview.png")
