import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
res = img.copy()

# -------------------------------------------------------------
# STEP 1: CLEAR GLASS & LOGO RECONSTRUCTION (y: 0 to 68, x: 68 to 125)
# -------------------------------------------------------------
# Left anchor: x_l = 68. Right anchor: x_r = 125.
x_l, x_r = 68, 125
for x in range(x_l, x_r + 1):
    a = (x - x_l) / (x_r - x_l)
    res[0:68, x] = (1 - a) * img[0:68, x_l] + a * img[0:68, x_r]

# -------------------------------------------------------------
# STEP 2: FROSTED GLASS TOP EDGE RECONSTRUCTION (y: 65 to 76, x: 68 to 125)
# -------------------------------------------------------------
# Frosted film edge slopes smoothly from y=69 at x=68 to y=65 at x=125
for x in range(x_l, x_r + 1):
    a = (x - x_l) / (x_r - x_l)
    edge_y = int(round((1 - a) * 69 + a * 65))
    # Match the clear glass just above edge
    for dy in range(-3, 0):
        res[edge_y + dy, x] = (1 - a) * img[edge_y + dy, x_l] + a * img[edge_y + dy, x_r]
    # Match the frosted glass at edge and just below
    for dy in range(0, 8):
        res[edge_y + dy, x] = (1 - a) * img[edge_y + dy, x_l] + a * img[edge_y + dy, x_r]

# -------------------------------------------------------------
# STEP 3: MASK ALL TEXT & LOGO REMNANTS ON FROSTED FILM
# -------------------------------------------------------------
t_mask = np.zeros(img.shape[:2], dtype=np.uint8)

# Logo stem & bottom remnants: y in [68, 88], x in [72, 120]
roi_ls = res[68:88, 72:120]
ls_gray = cv2.cvtColor(roi_ls, cv2.COLOR_BGR2GRAY)
b, g, r = roi_ls[:, :, 0], roi_ls[:, :, 1], roi_ls[:, :, 2]
t_mask[68:88, 72:120] = (
    (ls_gray < 145) | 
    (b.astype(int) - r.astype(int) > 5) |
    (b > 125)
).astype(np.uint8) * 255

# TECHNOVATE: y in [86, 132], x in [42, 172]
roi1 = res[86:132, 42:172]
g1 = cv2.cvtColor(roi1, cv2.COLOR_BGR2GRAY)
t_mask[86:132, 42:172] = (g1 < 148).astype(np.uint8) * 255

# SOLUTIONS: y in [132, 169], x in [50, 148]
roi2 = res[132:169, 50:148]
g2 = cv2.cvtColor(roi2, cv2.COLOR_BGR2GRAY)
t_mask[132:169, 50:148] = (g2 < 148).astype(np.uint8) * 255

# HTDESABAO, INOIA: y in [169, 196], x in [54, 138]
roi3 = res[169:196, 54:138]
g3 = cv2.cvtColor(roi3, cv2.COLOR_BGR2GRAY)
t_mask[169:196, 54:138] = (g3 < 145).astype(np.uint8) * 255

# Dilate mask generously
t_mask = cv2.dilate(t_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)

# Inpaint with Telea
res_inpaint = cv2.inpaint(res, t_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

# Save result
cv2.imwrite('scripts/test_inpaint_clean2.png', res_inpaint)
print("Saved test_inpaint_clean2.png")
