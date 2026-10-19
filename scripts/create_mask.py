import cv2
import numpy as np
from PIL import Image

# Load detail
img = cv2.imread('scripts/partition_detail.png')
res = img.copy()

# ==========================================
# 1. REMOVE TEXT ON FROSTED GLASS (y >= 75)
# ==========================================
# Seam is at x = 46.
# Text is in:
# - TECHNOVATE: y in [85, 132], x in [46, 170]
# - SOLUTIONS: y in [132, 172], x in [56, 160]
# - HTDESABAO, INOIA: y in [172, 210], x in [55, 140]
# And the lower stem of the logo: y in [70, 85], x in [75, 115]

# Notice that for any y between 75 and 215, the frosted glass color is smoothly varying vertically,
# but uniform horizontally!
# Let's inspect the clean frosted columns:
# x in [48, 55] is between the seam (x=46) and the letters (starting x=55-60 for SOLUTIONS and HTDESABAO).
# Wait, for TECHNOVATE, the 'T' starts at x=52.
# But look at x in [15, 42]: that is the adjacent panel's frosted glass, which has the exact same lighting!
# And even better, in the current panel:
# For y in [75, 88]: clean frosted glass across almost all x (except logo stem at x=80..105).
# For y in [210, 230]: clean frosted glass across all x in [48, 175]!
# To the right of text:
# For TECHNOVATE, x > 165 is clean frosted glass.
# For SOLUTIONS, x > 145 is clean frosted glass.
# For HTDESABAO, x > 135 is clean frosted glass.

# Let's create a precise mask for the text and logo:
mask = np.zeros(img.shape[:2], dtype=np.uint8)

# Mask for logo:
# Logo is in y in [10, 85], x in [75, 128]
# Let's find exact logo pixels:
logo_patch = img[10:85, 75:128]
# Blue color: B channel is high, or grey is dark, or edge highlights
l_b, l_g, l_r = logo_patch[:, :, 0], logo_patch[:, :, 1], logo_patch[:, :, 2]
l_gray = cv2.cvtColor(logo_patch, cv2.COLOR_BGR2GRAY)
logo_mask_roi = (
    (l_b.astype(int) - l_r.astype(int) > 8) | # Blue tones
    (l_gray < 85) |                          # Dark shadow parts
    (l_gray > 160) |                         # Light tube / specular rim on logo
    ((l_b > 115) & (l_g < 125))              # Blue-purple tones
).astype(np.uint8) * 255

# Dilate to cover all anti-aliased fringes
logo_mask_roi = cv2.dilate(logo_mask_roi, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)), iterations=2)
mask[10:85, 75:128] = logo_mask_roi

# Mask for text on frosted glass:
# All three lines of text are darker than frosted glass:
# Frosted glass gray is ~ 135 to 175. Text gray is < 135.
# But let's mask the entire bounding box of each text line with a solid mask or dilated threshold!
# Why not a solid box for each line, or a generous dilation?
# Because frosted glass has NO details behind it!
# A box mask or dilated mask in frosted glass inpainted from top/bottom/left/right will be perfectly seamless!
# Let's check text mask:
text_roi = img[86:215, 46:176]
t_gray = cv2.cvtColor(text_roi, cv2.COLOR_BGR2GRAY)

# In the text ROI, compute background by taking median along horizontal or local regions:
# Frosted glass in this region has gray ~ 140-175.
# Text pixels have gray < 138.
t_mask = (t_gray < 138).astype(np.uint8) * 255
# Dilate generously so NO anti-aliased edge pixel remains
t_mask = cv2.dilate(t_mask, cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7)), iterations=2)
mask[86:215, 46:176] = t_mask

# Also include the logo stem transition into frosted glass at y in [70, 90]
cv2.imwrite('scripts/test_mask.png', mask)
print("Saved scripts/test_mask.png")
