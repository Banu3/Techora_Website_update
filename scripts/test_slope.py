import cv2
import numpy as np

# Load fresh original
orig = cv2.imread('public/images/careers-young-team.webp.orig')
H, W = orig.shape[:2]
res = orig.copy()

# The frosted edge line:
# Fits: x=1250 -> y=104, x=1350 -> y=82
def get_edge_y(x):
    return int(round(104.0 - 0.22 * (x - 1250.0)))

# 1. Clear glass & logo area:
# Logo is between x=1270 and x=1330
x_l = 1268
x_r = 1330

for x in range(x_l, x_r + 1):
    alpha = (x - x_l) / (x_r - x_l)
    edge_y = get_edge_y(x)
    edge_l = get_edge_y(x_l)
    edge_r = get_edge_y(x_r)
    
    # Ceiling & light tube: y from 30 down to edge_y - 2
    # In this region, interpolate horizontally
    for y in range(30, edge_y - 1):
        res[y, x] = (1 - alpha) * orig[y, x_l] + alpha * orig[y, x_r]
        
    # Frosted bevel edge transition: 3 pixels around edge_y
    for dy in (-1, 0, 1):
        y = edge_y + dy
        yl = edge_l + dy
        yr = edge_r + dy
        res[y, x] = (1 - alpha) * orig[yl, x_l] + alpha * orig[yr, x_r]

# 2. Text and logo remnants on the frosted glass:
mask = np.zeros((H, W), dtype=np.uint8)

# Logo stem on frosted glass:
for x in range(1272, 1326):
    ey = get_edge_y(x)
    roi = res[ey+2:118, x]
    b, g, r = roi[:, 0], roi[:, 1], roi[:, 2]
    gray = cv2.cvtColor(roi.reshape(-1, 1, 3), cv2.COLOR_BGR2GRAY).flatten()
    m = ((b.astype(int) - r.astype(int) > 4) | (gray < 145)).astype(np.uint8) * 255
    mask[ey+2:118, x] = m

# TECHNOVATE (y in [116, 162], x in [1244, 1375])
roi1 = res[116:162, 1244:1375]
g1 = cv2.cvtColor(roi1, cv2.COLOR_BGR2GRAY)
mask[116:162, 1244:1375] = (g1 < 146).astype(np.uint8) * 255

# SOLUTIONS (y in [162, 198], x in [1250, 1350])
roi2 = res[162:198, 1250:1350]
g2 = cv2.cvtColor(roi2, cv2.COLOR_BGR2GRAY)
mask[162:198, 1250:1350] = (g2 < 146).astype(np.uint8) * 255

# HTDESABAO, INOIA (y in [198, 226], x in [1254, 1340])
roi3 = res[198:226, 1254:1340]
g3 = cv2.cvtColor(roi3, cv2.COLOR_BGR2GRAY)
mask[198:226, 1254:1340] = (g3 < 143).astype(np.uint8) * 255

# Dilate mask
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)

# Inpaint frosted glass text
res_clean = cv2.inpaint(res, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

# Save preview
preview = res_clean[20:250, 1150:1376]
cv2.imwrite('scripts/final_preview2.png', preview)
print("Saved final_preview2.png")
