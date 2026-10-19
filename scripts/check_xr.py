import cv2

orig = cv2.imread('scripts/partition_detail.png')
print("Pixel at (x=128, y=73):", orig[73, 128])
print("Around x=128, y=73:")
for y in range(65, 80):
    print(f"y={y}: x=125: {orig[y, 125]}, x=128: {orig[y, 128]}, x=135: {orig[y, 135]}")
