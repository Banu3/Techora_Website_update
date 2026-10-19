import cv2

res = cv2.imread('scripts/test_inpaint_clean.png')
cv2.imwrite('scripts/dip_zoom.png', res[45:85, 80:130])
print("Saved dip_zoom.png")
