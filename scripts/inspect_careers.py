from PIL import Image
import numpy as np

im = Image.open('public/images/careers-young-team.webp')
w, h = im.size
print(f"Image size: {w}x{h}, format: {im.format}")

# Crop the top-right region: roughly x from 80% to 100%, y from 0% to 40%
crop_x1 = int(w * 0.82)
crop_y1 = int(h * 0.05)
crop_x2 = int(w * 0.99)
crop_y2 = int(h * 0.35)

crop = im.crop((crop_x1, crop_y1, crop_x2, crop_y2))
crop.save('scripts/top_right_crop.png')
print(f"Saved crop ({crop_x1}, {crop_y1}, {crop_x2}, {crop_y2}) to scripts/top_right_crop.png")
