import os
import re

base_dir = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app"
pattern = re.compile(r'src="/assets/([^"]+)"')
replacement = r'src={`${process.env.NODE_ENV === \'production\' ? \'/machinga-nextjs\' : \'\'}/assets/\1`}'

for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(replacement, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
