import cv2
import numpy as np

orig = cv2.imread('public/images/careers-young-team.webp.orig')
H, W = orig.shape[:2]
res = orig.copy()

def get_edge_y(x):
    return int(round(104.0 - 0.22 * (x - 1250.0)))

x_l = 1265
x_r = 1335
edge_l = get_edge_y(x_l)
edge_r = get_edge_y(x_r)

for x in range(x_l, x_r + 1):
    alpha = (x - x_l) / (x_r - x_l)
    edge_y = get_edge_y(x)
    
    # 1. Clear glass above frosted edge (y: 25 to edge_y - 2)
    for y in range(25, edge_y - 1):
        res[y, x] = (1 - alpha) * orig[y, x_l] + alpha * orig[y, x_r]
        
    # 2. Beveled frosted edge (edge_y - 1 to edge_y + 1)
    for dy in (-1, 0, 1):
        y = edge_y + dy
        res[y, x] = (1 - alpha) * orig[edge_l + dy, x_l] + alpha * orig[edge_r + dy, x_r]
        
    # 3. Frosted glass from edge_y + 2 down to 118 (where logo was)
    # Blend between clean frosted glass at x_l and x_r
    for y in range(edge_y + 2, 118):
        # Map y relative to edge
        dist_from_edge = y - edge_y
        yl = min(117, edge_l + dist_from_edge)
        yr = min(117, edge_r + dist_from_edge)
        res[y, x] = (1 - alpha) * orig[yl, x_l] + alpha * orig[yr, x_r]

# 4. Now the text lines on frosted glass (y: 116 to 230):
mask = np.zeros((H, W), dtype=np.uint8)

# TECHNOVATE (y in [116, 162], x in [1244, 1375])
roi1 = res[116:162, 1244:1375]
g1 = cv2.cvtColor(roi1, cv2.COLOR_BGR2GRAY)
mask[116:162, 1244:1375] = (g1 < 147).astype(np.uint8) * 255

# SOLUTIONS (y in [162, 198], x in [1250, 1350])
roi2 = res[162:198, 1250:1350]
g2 = cv2.cvtColor(roi2, cv2.COLOR_BGR2GRAY)
mask[162:198, 1250:1350] = (g2 < 147).astype(np.uint8) * 255

# HTDESABAO, INOIA (y in [198, 226], x in [1254, 1340])
roi3 = res[198:226, 1254:1340]
g3 = cv2.cvtColor(roi3, cv2.COLOR_BGR2GRAY)
mask[198:226, 1254:1340] = (g3 < 144).astype(np.uint8) * 255

# Dilate mask to catch anti-aliased borders
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)

# Inpaint with Telea
res_clean = cv2.inpaint(res, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

preview = res_clean[20:250, 1150:1376]
cv2.imwrite('scripts/final_preview3.png', preview)
print("Saved final_preview3.png")
