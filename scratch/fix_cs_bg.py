import os

css_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\globals.css"
with open(css_path, 'a', encoding='utf-8') as f:
    f.write("\n\n/* Wrapper for Case Study Pages */\n.cs-page {\n    background: #ffffff;\n    color: #1a1a1a;\n    min-height: 100vh;\n}\n")

pages = [
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\hamleys\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\aava\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\contraband\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\appreciate\page.tsx"
]

for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just in case it was already replaced
    if '<main className="cs-page">' not in content:
        content = content.replace('<main>', '<main className="cs-page">')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updates completed successfully.")
