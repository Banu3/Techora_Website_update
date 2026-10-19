import cv2
import numpy as np
from PIL import Image

# Load original image
im = Image.open('public/images/careers-young-team.webp').convert('RGB')
img = np.array(im)[:, :, ::-1].copy() # BGR

h, w = img.shape[:2]

# Bounding box for the entire logo + text area in the full image coordinates:
# From top_right_crop (1128, 38, 1362, 268)
# Logo starts at y ≈ 50, x ≈ 1210
# Text ends at y ≈ 225, x ≈ 1370
# Let's create an accurate mask

mask = np.zeros((h, w), dtype=np.uint8)

# Region containing logo + text:
x1, y1 = 1200, 50
x2, y2 = 1376, 235

# Inside this region, the text and logo are darker/colored compared to the frosted glass background.
roi = img[y1:y2, x1:x2]
gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

# The frosted glass background in this ROI has gray value around 140-165.
# The letters are dark gray (values < 110)
# The logo has blue color (higher B than R, G)
b, g, r = roi[:, :, 0], roi[:, :, 1], roi[:, :, 2]
text_mask = (gray_roi < 125)
logo_mask = ((b.astype(int) - r.astype(int)) > 20) | (gray_roi < 135)

roi_mask = np.zeros_like(gray_roi, dtype=np.uint8)
roi_mask[text_mask | logo_mask] = 255

# Clean up mask with dilation to cover antialiased edges
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
roi_mask = cv2.dilate(roi_mask, kernel, iterations=2)

mask[y1:y2, x1:x2] = roi_mask

# Run cv2.inpaint using both Telea and Navier-Stokes
inpainted_telea = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)
inpainted_ns = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_NS)

# Save crops to inspect
crop_telea = inpainted_telea[38:268, 1128:1362]
crop_ns = inpainted_ns[38:268, 1128:1362]

cv2.imwrite('scripts/crop_telea.png', crop_telea)
cv2.imwrite('scripts/crop_ns.png', crop_ns)
print("Inpainting complete, saved crops to scripts/")
