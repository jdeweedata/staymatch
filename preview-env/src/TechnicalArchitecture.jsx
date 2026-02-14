import { useState } from "react";

const sections = [
  { id: "flywheel", label: "Data Flywheel" },
  { id: "schema", label: "Truth Engine Schema" },
  { id: "collection", label: "Collection Pipeline" },
  { id: "switching", label: "6 Switching Cost Layers" },
  { id: "stack", label: "Technical Stack" },
  { id: "timeline", label: "Moat Deepening Timeline" },
];

const mono = "'Courier New', monospace";
const serif = "'Georgia', 'Times New Roman', serif";

function SectionHeader({ label, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#A855F7", fontFamily: mono, marginBottom: 6 }}>{label}</div>
      {desc && <p style={{ fontSize: 14, color: "#A1A1AA", margin: 0, lineHeight: 1.6 }}>{desc}</p>}
    </div>
  );
}

function Card({ title, children, accent = "#A855F7", icon }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 18px", marginBottom: 12, borderLeft: `3px solid ${accent}` }}>
      {title && <div style={{ fontSize: 14, fontWeight: 600, color: "#FAFAFA", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>{icon && <span>{icon}</span>}{title}</div>}
      {children}
    </div>
  );
}

function DataField({ name, type, example, why }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
        <code style={{ fontSize: 12, color: "#C084FC", fontFamily: mono }}>{name}</code>
        <span style={{ fontSize: 10, color: "#52525B", fontFamily: mono }}>{type}</span>
      </div>
      {example && <div style={{ fontSize: 11.5, color: "#71717A", marginTop: 2 }}>e.g. <code style={{ fontFamily: mono, color: "#A1A1AA" }}>{example}</code></div>}
      {why && <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 2, fontStyle: "italic" }}>{why}</div>}
    </div>
  );
}

function FlywheelSection() {
  return (
    <div>
      <SectionHeader label="The Core Data Flywheel" desc="Every component feeds the next. The system gets smarter with every booking, every stay, every review. Competitors can copy any single piece — but the compounding loop is the moat." />
      
      {/* Flywheel diagram */}
      <div style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { step: "1", title: "User Books via StayMatch", desc: "Preference-matched booking through LiteAPI. User's taste profile is input to the system.", color: "#8B5CF6", arrow: "↓ generates" },
            { step: "2", title: "Post-Stay Data Collection", desc: "Verified guest submits structured micro-data: WiFi speed, noise test, photo verification, accessibility measurements.", color: "#06B6D4", arrow: "↓ enriches" },
            { step: "3", title: "Truth Score Computed", desc: "ML pipeline aggregates multi-guest data into per-property Truth Score. Cross-validates against listing claims.", color: "#10B981", arrow: "↓ improves" },
            { step: "4", title: "AI Gets Smarter", desc: "Trip Architect uses Truth Scores + taste profiles to make better recommendations. Conversion rate rises.", color: "#F59E0B", arrow: "↓ attracts" },
            { step: "5", title: "More Users Book", desc: "Better recommendations → higher conversion → more bookings → more post-stay data → stronger Truth Scores.", color: "#EF4444", arrow: "↻ compounds" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 14, position: "relative" }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", fontFamily: mono, marginBottom: 8 }}>{s.step}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: "#A1A1AA", lineHeight: 1.5 }}>{s.desc}</div>
              <div style={{ fontSize: 10, color: s.color, fontFamily: mono, marginTop: 8, fontWeight: 600 }}>{s.arrow}</div>
            </div>
          ))}
        </div>
      </div>

      <Card title="Why This Flywheel Is Defensible" icon="🛡️">
        <div style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.65 }}>
          <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#D4D4D8" }}>Cold-start problem protects you.</strong> A competitor needs thousands of verified post-stay submissions before their Truth Scores are statistically meaningful. You need ~30 verified data points per property before the score is useful; across 50K properties that's 1.5M data points. At 10% contribution rate from bookings, that's 15M bookings through their platform first.</p>
          <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#D4D4D8" }}>Data gets more valuable with time.</strong> A single WiFi speed test is a data point. 500 tests across different times, floors, and seasons is a statistical model. Your data's value scales non-linearly — the 500th data point for a property is more valuable than the 1st because it creates temporal patterns nobody else can see.</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#D4D4D8" }}>Contributors are booking-verified.</strong> Unlike TripAdvisor reviews (anyone can write), your data comes exclusively from verified guests who booked through your platform. This makes the dataset impossible to fake or scrape — the provenance is embedded in the collection mechanism.</p>
        </div>
      </Card>
    </div>
  );
}

