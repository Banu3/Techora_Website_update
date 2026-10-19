import cv2
import numpy as np

orig = cv2.imread('public/images/careers-young-team.webp.orig')

# Let's inspect column gradients across x = 1246 to 1376
# In each column, where does the clear glass transition to frosted glass?
# Frosted glass has higher green/gray value than clear glass below the light tube.
for x in range(1250, 1370, 10):
    col = orig[80:115, x]
    gray = cv2.cvtColor(col.reshape(-1, 1, 3), cv2.COLOR_BGR2GRAY).flatten()
    grad = np.diff(gray.astype(float))
    edge = np.argmax(grad) + 80
    print(f"x={x}: max grad at y={edge}, gray values [{gray[edge-80-1]:.0f} -> {gray[edge-80+1]:.0f}]")
