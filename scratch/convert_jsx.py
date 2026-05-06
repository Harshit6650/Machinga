import re

def html_to_jsx(html):
    # Replace class= with className=
    jsx = re.sub(r'\bclass=', 'className=', html)
    # Replace for= with htmlFor=
    jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)
    
    # Self-closing tags
    jsx = re.sub(r'<img(.*?)(?<!/)>', r'<img\1 />', jsx)
    jsx = re.sub(r'<input(.*?)(?<!/)>', r'<input\1 />', jsx)
    jsx = re.sub(r'<br>', r'<br />', jsx)
    jsx = re.sub(r'<hr>', r'<hr />', jsx)
    
    # Inline styles: replace style="key: value; key: value;" with style={{key: 'value', key: 'value'}}
    def style_repl(match):
        style_str = match.group(1)
        rules = [r.strip() for r in style_str.split(';') if r.strip()]
        obj_props = []
        for rule in rules:
            if ':' not in rule: continue
            k, v = rule.split(':', 1)
            k = k.strip()
            v = v.strip().replace("'", '"')
            # camelCase the key
            parts = k.split('-')
            k_camel = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            obj_props.append(f'{k_camel}: "{v}"')
        return 'style={{' + ', '.join(obj_props) + '}}'
        
    jsx = re.sub(r'style="([^"]*)"', style_repl, jsx)
    
    # Remove HTML comments
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)
    
    return jsx

if __name__ == "__main__":
    with open("c:/Users/harsh/Desktop/Machinga/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # Extract just the main content (between header and footer)
    start_str = '<!-- \n           CANVAS SCROLL SECTION'
    end_str = '<!-- Footer -->'
    
    start_idx = html.find(start_str)
    end_idx = html.find(end_str)
    
    main_html = html[start_idx:end_idx]
    jsx_content = html_to_jsx(main_html)
    
    page_tsx = """"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  // Add state/refs for dropdowns and animations
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === id ? null : id);
    // Scroll logic will go here
  };

  useEffect(() => {
    // Import the old main.js logic here or translate it
    // For now, we will just use basic React logic
  }, []);

  return (
    <main>
""" + jsx_content + """
    </main>
  );
}
"""
    
    with open("c:/Users/harsh/Desktop/Machinga/machinga-nextjs/src/app/page.tsx", "w", encoding="utf-8") as f:
        f.write(page_tsx)
    print("Converted index.html to page.tsx")
