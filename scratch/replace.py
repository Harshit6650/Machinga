import re

with open('c:/Users/harsh/Desktop/Machinga/aava.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = r'''            <h1 class="cs-title" style="line-height: 1.1; margin-bottom: 4rem;">Alkaline, <br>But <span class="green-text">True.</span></h1>

            <div class="cs-meta" style="margin-bottom: 4rem;">
                <div class="meta-item">
                    <span class="meta-label">Brand</span>
                    <span class="meta-value" style="font-weight: 600;">Aava</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Work</span>
                    <span class="meta-value" style="font-weight: 600;">Brand Positioning + Campaign Strategy + Film Production</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Platform</span>
                    <span class="meta-value" style="font-weight: 600;">Instagram + Digital</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Result</span>
                    <span class="meta-value" style="font-weight: 600;">A two-word line that competitors have not copied.<br>Because they can't.</span>
                </div>
            </div>

            <div class="cs-hero-image" style="margin-bottom: 6rem;">
                <img src="./assets/aava videos/hero section.png" alt="Aava Hero Image" style="width: 100%; border-radius: 20px; display: block; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            </div>
        </div>
    </section>

    <!-- 01 The Trap -->
    <section class="cs-block-section">
        <div class="cs-container">
            <div class="cs-content-narrow">
                <span class="cs-section-label">01 — The Trap</span>
                <p class="cs-section-text">In 2024, alkaline water was everywhere. Health communities had been talking about the benefits of high-pH water for years: immunity, antioxidants, reduced inflammation. The market had responded with enthusiasm. Dozens of new DTC brands launched claiming alkalinity. The shelves filled up. So did Instagram.</p>
                <p class="cs-section-text">For Aava, a 20-year-old natural mineral water brand from the Aravalli Hills, this should have been the moment. Their water has always been naturally alkaline, pH 7.8–8.5, rich in bicarbonates, silica, magnesium, calcium. Not because of what Aava does to it, but because of where it comes from. And because Aava protects it. The Aravallis are among the oldest mountain ranges on earth. Twenty years of trickling through layers of alluvium and clay. The minerals aren't added. They're there. The alkalinity isn't engineered. It's geological.</p>
                <p class="cs-section-text">The trend arrived. And instead of rewarding Aava, it handed the category's language to anyone willing to claim it. Because the brands crowding into the alkaline water space were doing something quite different. Take regular water. Strip it with RO purification. Remove everything in it, including the minerals. Then ionise it temporarily to push the pH above 7. Now you can call it alkaline. The alkalinity will hold long enough to pass a test and label the bottle. One brand added minerals back to their RO water to make the claim. Another launched water that was black. Their reasoning: it's alkaline because it's black. We're not making that up.</p>
                <p class="cs-section-text">The category that should have given Aava a platform gave the platform to everyone. The genuine article was indistinguishable from the imitations — not because the products were similar, but because the language available to describe them was the same.</p>

                <div style="border-left: 4px solid var(--green); padding-left: 1.5rem; margin: 3rem 0; font-size: 1.8rem; font-weight: 800; color: #1a1a1a; line-height: 1.3;">
                    The genuine article was indistinguishable from the imitations not because the products were similar, but because the language available to describe them was the same. Every brand said "alkaline." The word had been diluted into meaninglessness.
                </div>
            </div>
        </div>
    </section>

    <!-- 02 The Diagnosis -->
    <section class="cs-block-section" style="padding-top: 2rem;">
        <div class="cs-container">
            <div class="cs-content-narrow">
                <span class="cs-section-label">02 — The Diagnosis</span>
                <p class="cs-section-text">The brief, as Aava framed it, was a communication problem. How do you convey the distinction of natural alkalinity in a market full of manufactured alkalinity, without requiring a chemistry lecture from every bottle? Aava came to that brief with a sharp instinct already formed: whatever we say has to hold up under scrutiny.</p>
                <p class="cs-section-text">That was the right instinct. It just needed sharpening into something structural. We worked from that instinct to find the real goalpost: whatever we say has to be structurally uncopyable. Not just true. Impossible for a competitor to safely repeat.</p>

                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; margin: 3rem 0;">
                    <span style="color: var(--green); font-size: 18px; font-weight: 800; display: block; margin-bottom: 1rem;">The Deeper Problem</span>
                    <p class="cs-section-text" style="margin-bottom: 0;">The alkaline water trend had made pH the headline number. But pH is not the benefit — it's a symptom. Aava's water is alkaline because it is mineral-rich. The minerals came first. The pH followed. Competitors had inverted this entirely. They engineered the indicator without the mineralogy that makes the number meaningful. A stat had been separated from its cause and turned into a marketing variable.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 03 The Insight -->
    <section class="cs-block-section" style="padding-top: 2rem;">
        <div class="cs-container">
            <div class="cs-content-narrow">
                <span class="cs-section-label">03 — The Insight</span>
                <p class="cs-section-text">We entered the nature vs. nurture debate. And we came down hard on nature. The born genius. The natural athlete. The person who just has it — whatever it is — without trying. There's a cultural reverence for that. For things that arrive as they are, without engineering or interference.</p>
                <p class="cs-section-text">Aava didn't create its alkalinity. It discovered it. The water arrives at the bottling facility already alkaline, already mineral-rich, already exactly what it needs to be. Aava's role in the process is essentially: don't ruin it. Don't strip it with RO. Don't ionise it. Don't add things back. Just protect what's already there and put it in a bottle.</p>

                <div style="text-align: center; margin: 5rem 0;">
                    <h2 style="font-size: 36px; color: var(--green); text-transform: uppercase; font-weight: 800; margin-bottom: 1rem; letter-spacing: 1px;">#BornAlkaline</h2>
                    <p style="font-size: 1.2rem; color: #666; font-weight: 500;">Two words. Every RTB lands naturally underneath them.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 4rem;">
                    <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; text-align: center;">
                        <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 0.5rem; text-transform: uppercase;">Not RO purified</span>
                        <p style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0; line-height: 1.3;">It retains the goodness<br>within.</p>
                    </div>
                    <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; text-align: center;">
                        <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 0.5rem; text-transform: uppercase;">No UV treatment</span>
                        <p style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0; line-height: 1.3;">It's naturally<br>bacteria-free.</p>
                    </div>
                    <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; text-align: center;">
                        <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 0.5rem; text-transform: uppercase;">No added minerals</span>
                        <p style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0; line-height: 1.3;">They were already<br>there.</p>
                    </div>
                    <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; text-align: center;">
                        <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 0.5rem; text-transform: uppercase;">Not ionised</span>
                        <p style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0; line-height: 1.3;">It's born<br>that way.</p>
                    </div>
                </div>

                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; margin: 3rem 0;">
                    <span style="color: var(--green); font-size: 18px; font-weight: 800; display: block; margin-bottom: 1rem;">Why it's uncopyable</span>
                    <p class="cs-section-text" style="margin-bottom: 0;">A competitor cannot say they are born alkaline. Because they weren't. They were made alkaline, temporarily, by a process that involves first removing everything natural about water and then adding some of it back. Born is not a claim you can manufacture. The line is a trap for imitators. Use it without the product to back it, and the claim destroys you.</p>
                </div>
            </div>

            <div class="cs-image-center" style="margin-top: 4rem; display: flex; justify-content: center;">
                <div style="width: 220px; height: 486px; max-width: 100%; background: #000000; padding: 10px; border-radius: 36px; box-sizing: border-box; display: flex; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <video src="./assets/aava videos/1777466446827621.mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 26px;"></video>
                </div>
            </div>
        </div>
    </section>

    <!-- 04 The Campaign -->
    <section class="cs-block-section" style="padding-top: 4rem; padding-bottom: 4rem;">
        <div class="cs-container">
            <div class="cs-content-narrow" style="text-align: center; margin-bottom: 3rem;">
                <span class="cs-section-label">04 — The Campaign</span>
                <h2 class="cs-section-heading">Three films. Three registers. One argument.</h2>
            </div>

            <div class="cs-three-screens" style="margin-bottom: 4rem;">
                <div style="width: 220px; height: 486px; max-width: 100%; background: #000000; padding: 10px; border-radius: 36px; box-sizing: border-box; display: flex; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <video src="./assets/aava videos/Happy_Accident_Portrait_For CC.mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 26px;"></video>
                </div>
                <div style="width: 220px; height: 486px; max-width: 100%; background: #000000; padding: 10px; border-radius: 36px; box-sizing: border-box; display: flex; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <video src="./assets/aava videos/Sip test_Portrait_CC_SUBS (1).mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 26px;"></video>
                </div>
                <div style="width: 220px; height: 486px; max-width: 100%; background: #000000; padding: 10px; border-radius: 36px; box-sizing: border-box; display: flex; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <video src="./assets/aava videos/1777466243541432.mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 26px;"></video>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem;">
                    <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 1rem; text-transform: uppercase;">Taste a Happy Accident</span>
                    <p class="cs-section-text" style="font-size: 1rem; margin-bottom: 0;">The brand launch film. Beautiful slow-motion product shots, ASMR sound design, and a voice-over so matter-of-fact it tips into self-deprecation: "Don't even give us the credit. Honestly, we had nothing to do with it." Brands that manufacture their alkalinity have to work hard to make it sound impressive. Aava's answer was the opposite. We barely did anything. The understatement is the proof of confidence.</p>
                </div>
                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem;">
                    <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 1rem; text-transform: uppercase;">The (Subtle) Sip Test</span>
                    <p class="cs-section-text" style="font-size: 1rem; margin-bottom: 0;">The anti-ad. A deadpan film that does the opposite of what product advertising usually does: no transformation, no performance, no before-and-after. Just water drunk, and the quiet confidence that the benefit doesn't need announcing. Every RTB lands as a negative that's actually a positive: not RO purified, not UV treated, no added minerals, not artificially alkaline. Each one a thing Aava doesn't have to do. "Look again."</p>
                </div>
                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem;">
                    <span style="color: var(--green); font-size: 16px; font-weight: 800; display: block; margin-bottom: 1rem; text-transform: uppercase;">Don't Be That Client</span>
                    <p class="cs-section-text" style="font-size: 1rem; margin-bottom: 0;">The funny one. And the one that escaped the building. A well-worn viral format: the impossible client, the exasperated employee, the conflict that escalates past reason. We cast a fake alkaline water brand called Generic in the lead role. The client's instructions map, beat for beat, onto what competitor brands actually do to manufacture alkalinity: strip with RO, ionise to push the pH, add minerals back, make it black. Turned up to 11, it becomes absurdist comedy. Except nothing was exaggerated.</p>
                </div>
            </div>

            <div class="cs-content-narrow">
                <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem;">
                    <span style="color: var(--green); font-size: 18px; font-weight: 800; display: block; margin-bottom: 1rem;">What "Don't Be That Client" proved</span>
                    <p class="cs-section-text" style="margin-bottom: 0;">When a film about your competitor's manufacturing process becomes a meme template, you've won the category argument without winning a single debate. Reposted by Zepto and Instamart.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 05 What Uncopyable Actually Means -->
    <section class="cs-split-section" style="background-color: #F5F5F7; padding-top: 6rem; padding-bottom: 6rem;">
        <div class="cs-container">
            <div class="cs-split-grid reverse">
                <div class="cs-split-image" style="display: flex; justify-content: center;">
                    <div style="width: 220px; height: 486px; max-width: 100%; background: #000000; padding: 10px; border-radius: 36px; box-sizing: border-box; display: flex; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                        <video src="./assets/aava videos/Happy_Accident_Portrait_For CC.mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 26px;"></video>
                    </div>
                </div>
                <div style="padding-right: 3rem;">
                    <span class="cs-section-label">05 — What Uncopyable Actually Means</span>
                    <p class="cs-section-text">Since #BornAlkaline launched, not one competitor has adopted the language. That's unusual. In crowded categories, successful lines get imitated. Brands pick up the vocabulary of whoever breaks through and wear it as their own. It happened with "natural." It happened with "pure." It happened with "alkaline" itself.</p>
                    
                    <div style="border: 1px solid #eaeaea; border-radius: 16px; padding: 2.5rem 2rem; margin-top: 3rem; background: #ffffff;">
                        <span style="color: var(--green); font-size: 18px; font-weight: 800; display: block; margin-bottom: 1rem;">The real result</span>
                        <p class="cs-section-text" style="margin-bottom: 0;">Born Alkaline hasn't been copied. Because the brands who would copy it know that copying it would invite scrutiny they can't survive. The moment a brand that ionises RO water calls itself Born Alkaline, someone asks the obvious question. That's what uncopyable means. Not a line that's clever enough that no one thinks to copy it. A line that's true enough that copying it is dangerous. Aava had that product for twenty years. It took two words to say it.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>'''

start_marker = r'<h1 class="cs-title">Alkaline, <br>But <span class="green-text">True\.</span></h1>'
end_marker = r'<!-- Ready to build yours -->'

new_content = re.sub(
    start_marker + r'.*?' + end_marker,
    replacement + '\n\n    ' + end_marker,
    content,
    flags=re.DOTALL
)

with open('c:/Users/harsh/Desktop/Machinga/aava.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
