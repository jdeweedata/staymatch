import { useState } from "react";

const mono = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
const display = "'Playfair Display', 'Georgia', serif";
const body = "'DM Sans', 'Helvetica Neue', sans-serif";

const phases = [
    {
        id: "phase1",
        num: "01",
        title: "StayMatch",
        subtitle: "Preference-Based Discovery",
        timeline: "Months 0–6",
        color: "#8B5CF6",
        colorLight: "#C4B5FD",
        goal: "Acquire first 5,000 active users and 500 bookings. Prove that preference-matched discovery converts better than search-based OTAs. Begin post-stay data collection to seed the Truth Engine.",
        icp: {
            primary: {
                name: "Digital Nomads & Remote Workers",
                size: "18.5M in US alone (MBO Partners 2025), 40–80M globally",
                income: "$124K avg annual income",
                why: "They book hotels 6–12x/year, WiFi speed is a non-negotiable decision factor, they're early adopters of new travel tech, and they actively share tools in community forums (Nomad List, r/digitalnomad, Twitter/X). They feel the 'listing vs reality' pain most acutely because a bad WiFi hotel ruins a work week, not just a vacation.",
                demographics: "75% Gen Z + Millennials, 66% white, 27% African American (growing fast via creator economy), avg 6.2 locations/year, 6.4 weeks per stop"
            },
            secondary: {
                name: "Millennial Couples (28–38, dual income, no kids yet)",
                size: "~35M in US",
                why: "Book 2–4 leisure trips/year, value aesthetics and vibe over brand loyalty, frustrated by scrolling 500+ results on Booking.com, willing to try new apps if the UX is beautiful. Their 'what kind of hotel do we want?' conversation is exactly what StayMatch replaces with swipes."
            },
            avoid: "Families with kids (too many constraints for MVP), business travelers (policy-driven, low personalization value), budget backpackers (low LTV, price-only decisions)"
        },
        positioning: {
            tagline: "Stop searching. Start matching.",
            oneLiner: "StayMatch learns what you actually want in a hotel — then finds it. No filters. No 500 results. Just your match.",
            against: {
                "vs Booking.com": "Booking gives you everything. We give you the one.",
                "vs Airbnb": "Airbnb is great until the listing photos lie. We show you what guests actually experienced.",
                "vs Mindtrip": "Mindtrip inspires. We book. Instantly, through 2M+ properties."
            }
        },
        channels: [
            {
                name: "Nomad Community Seeding",
                type: "Organic / Community",
                budget: "$2K–5K/mo",
                tactic: "Identify the 50 most active digital nomad communities (Nomad List forum, r/digitalnomad 2.1M members, r/remotework, Digital Nomad Girls FB 120K+, Slack groups like Nomads Talk). Don't spam — contribute genuinely for 4 weeks, then soft-launch with 'I built this because I was tired of checking into hotels with 2Mbps WiFi.' The origin story IS the marketing.",
                expectedCAC: "$5–15",
                metric: "500 waitlist signups in first 2 weeks"
            },
            {
                name: "Micro-Influencer Partnerships",
                type: "Paid / Influencer",
                budget: "$5K–10K/mo",
                tactic: "Partner with 20–30 travel-tech and digital nomad micro-influencers (10K–100K followers). Not travel influencers showing luxury resorts — tech-savvy creators who show their actual setup, WiFi speed tests, desk reviews. Provide free bookings in exchange for honest Truth Check content (they test WiFi, photograph the room, compare to listing). Their content becomes both marketing AND your first truth data.",
                expectedCAC: "$8–20",
                metric: "50 pieces of UGC content featuring speed test screenshots"
            },
            {
                name: "SEO / Content: 'Hotel Truth' Blog",
                type: "Organic / Content",
                budget: "$1K–3K/mo",
                tactic: "Publish data-driven hotel content nobody else can: 'The 10 Hotels in Lisbon with Actually Fast WiFi (Tested)', 'Bangkok Hotels Where the Listing Photos Match Reality', 'Best Hotels for Light Sleepers in Bali (Noise Measured).' This content is your moat — only you have the data. SEO long-tail keywords: 'hotel fast wifi [city]', 'quiet hotel [city]', 'hotel WiFi speed test [city].' These queries have zero competition because nobody has the data to rank for them.",
                expectedCAC: "$3–8 (after month 4)",
                metric: "10K organic monthly visitors by month 6"
            },
            {
                name: "Product-Led Viral Loop",
                type: "Product / Growth",
                budget: "$0 (built into product)",
                tactic: "After every booking, generate a shareable 'StayMatch Card' — a visual showing the user's taste profile (aesthetic preference, noise tolerance, WiFi needs) with their property match score. Designed for Instagram Stories and Twitter/X. The card includes a referral link: 'Find your hotel match → [link].' Referrer gets 5% off next booking when friend completes first booking.",
                expectedCAC: "$2–5 (referral cost)",
                metric: "15% of bookers share their StayMatch Card"
            },
            {
                name: "Launch City Strategy: Lisbon → Bali → Bangkok",
                type: "Geographic Focus",
                budget: "Included in above",
                tactic: "Don't launch globally. Start in the top 3 digital nomad hub cities where: (a) LiteAPI has strong inventory, (b) nomad density is highest, (c) the WiFi/noise pain point is most acute. Lisbon is #1 — massive nomad community, European base, well-documented WiFi variability between neighborhoods. Achieve 'Truth Dense' status in Lisbon first (60%+ property coverage), then replicate the playbook in Bali and Bangkok.",
                expectedCAC: "N/A",
                metric: "200+ properties with Truth Scores in Lisbon by month 6"
            }
        ],
        pricing: {
            model: "Commission-based (built into LiteAPI margin)",
            consumer: "Free to use. No subscription. No booking fee visible to user.",
            revenue: "Earn commission on every booking through LiteAPI (typically 15–25% margin on hotel rate). At $150 avg booking value and 20% margin, that's ~$30 per booking.",
            why: "Zero friction for adoption. Free is the only way to compete with Booking.com's network effects at launch. Monetize through volume, not fees."
        },
        milestones: [
            { month: "Month 1", target: "MVP live with swipe-based preference collection + LiteAPI booking for 3 cities", kpi: "100 signups" },
            { month: "Month 2", target: "Post-stay data collection flow shipped (WiFi test + 3 photos + 5 binary Qs)", kpi: "50 bookings, 10 truth contributions" },
            { month: "Month 3", target: "Nomad community seeding + first 10 micro-influencer partnerships live", kpi: "500 signups, 100 bookings" },
            { month: "Month 4", target: "First Truth Scores computed for 50+ Lisbon properties. Blog content publishing begins.", kpi: "1K signups, 200 bookings" },
            { month: "Month 5", target: "Referral system + StayMatch Card sharing live. Bali launch.", kpi: "2.5K signups, 350 bookings" },
            { month: "Month 6", target: "Bangkok launch. 200+ properties Truth-scored. Retention metrics validated.", kpi: "5K signups, 500 bookings, 100 truth contributions" },
        ],
        risks: [
            { risk: "Cold-start: not enough Truth data to differentiate from Booking.com", mitigation: "Seed truth data via influencer partnerships — pay 30 nomads to do Truth Checks at properties in launch cities before public launch. 30 people × 5 properties each = 150 seeded data points." },
            { risk: "Low contribution rate on post-stay data", mitigation: "A/B test incentive levels. If 5% discount doesn't work, try gamification (leaderboard), then try cash rewards ($5 per Truth Check). Find the minimum viable incentive." },
            { risk: "LiteAPI inventory gaps in launch cities", mitigation: "Pre-validate inventory coverage in each launch city before committing. Lisbon has strong OTA presence so LiteAPI coverage should be deep. Have fallback cities (Porto, Chiang Mai, Mexico City)." },
        ]
    },
    {
        id: "phase2",
        num: "02",
        title: "Truth Engine",
        subtitle: "Proprietary Data Platform",
        timeline: "Months 6–12",
        color: "#06B6D4",
        colorLight: "#67E8F9",
        goal: "Scale to 25K users and 5K bookings. Achieve 'Truth Dense' status in 3 cities. Launch Truth Score API for first B2B agency partners. Prove the data moat is forming — returning users convert at 2x+ rate of new users.",
        icp: {
            primary: {
                name: "Expanding ICP: Add 'Intentional Travelers' (quality-over-convenience seekers)",
                size: "58% of travelers feel overwhelmed by booking choices (2024 Amadeus data)",
                income: "$75K–200K household income",
                why: "These are people who spend 3+ hours researching a hotel before booking. They read TripAdvisor reviews, cross-check Google Maps photos, ask friends for recs — all because they don't trust listing data. Truth Scores eliminate this research tax entirely. They WANT objective data and will pay for certainty.",
                demographics: "30–50, urban, college-educated, book 3–6 hotel stays/year, use 3+ apps to research each booking"
            },
            secondary: {
                name: "B2B: Boutique Travel Agencies (5–50 employees)",
                size: "~45,000 travel agencies in US alone, most are small businesses",
                why: "They can't compete with OTA pricing, so they compete on curation and trust. Truth Scores give them proprietary intelligence to justify their fees: 'I'm recommending this hotel because its verified WiFi speed is 85Mbps and its noise level after 10pm averages 38dB — data you can't find on Booking.com.' This is their unfair advantage over DIY booking."
            },
            avoid: "Large TMCs (Navan, TripActions — they have their own data), OTA aggregators (conflicting business model)"
        },
        positioning: {
            tagline: "Every hotel tells a story. We check the facts.",
            oneLiner: "Truth Engine: verified, structured hotel data from real guests — WiFi speeds, noise levels, photo accuracy, accessibility — not opinions, measurements.",
            against: {
                "vs TripAdvisor": "TripAdvisor has opinions. We have measurements. '47Mbps average WiFi' vs 'WiFi was okay ★★★'.",
                "vs Booking.com Reviews": "Their 'WiFi: 8.2/10' tells you nothing. Our data shows speed by floor, by time of day, with 92% confidence.",
                "vs Google Maps": "Google knows how to get there. We know what it's actually like inside."
            }
        },
        channels: [
            {
                name: "Truth Score Content Flywheel",
                type: "Organic / SEO",
                budget: "$3K–8K/mo",
                tactic: "Scale the 'Hotel Truth' blog to 50+ data-driven articles per month across all Truth Dense cities. Each article is uniquely defensible: 'Lisbon Hotels Ranked by Verified WiFi Speed — February 2026 Update.' These articles cite YOUR data and link to YOUR booking flow. No competitor can replicate this content because they don't have the data. Add monthly city-level 'Truth Reports' — downloadable PDFs comparing all scored properties in a city. These become lead magnets for both consumers and agencies.",
                expectedCAC: "$2–5 (organic)",
                metric: "50K organic monthly visitors, 500 email subscribers"
            },
            {
                name: "Agency Partnership Program",
                type: "B2B / Direct Sales",
                budget: "$5K–10K/mo (sales + onboarding)",
                tactic: "Direct outreach to 200 boutique travel agencies. The pitch: 'Your clients ask you to recommend hotels. Right now, you're guessing based on Booking.com reviews and your own limited experience. What if you had verified, structured data — WiFi speeds, noise measurements, photo reality scores — for every property you sell? That's what Truth Score API gives you.' Start with 5 free beta partners, instrument everything, get testimonials, then scale. Price: $99–299/mo per agency for API access.",
                expectedCAC: "$200–500 per agency (B2B)",
                metric: "5 beta agencies live by month 8, 25 paying agencies by month 12"
            },
            {
                name: "Hotel Outreach (Supply-Side GTM)",
                type: "B2B / Partnerships",
                budget: "$2K–5K/mo",
                tactic: "Once a property has 10+ Truth data points, send them their Truth Score report — for free. 'Here's what verified guests measured at your property. Your WiFi averages 23Mbps (below city average of 45Mbps). Your noise level at night is 48dB (above city average of 38dB). Your listing photos are 72% accurate.' Hotels will WANT to improve their scores. Offer them a 'Verified by Truth Engine' badge they can display on their own site — free, in exchange for a co-marketing agreement. This turns hotels into distribution partners.",
                expectedCAC: "N/A (supply-side, revenue via booking volume)",
                metric: "50 hotels actively displaying Truth Engine badge by month 12"
            },
            {
                name: "PR: 'The Hotel Truth Index'",
                type: "Earned Media",
                budget: "$3K–5K (one-time PR push)",
                tactic: "Publish a quarterly 'Hotel Truth Index' — a data report revealing insights like: 'The Average Hotel Listing Overstates WiFi Speed by 340%', 'Which Hotel Chains Have the Most Accurate Listing Photos?', '73% of Hotels Claiming \"Quiet Rooms\" Exceed 45dB at Night.' This is catnip for travel journalists. Skift, PhocusWire, TechCrunch, NomadList blog, Condé Nast Traveler will cover it because it's data-driven, contrarian, and consumer-protective. Each article links back to your platform.",
                expectedCAC: "$0 (earned media)",
                metric: "3+ major travel/tech publications cover the Index within 2 weeks of release"
            },
            {
                name: "Contributor Community Growth",
                type: "Community / Gamification",
                budget: "$2K–4K/mo (rewards + tooling)",
                tactic: "Launch the 'Truth Pioneer' program. Top contributors (by accuracy and volume) get: verified badge on profile, priority access to new features, annual recognition event (virtual), featured in marketing content, and real perks (hotel partnerships for free nights). Create a contributor leaderboard by city. Nomads are competitive — gamify the data collection. Also launch a Discord/Slack community for Truth Pioneers where they share tips on contributing, discuss hotel quality, and form a self-reinforcing identity around 'verified travel.'",
                expectedCAC: "N/A (retention, not acquisition)",
                metric: "25% contribution rate on post-stay data, 200 active Truth Pioneers"
            },
        ],
        pricing: {
            model: "Consumer: Free (commission-based) | B2B: SaaS subscription",
            consumer: "Still free. Commission on bookings continues. No paywall on Truth Scores — the data is the product that attracts users who then book.",
            revenue: "Consumer: $30/booking × 5K bookings = $150K in 6 months. B2B: 25 agencies × $199/mo avg = ~$5K MRR by month 12. Total projected revenue by month 12: $200K–300K.",
            why: "The B2B revenue validates the data asset's commercial value. Consumer commission scales with volume. Keep consumer free to maximize booking volume (which feeds the data flywheel)."
        },
        milestones: [
            { month: "Month 7", target: "Truth Score API v1 deployed. First 5 beta agency partners onboarded.", kpi: "10K users, 1.5K bookings" },
            { month: "Month 8", target: "Lisbon achieves 'Truth Dense' status (60%+ property coverage). Hotel outreach begins.", kpi: "1K truth contributions total" },
            { month: "Month 9", target: "First 'Hotel Truth Index' published. PR push. Bali + Bangkok approaching Truth Dense.", kpi: "15K users, 2.5K bookings, 3 media placements" },
            { month: "Month 10", target: "Embeddable <truth-score> widget available for agency websites. Group taste merging shipped.", kpi: "2K truth contributions, 10 paying agencies" },
            { month: "Month 11", target: "3 cities Truth Dense. CV pipeline for photo reality scoring fully live.", kpi: "20K users, 4K bookings" },
            { month: "Month 12", target: "25 paying agency partners. Consumer retention validated (2x repeat booking rate for returning users).", kpi: "25K users, 5K bookings, 5K truth contributions, $25K MRR" },
        ],
        risks: [
            { risk: "Agencies don't see enough value in Truth Score data to pay", mitigation: "Start with free beta + measure. If agencies don't convert to paid, the data isn't specific enough. Add more fields (price-quality ratio, renovation recency, cancellation flexibility truth) until the data is irresistible." },
            { risk: "Hotels push back on being scored publicly", mitigation: "Frame as transparent quality measurement, not criticism. Hotels with good scores benefit enormously. Offer 'Truth Response' feature — hotels can address low scores publicly and re-verify after improvements. Turn adversarial dynamic into collaborative one." },
            { risk: "Data quality degrades as volume increases", mitigation: "Cross-validation engine flags outliers. Contributor accuracy scores downweight unreliable submitters. Consensus-based scoring means no single bad data point corrupts the Truth Score." },
        ]
    },
    {
        id: "phase3",
        num: "03",
        title: "AI Trip Architect",
        subtitle: "Conversational Intelligence + B2B Platform",
        timeline: "Months 12–18",
        color: "#10B981",
        colorLight: "#6EE7B7",
        goal: "Scale to 100K users and 100K bookings. Launch AI Trip Architect powered by proprietary Truth data. Open AgencyOS (white-label B2B platform). Begin licensing Truth data. Achieve $100K+ MRR.",
        icp: {
            primary: {
                name: "Mainstream Travelers Who Want Certainty",
                size: "Online travel market: $523B in 2024, projected $1.3T by 2030",
                income: "$60K+ household income",
                why: "By Phase 3, you're not niche anymore. The AI Trip Architect solves a universal problem: 'I want to go somewhere. I don't know where. Help me decide AND book.' This is the Booking.com replacement for anyone tired of 500 search results. The difference: your AI actually knows things (Truth data) that Booking.com's AI doesn't.",
                demographics: "25–55, digitally literate, books 2–8 hotel stays/year, values time savings over lowest price"
            },
            secondary: {
                name: "B2B: Mid-Market Agencies + DMOs + Hotel Groups",
                size: "Global travel agency market ~$800B, DMO budgets collectively $10B+",
                why: "Mid-market agencies (50–500 employees) want the intelligence you've built but as a white-label product. DMOs (Destination Marketing Organizations) want Truth data to benchmark their region's hotel quality. Hotel groups want competitive intelligence on their properties vs competitors. Each is a separate revenue stream from the same data asset."
            },
            avoid: "Price-only budget travelers (no LTV), corporate travel (Navan owns this)"
        },
        positioning: {
            tagline: "The AI that's actually been inside the hotel.",
            oneLiner: "Trip Architect doesn't just plan your trip — it knows which hotel's WiFi actually works, which rooms are quiet, and whether the photos are real. Because our AI has data from thousands of verified guests.",
            against: {
                "vs Google Gemini": "Google's AI plans trips using the same data everyone has. Ours has verified post-stay measurements nobody else does.",
                "vs Perplexity Comet": "Comet is a browser that navigates booking sites. We ARE the booking — with proprietary intelligence built in.",
                "vs Expedia Romie": "Romie matches trips to your Instagram Reels. Trip Architect matches trips to 2 years of learned preferences and 50K verified property measurements."
            }
        },
        channels: [
            {
                name: "AI Trip Architect as Product-Led Growth Engine",
                type: "Product / Viral",
                budget: "$0 (built into product)",
                tactic: "The conversational AI itself is the acquisition channel. User asks: 'Plan a 5-day trip to Portugal for a couple who works remotely and needs fast WiFi.' Trip Architect responds with a full itinerary where EVERY hotel has a verified Truth Score, specific WiFi measurements, noise data, and photo accuracy rating. This response is so visibly superior to ChatGPT/Google results (which have no proprietary data) that users share it. Enable one-click sharing of AI-generated itineraries as beautiful visual cards. The card says 'Planned by Trip Architect — powered by real hotel data from verified guests.'",
                expectedCAC: "$0–5",
                metric: "30% of AI-generated itineraries are shared socially"
            },
            {
                name: "AgencyOS White-Label Launch",
                type: "B2B / SaaS",
                budget: "$10K–20K/mo (sales team + support)",
                tactic: "Package the full stack — Truth Scores + AI Trip Architect + booking via LiteAPI — as a white-label platform for agencies. Agency puts their branding on it, uses it to serve their clients. Pricing: $499–2,999/mo depending on volume + per-booking commission sharing. The pitch: 'Give your agents an AI co-pilot with data nobody else has. Your clients get better recommendations. You book faster. You justify your fees with truth, not opinion.' This is the Shopify model applied to travel agencies — you're selling the infrastructure, not competing with them.",
                expectedCAC: "$500–1,500 per agency",
                metric: "50 AgencyOS customers by month 18, $50K+ B2B MRR"
            },
            {
                name: "Invisible Booking Layer (Embedded AI)",
                type: "B2B / Platform",
                budget: "$5K–10K/mo (BD + integration support)",
                tactic: "License a lightweight embeddable booking widget to non-travel apps. A fitness app wants to offer 'book a wellness retreat' — embeds your AI. A conference app wants to offer 'book nearby hotels' — embeds your AI. A flight comparison site wants to add hotel booking — embeds your AI. Each partner gets white-labeled AI + Truth data + booking via LiteAPI. You earn commission on every booking through every partner surface. This makes your booking infrastructure ubiquitous without needing your own consumer brand to grow.",
                expectedCAC: "N/A (partner-generated traffic)",
                metric: "10 non-travel apps embed booking widget by month 18"
            },
            {
                name: "Data Licensing to DMOs + Hotel Groups",
                type: "B2B / Data Products",
                budget: "$2K–5K/mo (sales)",
                tactic: "Package anonymized, aggregated Truth data into quarterly reports for DMOs: 'Lisbon Hotel Quality Report Q1 2027 — WiFi, noise, accessibility, and photo accuracy benchmarks across 500+ verified properties.' Pricing: $5K–25K per report per region. For hotel groups: competitive intelligence dashboard showing their properties' Truth Scores vs competitors, with trend data over time. This revenue stream requires zero additional product development — it's just packaging data you already have.",
                expectedCAC: "$1K–3K per client",
                metric: "5 DMO clients + 10 hotel group clients by month 18, $30K+ data licensing MRR"
            },
            {
                name: "Performance Marketing at Scale",
                type: "Paid / Digital",
                budget: "$20K–50K/mo",
                tactic: "Now that you've validated CAC:LTV ratios through organic channels, scale paid acquisition. Google Ads on high-intent queries: 'best hotel [city] fast wifi', 'hotel booking app', 'AI trip planner.' Meta Ads targeting by travel interest + remote work affinity. Retarget all website visitors who viewed Truth Scores but didn't book. Key creative: Truth Score comparison ads showing your verified data vs generic Booking.com listings. Let data be the differentiator in the creative itself.",
                expectedCAC: "$15–30 (blended)",
                metric: "50K new users/month from paid channels at positive ROI"
            },
            {
                name: "Emerging Market Expansion",
                type: "Geographic / Strategic",
                budget: "$10K–15K/mo",
                tactic: "Expand Truth Engine to high-growth travel markets: Mexico City, Medellín, Cape Town, Dubai, Tbilisi — all rising nomad hubs where hotel quality data is MOST needed (high variability, low transparency). Localize the app (Spanish, Portuguese, Arabic). Add local payment methods via LiteAPI's infrastructure. First-mover in these markets with structured hotel truth data creates an even wider moat than in saturated Western markets.",
                expectedCAC: "$5–15 (lower in emerging markets)",
                metric: "10 new Truth Dense cities including 4+ in emerging markets"
            }
        ],
        pricing: {
            model: "Multi-revenue: Consumer commission + B2B SaaS + Data licensing + Embedded commerce",
            consumer: "Still free. Premium tier for power users ($9.99/mo): unlimited AI conversations, advanced filtering by Truth data, exclusive early access to new cities, family/group taste profile management.",
            revenue: "Consumer bookings: $30 × 100K bookings = $3M/yr run rate. AgencyOS: 50 agencies × $999/mo avg = $50K MRR. Data licensing: $30K MRR. Embedded booking: commission on partner-generated bookings = $20K+ MRR. Total projected MRR by month 18: $100K–150K.",
            why: "Four distinct revenue streams reduce dependency on any single channel. Consumer bookings are volume. B2B is high-margin recurring. Data licensing is pure profit. Embedded commerce scales without your own acquisition costs."
        },
        milestones: [
            { month: "Month 13", target: "AI Trip Architect MVP launched — conversational booking powered by Truth Engine data", kpi: "30K users, 15K bookings total" },
            { month: "Month 14", target: "AgencyOS beta with 10 pilot agencies. First DMO data licensing deal signed.", kpi: "40K users, $30K MRR" },
            { month: "Month 15", target: "Invisible Booking Layer widget v1 available. 3 non-travel app partners signed.", kpi: "50K users, $50K MRR" },
            { month: "Month 16", target: "Premium consumer tier launched. Emerging market expansion begins (Medellín, CDMX).", kpi: "65K users, $70K MRR" },
            { month: "Month 17", target: "50 AgencyOS customers. 10 Truth Dense cities globally. Hotel Truth Index covered by 5+ major publications.", kpi: "85K users, $90K MRR" },
            { month: "Month 18", target: "100K users. 4 revenue streams active. Fundraise-ready with clear data moat, proven unit economics, and diversified revenue.", kpi: "100K users, 100K bookings total, 25K truth contributions, $100K+ MRR" },
        ],
        risks: [
            { risk: "Google or Booking.com copies AI trip planning with their own data", mitigation: "They will — but with the same data everyone has. Your AI has Truth Engine data they don't. The differentiation is the data, not the AI wrapper. Stay 18 months ahead on data accumulation." },
            { risk: "AgencyOS cannibalization — agencies compete with your consumer product", mitigation: "Design AgencyOS for agency-specific workflows (group quotes, multi-hotel packages, commission tracking) that consumers don't need. The products serve different jobs-to-be-done." },
            { risk: "Spreading too thin across consumer + B2B + data licensing + embedded", mitigation: "Staff each revenue stream with a dedicated owner. Consumer product lead, B2B sales lead, data partnerships lead. Don't let any single person run all four. Sequence: consumer first, AgencyOS second, data + embedded third." },
        ]
    }
];