function SchemaSection() {
  const [activeTab, setActiveTab] = useState("stay");
  
  const schemas = {
    stay: {
      title: "Post-Stay Truth Data",
      desc: "The core proprietary dataset — structured measurements, not opinions",
      fields: [
        { name: "wifi_speed_down_mbps", type: "float", example: "47.3", why: "Actual Ookla-style speed test, not subjective rating" },
        { name: "wifi_speed_up_mbps", type: "float", example: "12.1", why: "Upload matters for remote workers (video calls)" },
        { name: "wifi_floor", type: "string", example: "3rd floor, room 312", why: "Speed varies by floor — this creates micro-data no one has" },
        { name: "wifi_time_of_test", type: "timestamp", example: "2026-02-14T22:15:00Z", why: "Peak vs off-peak patterns emerge over time" },
        { name: "noise_level_db", type: "float", example: "42.5", why: "Phone mic decibel reading — objective, comparable" },
        { name: "noise_time", type: "timestamp", example: "2026-02-14T23:30:00Z", why: "Late-night noise is the real concern" },
        { name: "noise_source", type: "enum", example: "street | hvac | neighbors | bar", why: "Actionable: 'street noise' helps light sleepers avoid specific rooms" },
        { name: "photo_verification[]", type: "image + metadata", example: "[lobby.jpg, room.jpg, view.jpg]", why: "Guest photos vs listing photos → reality gap scoring" },
        { name: "check_in_wait_minutes", type: "int", example: "12", why: "Operational truth that reviews rarely quantify" },
        { name: "hot_water_reliable", type: "boolean", example: "true", why: "Binary data point most reviews miss" },
        { name: "accessibility_score", type: "object", example: "{wheelchair: true, elevator: true, braille: false}", why: "Structured accessibility data barely exists anywhere" },
        { name: "mattress_firmness", type: "enum[1-5]", example: "3 (medium)", why: "Subjective but structured — aggregation reveals consensus" },
        { name: "power_outlets_bedside", type: "int", example: "2", why: "Digital nomad deciding factor; never in listing data" },
        { name: "blackout_curtains", type: "boolean", example: "true", why: "Sleep quality proxy that's verifiable" },
        { name: "actual_checkout_time", type: "string", example: "11:00 AM (strict)", why: "Listing says 12pm, reality is 11am" },
      ]
    },
    taste: {
      title: "Taste Profile Graph",
      desc: "Persistent preference model that makes every future recommendation better — the user's switching cost",
      fields: [
        { name: "aesthetic_vector", type: "float[128]", example: "[0.73, -0.21, ...]", why: "Embedding from swipe patterns on StayMatch (modern vs classic, minimal vs ornate)" },
        { name: "noise_tolerance", type: "float [0-1]", example: "0.2 (very sensitive)", why: "Derived from both explicit preference + post-stay feedback" },
        { name: "price_sensitivity_curve", type: "function", example: "willingness_to_pay(quality_score)", why: "Not just 'budget' — maps how much MORE they'll pay for better Truth Score" },
        { name: "location_preference", type: "enum[]", example: "[walkable, transit, quiet_neighborhood]", why: "Multi-label, not single choice — captures nuance" },
        { name: "travel_persona", type: "enum", example: "digital_nomad | family | romantic | adventure", why: "Changes per trip — system learns which persona is active from context" },
        { name: "deal_breakers", type: "string[]", example: "[no_elevator, shared_bathroom]", why: "Hard constraints that must never appear in recommendations" },
        { name: "delight_factors", type: "string[]", example: "[rooftop_bar, bathtub, gym]", why: "Soft preferences that boost match score" },
        { name: "stay_history[]", type: "object[]", example: "[{property_id, dates, rating, truth_contribution}]", why: "Every stay deepens the profile — more data = more lock-in" },
        { name: "group_profiles", type: "map<person, taste_vector>", example: "{partner: ..., kid_1: ...}", why: "Family/group preference merging is an enormous switching cost" },
        { name: "seasonal_patterns", type: "object", example: "{summer: beach, winter: city}", why: "Temporal preference learning — year 2 is smarter than year 1" },
      ]
    },
    truth: {
      title: "Property Truth Score",
      desc: "The aggregate output — your licensable, defensible data asset",
      fields: [
        { name: "truth_score_overall", type: "float [0-100]", example: "87.4", why: "Single composite score for quick comparison" },
        { name: "truth_confidence", type: "float [0-1]", example: "0.92", why: "Based on number of verified data points — transparent about reliability" },
        { name: "n_verified_stays", type: "int", example: "247", why: "More stays = higher confidence = more defensible" },
        { name: "listing_accuracy_gap", type: "float [-1, 1]", example: "-0.15", why: "Negative = listing overpromises. Unique metric nobody else has." },
        { name: "wifi_reliability_index", type: "float [0-1]", example: "0.88", why: "Not just speed but consistency across time/floors" },
        { name: "noise_profile", type: "object", example: "{day_avg: 38db, night_avg: 45db, weekend_spike: true}", why: "Temporal noise intelligence — no competitor has this" },
        { name: "photo_reality_score", type: "float [0-1]", example: "0.72", why: "CV model compares listing photos to guest photos. Low = misleading listing." },
        { name: "accessibility_verified", type: "boolean", example: "true", why: "Has been physically verified by a guest, not just hotel's claim" },
        { name: "best_for_personas", type: "enum[]", example: "[remote_worker, light_sleeper]", why: "Computed from which user personas rate this property highest" },
        { name: "trending_direction", type: "enum", example: "improving | stable | declining", why: "Recent data vs historical — catches renovations and deterioration" },
        { name: "last_verified", type: "timestamp", example: "2026-02-10T14:00:00Z", why: "Freshness indicator — stale data is flagged" },
      ]
    }
  };
  
  const active = schemas[activeTab];
  
  return (
    <div>
      <SectionHeader label="Truth Engine Data Schema" desc="Three interconnected datasets that form your proprietary data asset. Each one is defensible on its own; together they create a system no competitor can replicate." />
      
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(schemas).map(([key, s]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            background: activeTab === key ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${activeTab === key ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 6, padding: "8px 14px", cursor: "pointer", textAlign: "left"
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: activeTab === key ? "#C084FC" : "#A1A1AA" }}>{s.title}</div>
          </button>
        ))}
      </div>
      
      <Card title={active.title} accent={activeTab === "stay" ? "#06B6D4" : activeTab === "taste" ? "#F59E0B" : "#10B981"}>
        <div style={{ fontSize: 12, color: "#71717A", marginBottom: 12, fontStyle: "italic" }}>{active.desc}</div>
        {active.fields.map((f, i) => <DataField key={i} {...f} />)}
      </Card>
      
      <Card title="Why 3 Datasets, Not 1" icon="🔗" accent="#8B5CF6">
        <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#C084FC" }}>Post-Stay Truth Data</strong> is the raw material — defensible because it's booking-verified and physically measured.</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#F59E0B" }}>Taste Profiles</strong> are the switching cost — each user's profile gets better over time and can't be exported to a competitor.</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#10B981" }}>Truth Scores</strong> are the monetizable output — licensable to agencies, embeddable in partner apps, and the basis for your AI's intelligence advantage.</p>
        </div>
      </Card>
    </div>
  );
}

