import os

css_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\globals.css"
carousel_css = """

/* ── More Work Carousel ─────────────────────────────────────── */
.carousel-track::-webkit-scrollbar { display: none; }
.carousel-item {
    position: relative;
    flex: 0 0 1140px;
    max-width: 85vw;
    height: 354px;
    scroll-snap-align: center;
    border-radius: 20px;
    overflow: hidden;
}
.carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.carousel-text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    pointer-events: none;
    z-index: 2;
    padding: 0 2rem;
    box-sizing: border-box;
}
.carousel-glass-text {
    margin: 0;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.25);
    text-shadow: 0 10px 40px rgba(0,0,0,0.5);
}
.carousel-subtext {
    margin: 0.5rem 0 0 0;
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 4px 15px rgba(0,0,0,0.8);
}
.carousel-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 10;
    transition: transform 0.2s, box-shadow 0.2s;
}
.carousel-nav-btn:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.carousel-prev { left: max(2rem, calc(50vw - 570px + 2rem)); }
.carousel-next { right: max(2rem, calc(50vw - 570px + 2rem)); }
@media (max-width: 768px) {
    .carousel-item {
        height: 250px;
        flex: 0 0 85vw;
    }
    .carousel-nav-btn {
        width: 40px;
        height: 40px;
    }
}
"""
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

if '.carousel-track' not in css_content:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(carousel_css)

import re

pages = [
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\hamleys\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\aava\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\contraband\page.tsx",
    r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\appreciate\page.tsx"
]

target_cta = 'Let\'s make something<br />that <span style={{color: "var(--green)"}}>appreciates.</span>'

for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace title text
    content = re.sub(
        r'<h2 className="cs-next-title"[^>]*>.*?</h2>',
        f'<h2 className="cs-next-title" style={{{{color: "#1a1a1a", marginBottom: "3rem"}}}}>Let\'s make something<br />that <span style={{{{color: "var(--green)"}}}}>appreciates.</span></h2>',
        content,
        flags=re.DOTALL
    )
    
    # 2. Replace button text
    content = content.replace("Start A Project", "Start A Conversation")
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates completed successfully.")
