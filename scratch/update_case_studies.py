import os

def update_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Hamleys
hamleys_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\hamleys\page.tsx"
update_file(hamleys_path, [
    ('href="index.html#contact"', 'href="/#contact"'),
    ('Start A Conversation', 'Start A Project'),
    ('Let\'s make something<br />that <span style={{color: "var(--green)"}}>appreciates.</span>',
     'Want your campaign to be seen by people that <span style={{color: "var(--green)"}}>matter?</span>')
])

# 2. Aava
aava_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\aava\page.tsx"
update_file(aava_path, [
    ('href="index.html#contact"', 'href="/#contact"'),
    ('Start A Conversation', 'Start A Project'),
    ('Your brand deserves<br />a brief this\n                <span style={{color: "var(--green)"}}>interesting.</span>',
     'Your brand deserves<br />a line this <span style={{color: "var(--green)"}}>uncopyable.</span>'),
    ('Your brand deserves<br />a brief this <span style={{color: "var(--green)"}}>interesting.</span>',
     'Your brand deserves<br />a line this <span style={{color: "var(--green)"}}>uncopyable.</span>')
])

# 3. Contraband
contraband_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\contraband\page.tsx"
stats_old = """            <div style={{textAlign: "left", maxWidth: "800px", margin: "0 auto"}}>
                <h4 className="cs-title" style={{fontWeight: "800", color: "#1a1a1a", marginBottom: "0.5rem", lineHeight: "1"}}>88<span style={{color: "var(--green)"}}>M+</span></h4>
                <p style={{fontSize: "1rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "3rem"}}>Combined views</p>
                
                <p className="cs-section-text">Let It Stain: 60 million views in two weeks. The snackable cut: 26.4 million views. For a fragrance brand's fourth SKU, no human talent, a brief that asked luxury to feel illicit without being explicit.</p>
                <p className="cs-section-text" style={{fontWeight: "600", color: "#1a1a1a"}}>The number is not the point. The architecture is the point. The number is what happens when the architecture works.</p>
            </div>"""

stats_new = """            <div className="cs-stats-grid">
                <div className="cs-stat-item">
                    <h4>88<span style={{fontSize: "inherit", color: "var(--green)"}}>M+</span></h4>
                    <span>Combined views</span>
                </div>
                <div className="cs-stat-item">
                    <h4>2 <span style={{fontSize: "inherit", color: "var(--green)"}}>Weeks</span></h4>
                    <span>Time</span>
                </div>
                <div className="cs-stat-item">
                    <h4>0<span style={{fontSize: "inherit", color: "var(--green)"}}></span></h4>
                    <span>Human Talent</span>
                </div>
            </div>
            
            <div className="cs-content-narrow" style={{marginTop: "4rem"}}>
                <p className="cs-section-text">Let It Stain: 60 million views in two weeks. The snackable cut: 26.4 million views. For a fragrance brand's fourth SKU, no human talent, a brief that asked luxury to feel illicit without being explicit.</p>
                <p className="cs-section-text" style={{fontWeight: "600", color: "#1a1a1a", marginTop: "2rem"}}>The number is not the point. The architecture is the point. The number is what happens when the architecture works.</p>
            </div>"""

update_file(contraband_path, [
    ('href="index.html#contact"', 'href="/#contact"'),
    ('Start A Conversation', 'Start A Project'),
    ('Your brand deserves<br />a brief this <span style={{color: "var(--green)"}}>interesting.</span>',
     'Want your ad to become a<br />cultural <span style={{color: "var(--green)"}}>moment?</span>'),
    (stats_old, stats_new)
])

# 4. Appreciate
appreciate_path = r"c:\Users\harsh\Desktop\machinga-nextjs\src\app\appreciate\page.tsx"
update_file(appreciate_path, [
    ('href="index.html#contact"', 'href="/#contact"'),
    ('Start A Conversation', 'Start A Project'),
    ('Let\'s make something<br />that <span style={{color: "var(--green)"}}>appreciates.</span>',
     'Let\'s make content that<br />compounds <span style={{color: "var(--green)"}}>interest.</span>'),
    ('<h4>5<span style={{fontSize: "inherit", color: "var(--green)"}}>L</span></h4>',
     '<h4>6<span style={{fontSize: "inherit", color: "var(--green)"}}>L</span></h4>')
])

print("Updates completed successfully.")
