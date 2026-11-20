import os
from PIL import Image
import numpy as np

# Source image provided by user
SRC_PATH = r"C:/Users/jeetr/.gemini/antigravity/brain/611decec-91b7-47a1-9d8a-0015f493e442/.user_uploaded/media_1795172991769_d99c059b.png"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
APP_DIR = os.path.join(ROOT_DIR, "src", "app")

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(APP_DIR, exist_ok=True)

print(f"Loading source image from {SRC_PATH}...")
im = Image.open(SRC_PATH).convert("RGBA")

# Clean faint alpha artifacts < 15
data = np.array(im)
alpha = data[:, :, 3]
data[alpha < 15, 3] = 0

# Find tight bounding box of real emblem pixels
mask = data[:, :, 3] >= 15
rows = np.where(mask.any(axis=1))[0]
cols = np.where(mask.any(axis=0))[0]
ymin, ymax = rows[0], rows[-1]
xmin, xmax = cols[0], cols[-1]

w = xmax - xmin + 1
h = ymax - ymin + 1
print(f"Detected emblem bounds: x=[{xmin}, {xmax}], y=[{ymin}, {ymax}], dimensions={w}x{h}")

clean_emblem = Image.fromarray(data).crop((xmin, ymin, xmax + 1, ymax + 1))

def generate_square_icon(size, inner_ratio=0.88, bg_color=(0, 0, 0, 0)):
    """Generate a square icon of size x size with emblem centered."""
    if size <= 16:
        inner = 14
    elif size <= 32:
        inner = 28
    elif size <= 48:
        inner = 42
    else:
        inner = int(round(size * inner_ratio))

    scale = inner / max(clean_emblem.width, clean_emblem.height)
    nw = int(round(clean_emblem.width * scale))
    nh = int(round(clean_emblem.height * scale))

    resized = clean_emblem.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg_color)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas

# 1. Multi-resolution ICO (16, 32, 48)
print("Generating multi-resolution ICO...")
ico_16 = generate_square_icon(16)
ico_32 = generate_square_icon(32)
ico_48 = generate_square_icon(48)
ico_64 = generate_square_icon(64)

public_ico = os.path.join(PUBLIC_DIR, "favicon.ico")
app_ico = os.path.join(APP_DIR, "favicon.ico")

ico_16.save(public_ico, format="ICO", append_images=[ico_32, ico_48, ico_64])
ico_16.save(app_ico, format="ICO", append_images=[ico_32, ico_48, ico_64])
print(f"Saved {public_ico} and {app_ico}")

# 2. Standard PNG favicons
png_favicons = {
    "favicon.png": 32,
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

for filename, size in png_favicons.items():
    icon = generate_square_icon(size)
    dest = os.path.join(PUBLIC_DIR, filename)
    icon.save(dest, format="PNG")
    print(f"Saved {dest} ({size}x{size})")

# 3. Next.js App Router root icons
app_icon_png = os.path.join(APP_DIR, "icon.png")
icon_512 = generate_square_icon(512)
icon_512.save(app_icon_png, format="PNG")
print(f"Saved {app_icon_png} (512x512)")

# 4. Apple Touch Icons (180x180) - with #FAF9F6 brand canvas background for iOS
apple_touch_icon = generate_square_icon(180, inner_ratio=0.75, bg_color=(250, 249, 246, 255))
apple_dest = os.path.join(PUBLIC_DIR, "apple-touch-icon.png")
apple_precomp = os.path.join(PUBLIC_DIR, "apple-touch-icon-precomposed.png")
apple_app = os.path.join(APP_DIR, "apple-icon.png")

apple_touch_icon.save(apple_dest, format="PNG")
apple_touch_icon.save(apple_precomp, format="PNG")
apple_touch_icon.save(apple_app, format="PNG")
print(f"Saved Apple Touch Icons: {apple_dest}, {apple_precomp}, {apple_app}")

print("All favicon assets generated successfully!")
