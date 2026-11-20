import os
from PIL import Image

src_path = 'public/images/drops/drop-001-front.jpg'
img = Image.open(src_path)
width, height = img.size

# 1. Floral Embroidery & "Better Days Ahead" (Chest right)
# Coordinates approx: x: 460..780, y: 200..460
crop_embroidery = img.crop((460, 200, 780, 480))
crop_embroidery.save('public/images/drops/drop-001-detail1.jpg', quality=95)
crop_embroidery.save('public/images/drops/drop-001-detail-1.jpg', quality=95)

# 2. Tethered Canvas Tag & Knotted Ribbon ("for a kinder you")
# Coordinates approx: x: 500..760, y: 560..860
crop_tag = img.crop((500, 560, 760, 860))
crop_tag.save('public/images/drops/drop-001-detail2.jpg', quality=95)
crop_tag.save('public/images/drops/drop-001-detail-2.jpg', quality=95)

# 3. Sleeve Emblem (OUTSIDE Wear Your Story)
# Coordinates approx: x: 770..930, y: 350..520
crop_sleeve = img.crop((770, 350, 930, 520))
crop_sleeve.save('public/images/drops/drop-001-sleeve.jpg', quality=95)

# 4. Lycra Rib Collar & Inner Stamped Label
# Coordinates approx: x: 380..580, y: 60..220
crop_collar = img.crop((380, 60, 580, 220))
crop_collar.save('public/images/drops/drop-001-collar.jpg', quality=95)

print("Detail crops generated successfully!")
