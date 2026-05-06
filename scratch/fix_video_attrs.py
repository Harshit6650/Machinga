import glob
import re

files = glob.glob('C:/Users/harsh/Desktop/machinga-nextjs/src/app/**/page.tsx', recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace autoplay with autoPlay
    content = re.sub(r'\bautoplay\b', 'autoPlay', content)
    # Replace playsinline with playsInline
    content = re.sub(r'\bplaysinline\b', 'playsInline', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Fixed JSX video attributes")
