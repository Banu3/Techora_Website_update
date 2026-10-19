import cv2
import numpy as np
from PIL import Image

# Load original image
im = Image.open('public/images/careers-young-team.webp').convert('RGB')
img = np.array(im)[:, :, ::-1].copy() # BGR

# Coordinates in full image:
# Glass partition with text is in x in [1235, 1376], y in [35, 250]
# Specifically:
# 1. Text area: y in [130, 245], x in [1240, 1376]
# 2. Logo area: y in [38, 140], x in [1280, 1335]

mask = np.zeros(img.shape[:2], dtype=np.uint8)

# Mask the text:
# Isolate text pixels in y in [130, 245], x in [1240, 1376]
text_roi = img[130:245, 1240:1376]
text_gray = cv2.cvtColor(text_roi, cv2.COLOR_BGR2GRAY)
# Frosted film is ~150-165 gray. Text is < 125.
t_mask = (text_gray < 130).astype(np.uint8) * 255
t_mask = cv2.dilate(t_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1)
mask[130:245, 1240:1376] = t_mask

# Mask the logo:
# Logo is in y in [38, 140], x in [1275, 1335]
logo_roi = img[38:140, 1275:1335]
b, g, r = logo_roi[:, :, 0], logo_roi[:, :, 1], logo_roi[:, :, 2]
logo_gray = cv2.cvtColor(logo_roi, cv2.COLOR_BGR2GRAY)

# Blue parts of logo (b > r + 15), dark parts of logo (gray < 110), lighter top rim
l_mask = ((b.astype(int) - r.astype(int) > 12) | (logo_gray < 115) | ((b > 130) & (r < 100))).astype(np.uint8) * 255
# Dilate logo mask slightly
l_mask = cv2.dilate(l_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=2)
mask[38:140, 1275:1335] = l_mask

# First pass: inpaint the text using a horizontal radius so it samples from the clean frosted film horizontally!
# Text is on uniform frosted film, so horizontal inpainting (radius 4) keeps the vertical gradient perfect.
inpainted = img.copy()

# Inpaint text region first:
text_only_mask = np.zeros_like(mask)
text_only_mask[135:245, 1240:1376] = mask[135:245, 1240:1376]
inpainted = cv2.inpaint(inpainted, text_only_mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

# Logo region:
logo_only_mask = np.zeros_like(mask)
logo_only_mask[38:140, 1275:1335] = mask[38:140, 1275:1335]
# Also inpaint the lower transition of logo at y=120-140
logo_only_mask[120:140, 1275:1335] = mask[120:140, 1275:1335]
inpainted = cv2.inpaint(inpainted, logo_only_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

# Clean up any residual artifact in the frosted film by smoothly sampling the clean frosted texture from column x=1220-1235
# In the vertical strip x=1240 to 1370, y=95 to 235:
# Compare the frosted film to the clean neighbor:
clean_frosted = inpainted[90:240, 1215:1230] # 15 px wide clean strip
# Average color profile along y:
profile = np.mean(clean_frosted, axis=1) # shape (150, 3)

# Save result crop
crop_result = inpainted[0:300, 1100:1376]
cv2.imwrite('scripts/inpainted_clean.png', crop_result)
print("Saved scripts/inpainted_clean.png")
