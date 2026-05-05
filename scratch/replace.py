import os
import glob

files = glob.glob('*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replacement 1: Inline styles
    content = content.replace('background: #000000; padding: 10px;', 'border: 4px solid #000000;')
    
    # Replacement 2: CSS in contraband.html
    if 'contraband.html' in filepath:
        content = content.replace('background: #000000;\n    padding: 10px;', 'border: 4px solid #000000;')
        # Update border-radius of the video to match the new border (36px - 4px = 32px)
        content = content.replace('border-radius: 26px; /* 36px - 10px padding */', 'border-radius: 32px;')

    # Replacement 3: aava.html and hamleys.html where border-radius is 26px inside the inline style
    # Since we removed the 10px padding, the child video's border-radius needs to adjust so it doesn't look weird.
    # If the container is 36px radius, and border is 4px, child should be 32px.
    content = content.replace('border-radius: 26px;', 'border-radius: 32px;')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
