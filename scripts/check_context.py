import cv2
import numpy as np
from PIL import Image

im = Image.open('public/images/careers-young-team.webp')
img = np.array(im)

# Let's crop from x=1000 to 1376, y=20 to 140
crop = img[20:140, 1000:1376]
Image.fromarray(crop).save('scripts/frosted_edge_context.png')
print("Saved frosted_edge_context.png")
