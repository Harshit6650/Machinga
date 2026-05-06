import os

metadata_map = {
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\hamleys\page.tsx": """
export const metadata = {
  title: "Hamleys Case Study | Machinga",
  description: "How a 250-year-old toy store helped Gen Z defuse a time bomb on Valentine's Day. Machinga's campaign strategy for Hamleys India.",
  alternates: { canonical: "https://studiomachinga.com/hamleys" }
};
""",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\aava\page.tsx": """
export const metadata = {
  title: "Aava Case Study | Machinga",
  description: "How two words made a 20-year-old water brand uncopyable. Brand positioning and campaign strategy for Aava.",
  alternates: { canonical: "https://studiomachinga.com/aava" }
};
""",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\contraband\page.tsx": """
export const metadata = {
  title: "Contraband Case Study | Machinga",
  description: "How a stain launched a luxury fragrance to 88 million people. Campaign concept and production for Contraband.",
  alternates: { canonical: "https://studiomachinga.com/contraband" }
};
""",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\appreciate\page.tsx": """
export const metadata = {
  title: "Appreciate Case Study | Machinga",
  description: "How a fintech compounds interest. Content strategy and multi-format production for Appreciate.",
  alternates: { canonical: "https://studiomachinga.com/appreciate" }
};
"""
}

for filepath, meta in metadata_map.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "export const metadata" not in content:
        # Insert metadata after imports
        parts = content.split("export default function")
        if len(parts) == 2:
            new_content = parts[0] + meta + "\nexport default function" + parts[1]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

print("Metadata injected.")
