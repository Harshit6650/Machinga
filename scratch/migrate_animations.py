import re
import os

with open("c:/Users/harsh/Desktop/Machinga/js/main.js", "r", encoding="utf-8") as f:
    main_js = f.read()

# Remove the Mobile Menu Toggle logic
main_js = re.sub(r'//\s*MOBILE MENU TOGGLE.*?const menuToggle.*?\}\);', '', main_js, flags=re.DOTALL | re.IGNORECASE)

# Remove the Contact Form logic
main_js = re.sub(r'//\s*CONTACT FORM.*?const contactForm.*?\}\);', '', main_js, flags=re.DOTALL | re.IGNORECASE)

# Remove the Newsletter Form logic
main_js = re.sub(r'//\s*NEWSLETTER FORM.*?const newsletterForm.*?\}\);', '', main_js, flags=re.DOTALL | re.IGNORECASE)

# Wrap it in a React component
react_code = f""""use client";

import {{ useEffect }} from 'react';

export default function HomeClientLogic() {{
  useEffect(() => {{
    // We only want this to run once when the component mounts
    let isInitialized = false;
    if (isInitialized) return;
    isInitialized = true;

    try {{
{main_js}
    }} catch (e) {{
      console.error("HomeClientLogic Error:", e);
    }}

    return () => {{
      // Cleanups if necessary (for a full SPA experience, we should remove window event listeners)
      // Since this is a simple migration, we'll let them persist or rely on full page reloads if needed,
      // but ideally we'd clean them up.
    }};
  }}, []);

  return null;
}}
"""

os.makedirs("c:/Users/harsh/Desktop/Machinga/machinga-nextjs/src/components", exist_ok=True)
with open("c:/Users/harsh/Desktop/Machinga/machinga-nextjs/src/components/HomeClientLogic.tsx", "w", encoding="utf-8") as f:
    f.write(react_code)

# Now inject it into page.tsx
with open("c:/Users/harsh/Desktop/Machinga/machinga-nextjs/src/app/page.tsx", "r", encoding="utf-8") as f:
    page_tsx = f.read()

if "HomeClientLogic" not in page_tsx:
    page_tsx = page_tsx.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport HomeClientLogic from '@/components/HomeClientLogic';")
    page_tsx = page_tsx.replace("<main>", "<main>\n      <HomeClientLogic />")
    
    with open("c:/Users/harsh/Desktop/Machinga/machinga-nextjs/src/app/page.tsx", "w", encoding="utf-8") as f:
        f.write(page_tsx)

print("HomeClientLogic created and injected")