function PhaseNav({ active, setActive }) {
    return (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {phases.map((p) => (
                <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    style={{
                        background: active === p.id ? `${p.color}20` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${active === p.id ? p.color + "50" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 8,
                        padding: "10px 16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                        minWidth: 180,
                    }}
                >
                    <div style={{ fontSize: 10, fontFamily: mono, color: active === p.id ? p.color : "#52525B", fontWeight: 700, letterSpacing: 1 }}>PHASE {p.num} · {p.timeline}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: active === p.id ? "#FAFAFA" : "#71717A", fontFamily: display, marginTop: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: active === p.id ? p.colorLight : "#3F3F46", fontFamily: body }}>{p.subtitle}</div>
                </button>
            ))}
        </div>
    );
}

function Section({ title, color, children, icon }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color, fontFamily: mono, fontWeight: 700 }}>{title}</div>
            </div>
            {children}
        </div>
    );
}

function Card({ children, accent = "rgba(255,255,255,0.06)" }) {
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}`, borderRadius: 10, padding: "16px 18px", marginBottom: 10 }}>
            {children}
        </div>
    );
}

function ChannelCard({ channel, color }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10, marginBottom: 8, overflow: "hidden", borderLeft: `3px solid ${color}` }}>
            <div onClick={() => setOpen(!open)} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA", fontFamily: body }}>{channel.name}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontFamily: mono, color: color, background: `${color}15`, padding: "2px 8px", borderRadius: 4 }}>{channel.type}</span>
                        <span style={{ fontSize: 10, fontFamily: mono, color: "#71717A" }}>Budget: {channel.budget}</span>
                        <span style={{ fontSize: 10, fontFamily: mono, color: "#71717A" }}>Est. CAC: {channel.expectedCAC}</span>
                    </div>
                </div>
                <div style={{ fontSize: 14, color: "#52525B", transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.15s" }}>+</div>
            </div>
            {open && (
                <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 12 }}>
                    <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body }}>{channel.tactic}</div>
                    <div style={{ marginTop: 10, background: `${color}10`, borderRadius: 6, padding: "6px 12px", fontSize: 11, color: color, fontFamily: mono }}>
                        🎯 Success metric: {channel.metric}
                    </div>
                </div>
            )}
        </div>
    );
}

function PhaseContent({ phase }) {
    const p = phase;
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview & ICP" },
        { id: "channels", label: "GTM Channels" },
        { id: "pricing", label: "Pricing & Revenue" },
        { id: "milestones", label: "Milestones" },
        { id: "risks", label: "Risks & Mitigation" },
    ];

    return (
        <div>
            {/* Phase header */}
            <div style={{ background: `linear-gradient(135deg, ${p.color}08, ${p.color}03)`, border: `1px solid ${p.color}20`, borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: mono, color: p.color, letterSpacing: 2, marginBottom: 4 }}>PHASE {p.num} OBJECTIVE</div>
                <div style={{ fontSize: 14, color: "#D4D4D8", lineHeight: 1.6, fontFamily: body }}>{p.goal}</div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 12 }}>
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                        background: activeTab === t.id ? `${p.color}15` : "transparent",
                        border: `1px solid ${activeTab === t.id ? p.color + "30" : "transparent"}`,
                        borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                        fontSize: 11.5, fontWeight: activeTab === t.id ? 600 : 400,
                        color: activeTab === t.id ? p.colorLight : "#71717A",
                        fontFamily: mono, transition: "all 0.15s"
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
                <div>
                    <Section title="Ideal Customer Profile" color={p.color} icon="🎯">
                        <Card accent={`${p.color}25`}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: p.colorLight, fontFamily: display, marginBottom: 4 }}>{p.icp.primary.name}</div>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                                <span style={{ fontSize: 10, fontFamily: mono, color: "#A1A1AA", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 4 }}>{p.icp.primary.size}</span>
                                {p.icp.primary.income && <span style={{ fontSize: 10, fontFamily: mono, color: "#A1A1AA", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 4 }}>{p.icp.primary.income}</span>}
                            </div>
                            <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body, marginBottom: 8 }}>{p.icp.primary.why}</div>
                            {p.icp.primary.demographics && <div style={{ fontSize: 11, color: "#71717A", fontFamily: mono }}>{p.icp.primary.demographics}</div>}
                        </Card>
                        <Card>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", fontFamily: display, marginBottom: 4 }}>Secondary: {p.icp.secondary.name}</div>
                            {p.icp.secondary.size && <div style={{ fontSize: 10, fontFamily: mono, color: "#71717A", marginBottom: 6 }}>{p.icp.secondary.size}</div>}
                            <div style={{ fontSize: 12, color: "#71717A", lineHeight: 1.5, fontFamily: body }}>{p.icp.secondary.why}</div>
                        </Card>
                        <div style={{ fontSize: 11.5, color: "#EF4444", fontFamily: mono, marginTop: 8, padding: "6px 12px", background: "rgba(239,68,68,0.06)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.15)" }}>
                            ⛔ Avoid: {p.icp.avoid}
                        </div>
                    </Section>

                    <Section title="Positioning & Messaging" color={p.color} icon="💬">
                        <div style={{ background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 10, padding: "18px 20px", marginBottom: 12 }}>
                            <div style={{ fontSize: 22, fontWeight: 400, color: "#FAFAFA", fontFamily: display, marginBottom: 6, fontStyle: "italic" }}>"{p.positioning.tagline}"</div>
                            <div style={{ fontSize: 13, color: "#A1A1AA", fontFamily: body, lineHeight: 1.6 }}>{p.positioning.oneLiner}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
                            {Object.entries(p.positioning.against).map(([k, v]) => (
                                <div key={k} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 14px" }}>
                                    <div style={{ fontSize: 11, fontFamily: mono, color: p.color, marginBottom: 4, fontWeight: 600 }}>{k}</div>
                                    <div style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.5, fontFamily: body }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}

            {activeTab === "channels" && (
                <Section title={`GTM Channels — ${p.channels.length} Active`} color={p.color} icon="📡">
                    {p.channels.map((ch, i) => <ChannelCard key={i} channel={ch} color={p.color} />)}
                </Section>
            )}

            {activeTab === "pricing" && (
                <Section title="Pricing & Revenue Model" color={p.color} icon="💰">
                    <Card accent={`${p.color}25`}>
                        <div style={{ fontSize: 11, fontFamily: mono, color: p.color, marginBottom: 8, fontWeight: 600 }}>MODEL: {p.pricing.model}</div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#D4D4D8", marginBottom: 2, fontFamily: body }}>Consumer Pricing</div>
                            <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body }}>{p.pricing.consumer}</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#D4D4D8", marginBottom: 2, fontFamily: body }}>Revenue Mechanics</div>
                            <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body }}>{p.pricing.revenue}</div>
                        </div>
                        <div style={{ background: `${p.color}10`, borderRadius: 6, padding: "8px 12px" }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: p.color, fontFamily: mono, marginBottom: 2 }}>WHY THIS MODEL</div>
                            <div style={{ fontSize: 12, color: p.colorLight, lineHeight: 1.5, fontFamily: body }}>{p.pricing.why}</div>
                        </div>
                    </Card>
                </Section>
            )}

            {activeTab === "milestones" && (
                <Section title="Monthly Milestones" color={p.color} icon="📅">
                    {p.milestones.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                            <div style={{ width: 70, flexShrink: 0, textAlign: "right", paddingTop: 4 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, fontFamily: mono }}>{m.month}</div>
                            </div>
                            <div style={{ width: 2, background: `${p.color}30`, borderRadius: 1, flexShrink: 0, position: "relative" }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color, position: "absolute", top: 6, left: -3 }} />
                            </div>
                            <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 14px" }}>
                                <div style={{ fontSize: 12.5, color: "#D4D4D8", lineHeight: 1.5, fontFamily: body }}>{m.target}</div>
                                <div style={{ fontSize: 10, color: p.color, fontFamily: mono, marginTop: 6, background: `${p.color}10`, padding: "3px 8px", borderRadius: 4, display: "inline-block" }}>KPI: {m.kpi}</div>
                            </div>
                        </div>
                    ))}
                </Section>
            )}

            {activeTab === "risks" && (
                <Section title="Risks & Mitigation" color={p.color} icon="⚠️">
                    {p.risks.map((r, i) => (
                        <Card key={i} accent="rgba(239,68,68,0.12)">
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#FCA5A5", fontFamily: body, marginBottom: 6 }}>🔴 {r.risk}</div>
                            <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body, paddingLeft: 12, borderLeft: `2px solid ${p.color}40` }}>{r.mitigation}</div>
                        </Card>
                    ))}
                </Section>
            )}
        </div>
    );
}

function SummaryView() {
    return (
        <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#A855F7", fontFamily: mono, marginBottom: 12 }}>18-Month Revenue Trajectory</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 24 }}>
                {[
                    { label: "Month 6", rev: "$0–15K MRR", users: "5K", bookings: "500", truth: "100", color: "#8B5CF6" },
                    { label: "Month 12", rev: "$25K MRR", users: "25K", bookings: "5K", truth: "5K", color: "#06B6D4" },
                    { label: "Month 18", rev: "$100K+ MRR", users: "100K", bookings: "100K", truth: "25K", color: "#10B981" },
                ].map((m, i) => (
                    <div key={i} style={{ background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontFamily: mono, color: m.color, fontWeight: 700, marginBottom: 8 }}>{m.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 400, color: "#FAFAFA", fontFamily: display }}>{m.rev}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
                            <div><div style={{ fontSize: 9, color: "#52525B", fontFamily: mono }}>USERS</div><div style={{ fontSize: 12, color: "#A1A1AA", fontFamily: mono }}>{m.users}</div></div>
                            <div><div style={{ fontSize: 9, color: "#52525B", fontFamily: mono }}>BOOKINGS</div><div style={{ fontSize: 12, color: "#A1A1AA", fontFamily: mono }}>{m.bookings}</div></div>
                            <div><div style={{ fontSize: 9, color: "#52525B", fontFamily: mono }}>TRUTH DATA</div><div style={{ fontSize: 12, color: "#A1A1AA", fontFamily: mono }}>{m.truth}</div></div>
                            <div><div style={{ fontSize: 9, color: "#52525B", fontFamily: mono }}>REVENUE</div><div style={{ fontSize: 12, color: "#A1A1AA", fontFamily: mono }}>4 streams</div></div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#F59E0B", fontFamily: mono, marginBottom: 12 }}>The GTM Thesis</div>

            {[
                { title: "Start niche, go wide", desc: "Digital nomads are a beachhead, not the market. They have the highest pain (WiFi ruins work weeks), highest frequency (6+ stays/year), highest sharing behavior (nomad communities), and lowest acquisition cost (concentrated in identifiable communities). Once you own this niche with Truth data, expanding to mainstream travelers is a matter of scaling content and channels — the data moat already exists." },
                { title: "Content IS the product", desc: "Every Truth Score generates unique content no competitor can create. 'Best Hotels in Lisbon for Remote Workers — Verified WiFi Speeds' is an article, a social post, an ad creative, AND a product feature — simultaneously. Your marketing and your product are the same thing. This is why the flywheel works: more data → more content → more users → more data." },
                { title: "B2B validates B2C", desc: "Agencies paying for Truth Score API proves your data has commercial value. This validates the consumer product's differentiation (if agencies pay for it, consumers prefer it). It also diversifies revenue so you're not 100% dependent on consumer bookings. And it creates a second distribution channel — agencies surface your data to THEIR customers." },
                { title: "Free for consumers, SaaS for businesses", desc: "Consumer free tier maximizes booking volume (which feeds the data flywheel). B2B SaaS monetizes the data asset at high margins. This dual model means you never have to choose between growth and revenue — consumers drive the flywheel, businesses monetize the output." },
            ].map((t, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA", fontFamily: display, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6, fontFamily: body }}>{t.desc}</div>
                </div>
            ))}
        </div>
    );
}

export default function App() {
    const [activePhase, setActivePhase] = useState("phase1");
    const [showSummary, setShowSummary] = useState(false);
    const currentPhase = phases.find(p => p.id === activePhase);

    return (
        <div style={{ minHeight: "100vh", background: "#0A0A0C", color: "#E4E4E7", fontFamily: body }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(160deg, #0A0A0C 0%, #1A0F24 30%, #0C1A20 60%, #0A0A0C 100%)", padding: "36px 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#A855F7", marginBottom: 8, fontFamily: mono }}>Go-to-Market Strategy · 18-Month Playbook</div>
                    <h1 style={{ fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "#FAFAFA", lineHeight: 1.2, fontFamily: display }}>
                        From <span style={{ color: "#8B5CF6" }}>Niche Beachhead</span> to <span style={{ color: "#10B981" }}>Platform Moat</span>
                    </h1>
                    <p style={{ fontSize: 13, color: "#71717A", maxWidth: 700, margin: "0 0 18px", lineHeight: 1.6 }}>
                        How to acquire your first 5,000 users from digital nomad communities, scale to 100K users with proprietary truth data, and build a $100K+ MRR platform with four revenue streams — all built on top of LiteAPI.
                    </p>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <PhaseNav active={activePhase} setActive={(id) => { setActivePhase(id); setShowSummary(false); }} />
                        <button onClick={() => setShowSummary(!showSummary)} style={{
                            background: showSummary ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${showSummary ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`,
                            borderRadius: 8, padding: "10px 16px", cursor: "pointer", minWidth: 120,
                        }}>
                            <div style={{ fontSize: 10, fontFamily: mono, color: showSummary ? "#F97316" : "#52525B", fontWeight: 700, letterSpacing: 1 }}>SUMMARY</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: showSummary ? "#FAFAFA" : "#71717A", fontFamily: display, marginTop: 2 }}>The Thesis</div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 60px" }}>
                {showSummary ? <SummaryView /> : <PhaseContent phase={currentPhase} />}
            </div>

            <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 10, color: "#1C1C1E", fontFamily: mono }}>
                3 phases · {phases.reduce((a, p) => a + p.channels.length, 0)} GTM channels · {phases.reduce((a, p) => a + p.milestones.length, 0)} milestones · Built on LiteAPI + Truth Engine
            </div>
        </div>
    );
}
