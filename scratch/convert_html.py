import re

def html_to_jsx(html):
    # Basic HTML to JSX replacements
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html, flags=re.DOTALL)
    
    # Self-closing tags
    tags_to_close = ['img', 'input', 'br', 'hr', 'source', 'meta', 'link']
    for tag in tags_to_close:
        html = re.sub(r'<(' + tag + r'\b[^>]*?)(?<!/)>', r'<\1 />', html)

    # Convert stroke-width, etc.
    html = html.replace('stroke-width=', 'strokeWidth=')
    html = html.replace('stroke-linecap=', 'strokeLinecap=')
    html = html.replace('stroke-linejoin=', 'strokeLinejoin=')
    
    # JSX camel case for boolean attrs
    html = html.replace(' autoplay ', ' autoPlay ')
    html = html.replace(' playsinline ', ' playsInline ')
    html = html.replace(' autoplay>', ' autoPlay>')
    html = html.replace(' playsinline>', ' playsInline>')
    
    # Replace style string with basic parsing
    # We have some complex style tags like style="display: flex; position: relative;"
    def style_replacer(match):
        style_str = match.group(1)
        # Parse CSS string to object
        style_dict = {}
        for prop in style_str.split(';'):
            if ':' in prop:
                key, val = prop.split(':', 1)
                key = key.strip()
                val = val.strip()
                # camelCase key
                parts = key.split('-')
                key = parts[0] + ''.join(x.title() for x in parts[1:])
                style_dict[key] = val
        
        # build dict string
        dict_str = "{" + ", ".join(f"'{k}': '{v}'" for k, v in style_dict.items()) + "}"
        return f'style={{{dict_str}}}'
    
    html = re.sub(r'style="([^"]*)"', style_replacer, html)
    
    return html

with open(r"c:\Users\harsh\Desktop\Machinga\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract from loader-screen to the end of contact section
start = content.find('<div id="loader-screen"')
end = content.find('<footer')

html_content = content[start:end]

jsx_content = html_to_jsx(html_content)

# We need to preserve the imports in page.tsx
page_tsx = f""""use client";

import {{ useEffect, useRef, useState }} from 'react';
import Link from 'next/link';
import HomeClientLogic from '@/components/HomeClientLogic';

export default function Home() {{
  // Add state/refs for dropdowns and animations
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {{
    e.preventDefault();
    setActiveDropdown(activeDropdown === id ? null : id);
    // Scroll logic will go here
  }};

  useEffect(() => {{
    // Logic is in HomeClientLogic
  }}, []);

  return (
    <main>
      {{/* Inject the logic component without wrapping */}}
      <HomeClientLogic />

      {jsx_content}
    </main>
  );
}}
"""

with open(r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\page.tsx", "w", encoding="utf-8") as f:
    f.write(page_tsx)

print("Successfully updated page.tsx")
