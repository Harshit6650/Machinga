import re

with open('c:/Users/harsh/Desktop/Machinga/aava.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the Next Project Banner and More Work Carousel
new_content = re.sub(
    r'<!-- Next Project Banner -->.*?<!-- Footer -->',
    r'<!-- Footer -->',
    content,
    flags=re.DOTALL
)

with open('c:/Users/harsh/Desktop/Machinga/aava.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