function CollectionSection() {
  return (
    <div>
      <SectionHeader label="Data Collection Pipeline" desc="The cold-start problem is the #1 risk. This pipeline solves it by making data contribution frictionless, incentivized, and embedded in the natural post-booking flow." />
      
      {/* Collection flow */}
      {[
        { phase: "T+0: Booking Confirmed", color: "#8B5CF6", steps: [
          { title: "Pre-seed the profile", desc: "On first booking, collect 5 quick swipe preferences (quiet/social, modern/classic, walkable/remote, budget/splurge, adventurous/familiar). This initializes the taste vector. Takes <30 seconds." },
          { title: "Set post-stay expectation", desc: "Tell the user: 'After your stay, share 2 minutes of data and unlock your Truth Badge + a discount on your next booking.' Frame it as joining a community, not doing a survey." },
        ]},
        { phase: "T+1 day: Post-Stay Collection", color: "#06B6D4", steps: [
          { title: "Smart push notification", desc: "Triggered 24h after checkout (not during stay — you want reflective, not in-the-moment data). 'How was the Marriott Lisbon? Help future travelers with a quick Truth Check.'" },
          { title: "60-second micro-survey (not a form)", desc: "Conversational UI, not a grid of checkboxes. 5–7 quick taps: WiFi (run built-in speed test), noise (record 10 seconds of ambient audio from phone mic), 3 photos (room, view, bathroom — with prompt), 2–3 binary Qs (hot water? blackout curtains? elevator access?). This is the core defensible data." },
          { title: "Optional depth layer", desc: "For power contributors: detailed accessibility audit, mattress firmness, outlet count, check-in time logging. Gamified with contributor levels." },
        ]},
        { phase: "T+7 days: Enrichment", color: "#10B981", steps: [
          { title: "Computer vision pipeline", desc: "Guest photos are run through a CV model that: (a) extracts room features automatically (window size, furniture quality, bathroom type), (b) compares to listing photos to compute photo_reality_score, (c) detects accessibility features (grab bars, ramp access). This turns unstructured photos into structured data." },
          { title: "Cross-validation engine", desc: "New submission is compared against previous guests' data for the same property. Outlier detection flags suspicious contributions (e.g., someone claims 200Mbps WiFi when all others measured 15Mbps). Consensus data is weighted higher." },
          { title: "Truth Score recomputation", desc: "Bayesian update of the property's Truth Score incorporating new data. Score confidence increases with each verified contribution. Properties with <5 contributions show 'Unverified' badge." },
        ]},
        { phase: "Ongoing: Decay + Refresh", color: "#F59E0B", steps: [
          { title: "Temporal decay function", desc: "Data older than 18 months is exponentially downweighted. A 2024 WiFi test matters less than a 2026 one. This catches renovations and deterioration that static reviews miss." },
          { title: "Refresh incentives", desc: "If a property's last verified data is >6 months old, users booking that property get a bonus incentive to contribute. Creates a self-healing data freshness loop." },
          { title: "Anomaly detection for property changes", desc: "If new data diverges significantly from historical baseline (e.g., WiFi jumps from 15 to 85 Mbps), flag for likely renovation. Update Truth Score trajectory to 'improving.'" },
        ]},
      ].map((phase, pi) => (
        <div key={pi} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: phase.color, fontFamily: mono, letterSpacing: 1, marginBottom: 8 }}>{phase.phase}</div>
          {phase.steps.map((s, si) => (
            <div key={si} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 14px", marginBottom: 8, marginLeft: 16, borderLeft: `2px solid ${phase.color}30` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#D4D4D8", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      ))}
      
      <Card title="Contribution Economics" icon="💰" accent="#F59E0B">
        <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#D4D4D8" }}>Target contribution rate:</strong> 15–25% of completed stays. Industry benchmarks: Airbnb reviews ~65%, Booking.com reviews ~35%, but those are text opinions. Structured data collection (with speed test + audio + photos) is harder — 15% is realistic, 25% is excellent.</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#D4D4D8" }}>Incentive stack:</strong> (1) 5% discount on next booking for any contribution, (2) Truth Badge on profile (status), (3) Contributor leaderboard (gamification), (4) Priority access to new features (exclusivity), (5) Annual 'Truth Pioneer' rewards for top 1% contributors.</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#D4D4D8" }}>Cost of acquisition per data point:</strong> If the 5% discount costs ~$4 average, and each contribution produces ~8 structured data fields, your cost per unique data point is ~$0.50. At scale, this dataset is worth $10–50 per data point to B2B licensees (agencies, property managers, hotel chains wanting competitive intelligence).</p>
        </div>
      </Card>
    </div>
  );
}

function SwitchingSection() {
  const [openLayer, setOpenLayer] = useState(0);
  
  const layers = [
    {
      num: "01",
      title: "Taste Profile Depth",
      type: "User → Consumer lock-in",
      color: "#8B5CF6",
      timeToReplicate: "12–24 months of usage",
      desc: "Every booking, every swipe, every post-stay rating deepens the user's taste profile. After 5+ stays, the system knows their noise tolerance, aesthetic preference, WiFi needs, and price-quality tradeoff curve better than they could articulate themselves.",
      mechanisms: [
        "Preference vectors trained on 50+ implicit signals per session (swipe speed, dwell time, zoom patterns on photos, not just yes/no)",
        "Group taste merging — once a family or couple's merged preference model exists, starting over on another platform means re-teaching it about every member",
        "Seasonal pattern learning: by year 2, the system anticipates 'you usually want a beach in August and a city in December'",
        "Negative preference memory: remembers what you hated and permanently excludes it — competitors would surface those properties again",
      ],
      metric: "Switching cost increases ~18% per completed booking cycle (book → stay → review → re-book)"
    },
    {
      num: "02",
      title: "Truth Score Exclusivity",
      type: "Data → Platform lock-in",
      color: "#06B6D4",
      timeToReplicate: "3–5 years of data collection",
      desc: "Users who rely on Truth Scores to make booking decisions can't get equivalent data anywhere else. Booking.com has opinions (8.2/10 WiFi). You have measurements (47Mbps avg, 12Mbps at peak, free on floors 1–5, paid on 6+). Once a user trusts Truth Scores, every other platform's data feels incomplete.",
      mechanisms: [
        "Truth Scores are visible pre-booking — users learn to filter by them and can't un-learn this behavior",
        "Comparative Truth Alerts: 'This hotel claims 'high-speed WiFi' but our Truth Score shows 8Mbps average' — creates trust dependency",
        "Property-level data is not available anywhere else — no scraping, no API, no workaround for competitors",
        "Proprietary accessibility data is uniquely valuable and impossible to crowdsource without booking-verified flow",
      ],
      metric: "Users who filter by Truth Score show 3.2x higher repeat booking rate (projected)"
    },
    {
      num: "03",
      title: "Contributor Identity & Status",
      type: "Community → Social lock-in",
      color: "#10B981",
      timeToReplicate: "Cannot be replicated",
      desc: "Power contributors build a reputation on your platform — Truth Pioneer badges, accuracy scores, contribution history. This is their 'travel credibility' portfolio. Like Stack Overflow reputation or Yelp Elite status, it's non-portable.",
      mechanisms: [
        "Contributor accuracy rating (how often their data matches consensus) — takes 20+ contributions to build",
        "Truth Pioneer program with real perks (early access, free upgrades via hotel partnerships, annual recognition)",
        "Contribution history as a social proof asset ('247 properties verified across 18 countries')",
        "Community trust graph: contributors who verify each other's data create a social network effect",
      ],
      metric: "Top 5% contributors generate ~40% of all verified data points — losing them would be catastrophic"
    },
    {
      num: "04",
      title: "B2B API Integration Depth",
      type: "Agencies → Enterprise lock-in",
      color: "#F59E0B",
      timeToReplicate: "6–12 months per integration",
      desc: "Travel agencies and partner apps that integrate your Truth Score API build their own products on top of your data. Their UIs display your scores, their search filters use your data, their client recommendations depend on your intelligence. Switching means rebuilding their product.",
      mechanisms: [
        "Agencies embed Truth Score widgets in their client-facing tools — switching means redesigning their UX",
        "Custom API endpoints with agency-specific scoring weights (e.g., a luxury agency weights amenity truth higher than WiFi)",
        "Historical comparison data: 'this property's Truth Score has improved 12 points since renovation' — only available through your API",
        "Webhook integrations for real-time alerts ('a property you sell dropped below your quality threshold')",
      ],
      metric: "B2B customers using 3+ API endpoints show <5% annual churn (SaaS benchmark for deep integrations)"
    },
    {
      num: "05",
      title: "Booking History Intelligence",
      type: "Data accumulation → Behavioral lock-in",
      color: "#EF4444",
      timeToReplicate: "Equal to user's entire travel history",
      desc: "Every completed booking adds to a user's travel graph — where they've been, what they loved, what they avoided, how their preferences changed over time. This isn't just a list of past bookings; it's a behavioral model that predicts future needs.",
      mechanisms: [
        "Price-quality preference curve: after 8+ bookings, the system knows exactly where your value/quality tradeoff sits",
        "'You stayed at properties like X and rated them highly' → collaborative filtering with your actual verified experiences, not generic user cohorts",
        "Trip pattern intelligence: system detects 'you book 3 months in advance for international trips, 2 weeks for domestic' and adjusts proactive suggestions",
        "Post-stay data you contributed is linked to your profile — your Truth contributions are part of your travel identity",
      ],
      metric: "Users with 10+ bookings convert at 4.7x the rate of new users (projected, based on Booking.com's Genius program data)"
    },
    {
      num: "06",
      title: "Network Effects (Truth Density)",
      type: "Coverage → Market lock-in",
      color: "#D946EF",
      timeToReplicate: "Requires equivalent market share",
      desc: "As Truth Score coverage approaches critical mass in a city or region, the platform becomes the default decision tool for that area. 'Check the Truth Score before booking' becomes habitual. This is the Waze effect applied to hotels — network density IS the product.",
      mechanisms: [
        "City-level Truth density thresholds: once 60%+ of hotels in a city have verified Truth Scores, the data becomes the industry standard for that market",
        "Cross-referencing between properties: 'Hotel A has better WiFi but Hotel B is quieter' comparisons only work with sufficient coverage",
        "Hotel response incentives: once a critical mass of Truth data exists, hotels are incentivized to improve and re-verify — creating a quality improvement feedback loop",
        "Regional data partnerships: tourism boards, DMOs use your data as the quality standard for their destination — institutional endorsement",
      ],
      metric: "Target: 10 'Truth Dense' cities in year 2 (>60% property coverage each)"
    },
  ];
  
  return (
    <div>
      <SectionHeader label="6 Switching Cost Layers" desc="Each layer creates a different type of lock-in. Individually they're useful. Stacked together, they make leaving irrational — not because it's punitive, but because the value is impossible to recreate elsewhere. 'Golden handcuffs,' not prison walls." />
      
      {layers.map((l, i) => {
        const isOpen = openLayer === i;
        return (
          <div key={i} style={{ background: isOpen ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)", border: `1px solid ${isOpen ? l.color + "40" : "rgba(255,255,255,0.05)"}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", transition: "all 0.2s" }}>
            <div onClick={() => setOpenLayer(isOpen ? -1 : i)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: l.color, fontFamily: mono, opacity: 0.5, width: 30 }}>{l.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FAFAFA" }}>{l.title}</div>
                <div style={{ fontSize: 11, color: "#71717A", fontFamily: mono }}>{l.type}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: "#52525B", fontFamily: mono }}>Time to replicate</div>
                <div style={{ fontSize: 11, color: l.color, fontFamily: mono, fontWeight: 600 }}>{l.timeToReplicate}</div>
              </div>
              <div style={{ fontSize: 16, color: "#52525B", transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</div>
            </div>
            
            {isOpen && (
              <div style={{ padding: "0 18px 16px", borderTop: `1px solid rgba(255,255,255,0.04)`, paddingTop: 14 }}>
                <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 14px" }}>{l.desc}</p>
                
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: l.color, marginBottom: 8, fontFamily: mono }}>How It Locks In</div>
                {l.mechanisms.map((m, mi) => (
                  <div key={mi} style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.5, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${l.color}25` }}>{m}</div>
                ))}
                
                <div style={{ marginTop: 12, background: `${l.color}10`, borderRadius: 6, padding: "8px 12px", fontSize: 11.5, color: l.color, fontFamily: mono }}>
                  📊 {l.metric}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StackSection() {
  return (
    <div>
      <SectionHeader label="Recommended Technical Stack" desc="Optimized for speed to market, data pipeline robustness, and the ability to evolve from consumer app to B2B data platform." />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 12 }}>
        {[
          { title: "Frontend (StayMatch)", color: "#8B5CF6", items: [
            { name: "React Native / Expo", why: "Single codebase for iOS + Android + Web. StayMatch's swipe UX needs native gesture performance." },
            { name: "Framer Motion / Reanimated", why: "Swipe animations are the product — 60fps feels premium, 30fps feels broken." },
            { name: "TanStack Query", why: "Optimistic updates for swipe patterns; prefetch next 10 properties while user decides on current." },
          ]},
          { title: "Backend API Layer", color: "#06B6D4", items: [
            { name: "Node.js (Fastify) or Go", why: "LiteAPI integration is HTTP/JSON — Node is natural fit. Go if you need lower latency for real-time scoring." },
            { name: "GraphQL (Hasura or Apollo)", why: "Taste profiles + Truth Scores + LiteAPI inventory = complex data graph. GraphQL avoids over-fetching." },
            { name: "Redis + Bull queues", why: "Cache Truth Scores (they update daily, not per-request). Queue post-stay collection triggers." },
          ]},
          { title: "Truth Engine Data Pipeline", color: "#10B981", items: [
            { name: "PostgreSQL + TimescaleDB", why: "Core relational store for structured truth data. TimescaleDB extension for time-series data (WiFi speed over time, noise patterns)." },
            { name: "Apache Kafka / Redpanda", why: "Event streaming for real-time data ingestion. Every swipe, every booking, every contribution is an event." },
            { name: "dbt + Airflow", why: "Transform raw submissions into Truth Scores on a daily batch schedule. Bayesian update models run here." },
          ]},
          { title: "AI / ML Layer", color: "#F59E0B", items: [
            { name: "Embedding models (OpenAI / Cohere)", why: "Generate taste vectors from swipe patterns. Property embeddings from Truth data for semantic matching." },
            { name: "PyTorch (fine-tuned)", why: "Photo reality scoring model: compare listing images to guest-submitted images. Transfer learning from pre-trained vision models." },
            { name: "LLM orchestration (LangChain / custom)", why: "Trip Architect uses RAG over your Truth Score database. Your proprietary data is the context window advantage." },
          ]},
          { title: "Data Collection SDK", color: "#EF4444", items: [
            { name: "Custom speed test (WebRTC-based)", why: "In-app WiFi speed test — no dependency on Ookla. Runs from device, results are property-verified." },
            { name: "Audio analysis (TensorFlow Lite)", why: "On-device noise level measurement from phone mic. dB reading + ambient noise classification (traffic/HVAC/voices)." },
            { name: "Photo pipeline (EXIF + GPS + CV)", why: "EXIF metadata verifies photo was taken at the property. GPS cross-references with booking location. CV extracts room features." },
          ]},
          { title: "B2B API & Licensing", color: "#D946EF", items: [
            { name: "REST API + API gateway (Kong/AWS)", why: "Rate-limited, key-authenticated API for agencies to query Truth Scores. Tiered access by subscription level." },
            { name: "Webhook system", why: "Real-time alerts for agencies: 'A property you sell dropped below 70 Truth Score.' Embeds your data into their workflow." },
            { name: "Embeddable widget (React/Web Component)", why: "Agencies drop a <truth-score> widget into their site. 1 line of code = permanent integration dependency." },
          ]},
        ].map((section, si) => (
          <div key={si} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 16, borderTop: `3px solid ${section.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA", marginBottom: 12 }}>{section.title}</div>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ marginBottom: ii < section.items.length - 1 ? 10 : 0 }}>
                <code style={{ fontSize: 12, color: section.color, fontFamily: mono }}>{item.name}</code>
                <div style={{ fontSize: 11.5, color: "#71717A", marginTop: 2, lineHeight: 1.5 }}>{item.why}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <Card title="Architecture Principle: Data Gravity" icon="⚛️" accent="#A855F7">
        <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6 }}>
          Every architectural decision should increase data gravity — the tendency for data, applications, and services to accumulate around the largest dataset. Your Truth Engine database becomes the center of gravity. The consumer app generates data into it. The AI reads from it. The B2B API licenses from it. Partner widgets display from it. The more services that orbit the dataset, the harder it is for anyone to move any single piece away.
        </div>
      </Card>
    </div>
  );
}

function TimelineSection() {
  const milestones = [
    {
      phase: "Months 0–3",
      title: "Foundation Sprint",
      color: "#8B5CF6",
      targets: [
        "Ship StayMatch MVP with 5-preference swipe onboarding + LiteAPI booking",
        "Build post-stay collection flow (WiFi speed test + 3 photo prompts + 5 binary Qs)",
        "PostgreSQL + TimescaleDB schema deployed for truth data",
        "Basic taste vector computation from swipe patterns",
        "Target: 500 bookings, 75 truth contributions (15% contribution rate)",
      ],
      moatDepth: "Shallow — data exists but not yet defensible",
    },
    {
      phase: "Months 3–6",
      title: "Data Density Push",
      color: "#06B6D4",
      targets: [
        "CV pipeline for photo reality scoring goes live",
        "Noise analysis module deployed (on-device audio classification)",
        "Truth Score v1 computed for first 200+ properties (focus on 2–3 cities)",
        "Taste profile persistence: returning users see improved recommendations",
        "Contribution incentive program launched (5% discount + badge system)",
        "Target: 5K bookings, 1K truth contributions, 200 properties scored",
      ],
      moatDepth: "Forming — early data advantage in focus cities",
    },
    {
      phase: "Months 6–12",
      title: "Flywheel Activation",
      color: "#10B981",
      targets: [
        "AI Trip Architect MVP powered by Truth Score data (conversational booking with exclusive intelligence)",
        "Truth Score API v1 opens to 5 beta agency partners",
        "Embeddable <truth-score> widget available for partner sites",
        "Group taste merging for couples/families",
        "First 'Truth Dense' city achieved (>60% coverage in 1 target city)",
        "Target: 25K bookings, 5K truth contributions, 2K properties scored",
      ],
      moatDepth: "Defensible — proprietary data others would need 12+ months to replicate",
    },
    {
      phase: "Months 12–18",
      title: "Moat Hardening",
      color: "#F59E0B",
      targets: [
        "Truth Score API licensed to 50+ agencies (B2B revenue stream activated)",
        "Contributor reputation system with Truth Pioneer program",
        "10 Truth Dense cities (US + EU focus)",
        "Seasonal pattern learning deployed (year-over-year taste intelligence)",
        "Hotel-facing dashboard: properties see their Truth Score and can verify improvements",
        "Target: 100K bookings, 25K truth contributions, 15K properties scored",
      ],
      moatDepth: "Strong — switching cost stack is 4+ layers deep for both consumers and B2B customers",
    },
    {
      phase: "Months 18–24",
      title: "Platform Moat",
      color: "#EF4444",
      targets: [
        "Truth Score becomes industry-referenced standard in focus markets ('Check the Truth Score')",
        "Tourism boards and DMOs use Truth data as quality benchmarking",
        "Invisible Booking Layer (embeddable AI widget) launched for non-travel apps",
        "Emerging market expansion with localized collection (LATAM, MENA first)",
        "Fine-tuned LLM on proprietary truth data — AI that literally knows things no other AI knows",
        "Target: 500K+ bookings, 100K+ truth contributions, 50K+ properties scored",
      ],
      moatDepth: "Deep — 3–5 year replication time for any competitor starting from zero",
    },
  ];
  
  return (
    <div>
      <SectionHeader label="Moat Deepening Timeline" desc="Data moats compound non-linearly. The first 6 months feel slow. By month 18, you have data that money can't buy. The key metric is not revenue — it's verified truth data points per property." />
      
      {milestones.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 80, flexShrink: 0, textAlign: "right", paddingTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.color, fontFamily: mono }}>{m.phase}</div>
          </div>
          <div style={{ width: 2, background: `linear-gradient(to bottom, ${m.color}, ${m.color}30)`, borderRadius: 1, flexShrink: 0, position: "relative" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: m.color, position: "absolute", top: 6, left: -4 }} />
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#FAFAFA", marginBottom: 4 }}>{m.title}</div>
            <div style={{ marginBottom: 10 }}>
              {m.targets.map((t, ti) => (
                <div key={ti} style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.5, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${m.color}20` }}>{t}</div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: mono, background: `${m.color}10`, padding: "6px 10px", borderRadius: 4, display: "inline-block" }}>
              Moat depth: {m.moatDepth}
            </div>
          </div>
        </div>
      ))}
      
      <Card title="The Compounding Math" icon="📈" accent="#A855F7">
        <div style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 8px" }}>At month 24, a competitor who starts from zero would need to: (1) acquire 500K bookings through their platform, (2) convince 15–25% of those guests to complete structured data collection, (3) process 100K+ truth contributions through CV and audio analysis pipelines, (4) build 2 years of temporal data for seasonal patterns, (5) achieve statistical confidence across 50K+ properties, and (6) convince B2B customers to re-integrate away from your API.</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#D4D4D8" }}>Estimated replication cost for a well-funded competitor: $50M+ and 3–5 years.</strong> Google or Booking.com could theoretically do it, but they'd need to fundamentally change their review collection flow for hundreds of millions of existing users — a product decision with enormous organizational inertia.</p>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("flywheel");

  const renderSection = () => {
    switch (activeSection) {
      case "flywheel": return <FlywheelSection />;
      case "schema": return <SchemaSection />;
      case "collection": return <CollectionSection />;
      case "switching": return <SwitchingSection />;
      case "stack": return <StackSection />;
      case "timeline": return <TimelineSection />;
      default: return <FlywheelSection />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090B", color: "#E4E4E7", fontFamily: serif }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #09090B 0%, #1C1226 35%, #0F1A2E 65%, #09090B 100%)", padding: "40px 28px 28px", borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#A855F7", marginBottom: 10, fontFamily: mono }}>Technical Architecture · Data Moat Strategy</div>
          <h1 style={{ fontSize: 30, fontWeight: 400, margin: "0 0 10px", color: "#FAFAFA", lineHeight: 1.2 }}>
            How to Build a <span style={{ color: "#A855F7" }}>3–5 Year Data Moat</span> That Money Can't Buy
          </h1>
          <p style={{ fontSize: 14, color: "#71717A", maxWidth: 700, margin: 0, lineHeight: 1.6 }}>
            The architecture for turning every booking into a proprietary data point, every stay into a switching cost, and every contribution into a competitive advantage that compounds faster than any competitor can replicate.
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 28px 0", display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 16 }}>
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            background: activeSection === s.id ? "rgba(168,85,247,0.15)" : "transparent",
            border: `1px solid ${activeSection === s.id ? "rgba(168,85,247,0.3)" : "transparent"}`,
            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
            fontSize: 12, fontWeight: activeSection === s.id ? 600 : 400,
            color: activeSection === s.id ? "#C084FC" : "#71717A",
            fontFamily: mono, transition: "all 0.15s"
          }}>
            {s.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 28px 60px" }}>
        {renderSection()}
      </div>
      
      <div style={{ textAlign: "center", padding: "0 28px 24px", fontSize: 10, color: "#27272A", fontFamily: mono }}>
        6 architecture layers · 3 proprietary datasets · 6 switching cost mechanisms · Built on LiteAPI
      </div>
    </div>
  );
}
