import os
import shutil
from PIL import Image

brain_dir = r'C:\Users\jeetr\.gemini\antigravity\brain\5def5ce0-5f70-442f-a6ed-10b82e795f6d'

mapping = {
    'drop_002_front_1795173621332.jpg': 'public/images/drops/drop-002-front.jpg',
    'drop_002_back_1795173655987.jpg': 'public/images/drops/drop-002-back.jpg',
    'drop_003_front_1795173676471.jpg': 'public/images/drops/drop-003-front.jpg',
    'drop_003_back_1795173694210.jpg': 'public/images/drops/drop-003-back.jpg',
    'drop_000_front_1795173715355.jpg': 'public/images/drops/drop-000-front.jpg',
    'drop_000_back_1795173735608.jpg': 'public/images/drops/drop-000-back.jpg',
    'journal_01_1795173757299.jpg': 'public/images/journal/journal-01.jpg',
    'journal_02_1795173781692.jpg': 'public/images/journal/journal-02.jpg',
}

for src_name, dst_path in mapping.items():
    src_full = os.path.join(brain_dir, src_name)
    if not os.path.exists(src_full):
        print(f"ERROR: {src_full} not found!")
        continue
    # Ensure dest dir exists
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    shutil.copy2(src_full, dst_path)
    
    # Also verify with PIL
    img = Image.open(dst_path)
    print(f"Copied {src_name} -> {dst_path} | Size: {img.size} | Mode: {img.mode} | Bytes: {os.path.getsize(dst_path)}")

print("\nAll drop and journal images successfully deployed!")
