import cv2
import numpy as np
from PIL import Image

# Load detail
img = cv2.imread('scripts/partition_detail.png').astype(float)
clean = img.copy()

# -------------------------------------------------------------
# PART 1: CLEAR GLASS & LOGO AREA (y from 0 to 72, x from 72 to 128)
# -------------------------------------------------------------
# On the left of logo: x=70
# On the right of logo: x=128
# The background is a horizontal office scene:
# - dark ceiling on top
# - white light tube around y=40-44
# - glass reflection below tube
# Since it runs horizontally, horizontal linear interpolation between column 70 and column 128
# will seamlessly continue the ceiling, the light tube, and the glass reflection!
x_left = 70
x_right = 128

for x in range(x_left, x_right + 1):
    alpha = (x - x_left) / (x_right - x_left)
    # Blend between column x_left and column x_right for y in [0, 72]
    interp_col = (1 - alpha) * img[0:72, x_left] + alpha * img[0:72, x_right]
    clean[0:72, x] = interp_col

# -------------------------------------------------------------
# PART 2: FROSTED GLASS & TEXT (y from 72 to 215, x from 48 to 175)
# -------------------------------------------------------------
# Frosted glass panel extends from seam x=47 to right edge x=175.
# In the frosted glass, light is diffused with a vertical gradient.
# Let's inspect where clean frosted glass exists at each y:
# To the left of text: adjacent panel (x=20 to 45) has the exact same lighting and frosted film!
# Let's verify color offset between panel left of seam (x=40) and panel right of seam (x=50):
# In rows y=215..228 (clean on both sides of seam):
diff_across_seam = img[215:228, 50:70].mean(axis=(0,1)) - img[215:228, 20:40].mean(axis=(0,1))
print("Diff across seam:", diff_across_seam)

# In the current panel, clean frosted glass exists:
# - at the right side: x in [160, 175] for y in [72, 215]
# - and at the left side of seam: x in [25, 42]
# Even better, the vertical profile can be computed from the average of clean areas:
# For each y from 72 to 215:
# - x in [25, 42] is 100% clean frosted glass on the left!
# - We can adjust for the slight panel offset (diff_across_seam) to get the exact panel profile.
# Let's compute reference profile:
ref_profile = np.zeros((215 - 72, 3))
for i, y in enumerate(range(72, 215)):
    # Left clean strip (x=25..42)
    left_c = img[y, 25:42].mean(axis=0) + diff_across_seam
    # Right clean strip if available (e.g. x=165..175)
    # At y > 130, right side x=150..175 is also clean
    if y >= 170:
        right_c = img[y, 145:175].mean(axis=0)
        ref_profile[i] = 0.5 * left_c + 0.5 * right_c
    elif y >= 130:
        right_c = img[y, 160:175].mean(axis=0)
        ref_profile[i] = 0.4 * left_c + 0.6 * right_c
    else:
        # Near TECHNOVATE, right side x=168..175 is clean
        right_c = img[y, 168:175].mean(axis=0)
        ref_profile[i] = 0.5 * left_c + 0.5 * right_c

# Now, we also want the natural grain texture!
# Let's extract the high-frequency grain from clean areas:
# Clean patch: y=210..228, x=50..170
clean_patch = img[210:228, 50:170]
grain_patch = clean_patch - cv2.GaussianBlur(clean_patch, (5, 5), 0)
std_grain = grain_patch.std()
print(f"Natural frosted film grain std: {std_grain:.2f}")

# Synthesize frosted glass for the text + logo stem region:
# Region: y in [72, 205], x in [48, 170]
np.random.seed(42)
for i, y in enumerate(range(72, 205)):
    for x in range(48, 170):
        # We only replace where the mask was (or everywhere in the text box)
        # Replacing the whole text zone guarantees ZERO text ghosting or halos!
        grain = np.random.normal(0, std_grain, 3)
        # Slight horizontal gradient if right side is slightly brighter
        h_factor = (x - 48) / (170 - 48)
        clean[y, x] = ref_profile[i] + grain

# Apply a subtle bilateral / edge-preserving filter only at the seam boundary (x=47..49)
# to keep the glass seam razor-sharp
clean_uint8 = np.clip(clean, 0, 255).astype(np.uint8)
cv2.imwrite('scripts/test_synth.png', clean_uint8)
print("Saved test_synth.png")
