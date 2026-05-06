import os
import re

def convert_style(match):
    style_str = match.group(1)
    rules = [r.strip() for r in style_str.split(';') if r.strip()]
    obj_props = []
    for rule in rules:
        if ':' not in rule: continue
        k, v = rule.split(':', 1)
        k = k.strip()
        v = v.strip().replace("'", '"')
        parts = k.split('-')
        k_camel = parts[0] + ''.join(p.capitalize() for p in parts[1:])
        obj_props.append(f'{k_camel}: "{v}"')
    return 'style={{' + ', '.join(obj_props) + '}}'

html_to_jsx_replacements = [
    (r'\bclass=', 'className='),
    (r'\bfor=', 'htmlFor='),
    (r'<img(.*?)(?<!/)>', r'<img\1 />'),
    (r'<input(.*?)(?<!/)>', r'<input\1 />'),
    (r'<br>', r'<br />'),
    (r'<hr>', r'<hr />'),
    (r'style="([^"]*)"', convert_style),
    (r'<!--(.*?)-->', r'{/* \1 */}'),
    (r'<video(.*?)></video>', r'<video\1></video>'),
]

def html_to_jsx(html):
    jsx = html
    for p, r in html_to_jsx_replacements:
        if callable(r):
            jsx = re.sub(p, r, jsx)
        else:
            jsx = re.sub(p, r, jsx, flags=re.DOTALL if '<!--' in p else 0)
    
    # Fix links
    jsx = jsx.replace('href="index.html"', 'href="/"')
    jsx = jsx.replace('href="appreciate.html"', 'href="/appreciate"')
    jsx = jsx.replace('href="aava.html"', 'href="/aava"')
    jsx = jsx.replace('href="contraband.html"', 'href="/contraband"')
    jsx = jsx.replace('href="hamleys.html"', 'href="/hamleys"')
    return jsx

# 1. Generate Carousel.tsx
carousel_code = """\"use client";

import Link from 'next/link';
import Image from 'next/image';

const projects = [
  { id: 'appreciate', title: 'Appreciate', subtext: 'How a fintech compounds interest', img: '/assets/APPRECIATE1.png' },
  { id: 'aava', title: 'Aava', subtext: 'How two words made a 20-year-old water brand uncopyable', img: '/assets/AAVA3.png' },
  { id: 'contraband', title: 'Contraband', subtext: 'How a stain launched a luxury fragrance to 88 million people', img: '/assets/CONTRABAND2.png' },
  { id: 'hamleys', title: 'Hamleys', subtext: "How a 250-year-old toy store helped Gen Z defuse a time bomb on Valentine's Day", img: '/assets/HAMLEYS4.png' },
];

export default function Carousel({ currentProject }: { currentProject: string }) {
  const displayProjects = projects.filter(p => p.id !== currentProject);

  const scrollByAmount = (amount: number) => {
    const el = document.getElementById('work-carousel');
    if (el) el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="cs-carousel-section" style={{ padding: '2rem 0 8rem', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <button className="carousel-nav-btn carousel-prev" onClick={() => scrollByAmount(-400)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div id="work-carousel" className="carousel-track" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '0 max(2rem, calc(50vw - 570px)) 2rem', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {displayProjects.map((p) => (
            <div key={p.id} className="carousel-item">
              <img src={p.img} alt={p.title} />
              <div className="carousel-text-overlay">
                <h3 className="carousel-glass-text">{p.title}</h3>
                <p className="carousel-subtext">{p.subtext}</p>
              </div>
              <Link href={`/${p.id}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}></Link>
            </div>
          ))}
        </div>

        <button className="carousel-nav-btn carousel-next" onClick={() => scrollByAmount(400)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </section>
  );
}
"""

with open("C:/Users/harsh/Desktop/machinga-nextjs/src/components/Carousel.tsx", "w", encoding="utf-8") as f:
    f.write(carousel_code)

# 2. Process case studies
files = ['appreciate.html', 'aava.html', 'contraband.html', 'hamleys.html']
for filename in files:
    project_id = filename.split('.')[0]
    app_dir = f"C:/Users/harsh/Desktop/machinga-nextjs/src/app/{project_id}"
    os.makedirs(app_dir, exist_ok=True)
    
    with open(f"c:/Users/harsh/Desktop/Machinga/{filename}", 'r', encoding='utf-8') as f:
        html = f.read()
        
    main_match = re.search(r'</header>(.*?)<!-- (More Work Carousel|Footer) -->', html, flags=re.DOTALL)
    if not main_match:
        print(f"Failed to parse {filename}")
        continue
        
    main_html = main_match.group(1).strip()
    
    jsx_content = html_to_jsx(main_html)
    
    page_tsx = f"""import Carousel from '@/components/Carousel';

export default function {project_id.capitalize()}Page() {{
  return (
    <main>
      {jsx_content}
      <Carousel currentProject="{project_id}" />
    </main>
  );
}}
"""
    with open(f"{app_dir}/page.tsx", 'w', encoding='utf-8') as f:
        f.write(page_tsx)
    print(f"Generated {project_id}/page.tsx")

with open("C:/Users/harsh/Desktop/machinga-nextjs/src/app/page.tsx", "r", encoding="utf-8") as f:
    home_content = f.read()
home_content = home_content.replace('href="appreciate.html"', 'href="/appreciate"')
home_content = home_content.replace('href="aava.html"', 'href="/aava"')
home_content = home_content.replace('href="contraband.html"', 'href="/contraband"')
home_content = home_content.replace('href="hamleys.html"', 'href="/hamleys"')
with open("C:/Users/harsh/Desktop/machinga-nextjs/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(home_content)

print("Done converting case studies.")
