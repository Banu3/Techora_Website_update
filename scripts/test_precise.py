import cv2
import numpy as np

img = cv2.imread('scripts/partition_detail.png')
res = img.copy()

# 1. Text masks:
# Each line of text can be extracted by thresholding inside its exact bounding box
mask = np.zeros(img.shape[:2], dtype=np.uint8)

# Line 1: TECHNOVATE
roi1 = img[88:128, 44:168]
g1 = cv2.cvtColor(roi1, cv2.COLOR_BGR2GRAY)
# frosted bg is ~150-165, text is <= 145
m1 = (g1 < 145).astype(np.uint8) * 255
m1 = cv2.dilate(m1, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)
mask[88:128, 44:168] = m1

# Line 2: SOLUTIONS
roi2 = img[132:168, 55:140]
g2 = cv2.cvtColor(roi2, cv2.COLOR_BGR2GRAY)
m2 = (g2 < 145).astype(np.uint8) * 255
m2 = cv2.dilate(m2, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)
mask[132:168, 55:140] = m2

# Line 3: HTDESABAO, INOIA
roi3 = img[170:192, 60:135]
g3 = cv2.cvtColor(roi3, cv2.COLOR_BGR2GRAY)
m3 = (g3 < 140).astype(np.uint8) * 255
m3 = cv2.dilate(m3, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)
mask[170:192, 60:135] = m3

# Logo: y in [8, 85], x in [74, 126]
# Let's inspect logo pixels
roi_l = img[8:85, 74:126]
gl = cv2.cvtColor(roi_l, cv2.COLOR_BGR2GRAY)
b, g, r = roi_l[:, :, 0], roi_l[:, :, 1], roi_l[:, :, 2]
# Blue parts (b - r > 10), dark parts (gl < 90), top curve highlight (gl > 155 and x in logo)
ml = ((b.astype(int) - r.astype(int) > 8) | (gl < 90) | ((gl > 155) & (roi_l[:, :, 0] > 140))).astype(np.uint8) * 255
ml = cv2.dilate(ml, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)), iterations=2)
mask[8:85, 74:126] = ml

# Save mask visualization
cv2.imwrite('scripts/mask_precise.png', mask)

# Let's run cv2.inpaint with Navier-Stokes and Telea to compare
out_ns = cv2.inpaint(img, mask, inpaintRadius=4, flags=cv2.INPAINT_NS)
out_telea = cv2.inpaint(img, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

cv2.imwrite('scripts/result_ns.png', out_ns)
cv2.imwrite('scripts/result_telea.png', out_telea)
print("Saved mask_precise.png, result_ns.png, result_telea.png")
