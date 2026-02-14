import { useState } from "react";

const ideas = [
  {
    id: 1,
    title: "The Local Truth Engine",
    tagline: "Proprietary data moat from real travelers, not scraped reviews",
    ocean: "Purple Ocean",
    audience: ["End Consumers", "Small Agencies"],
    moats: ["Proprietary Data", "Network Effects"],
    effort: "Medium",
    revenue: "High",
    summary:
      "Build a platform where verified, post-stay travelers contribute hyper-specific accommodation intelligence — not reviews, but structured data: real WiFi speeds tested, actual noise levels, precise walking distances, photo comparisons of listing vs reality, accessibility measurements. This creates a proprietary dataset no OTA has.",
    howItWorks: [
      "Users book via LiteAPI and after checkout, get prompted to submit structured micro-data (WiFi speed test, noise level rating, photo verification)",
      "AI aggregates this into a 'Truth Score' per property — a reliability index that goes far beyond star ratings",
      "Travelers search and filter by things nobody else offers: 'hotels with verified 50Mbps+ WiFi within 10 min walk of X'",
      "Small agencies white-label the Truth Score data to differentiate their offerings",
    ],
    whyPurple:
      "TripAdvisor has reviews. Booking.com has ratings. Nobody has structured, verified, machine-readable accommodation truth data. This is defensible because the dataset compounds — every booking adds signal. Competitors would need years to replicate.",
    underserved:
      "Digital nomads, remote workers, accessibility travelers, and parents with specific needs (cribs, allergen-free rooms) — all poorly served by generic star ratings.",
    revenueModel:
      "Commission on bookings (LiteAPI), premium data access for agencies, API licensing of Truth Score data to other platforms.",
  },
  {
    id: 2,
    title: "AI Trip Architect",
    tagline: "From intent to booked itinerary in one conversation",
    ocean: "Purple Ocean",
    audience: ["End Consumers"],
    moats: ["AI UX", "Proprietary Data"],
    effort: "High",
    revenue: "Very High",
    summary:
      "An AI agent that doesn't just suggest hotels — it builds complete stay strategies. Tell it 'I'm attending a wedding in Tuscany in June, budget €2k, I want 3 nights before to explore and need good WiFi for work' and it architects the full plan, with bookable rooms via LiteAPI, not just links.",
    howItWorks: [
      "Conversational AI understands complex, multi-constraint travel intent",
      "Pulls real-time rates from LiteAPI's 2M+ properties, cross-references with your Truth Engine data",
      "Presents 2-3 complete stay strategies (not 50 hotel options) with reasoning: 'Option A optimizes for location, Option B saves €400 by splitting between two towns'",
      "One-click booking of the entire plan — no decision fatigue",
      "Post-trip learning: the system remembers preferences and gets smarter",
    ],
    whyPurple:
      "Current AI travel tools (ChatGPT, Google) suggest but don't transact. OTAs transact but don't understand complex intent. This closes the gap. The 40% of travelers using AI for planning but NOT booking is your conversion goldmine.",
    underserved:
      "Multi-destination travelers, event-based travelers (weddings, conferences, festivals), bleisure travelers who mix work and leisure constraints.",
    revenueModel:
      "Commission per booking, premium subscription for power travelers (unlimited replanning, priority support), B2B API for agencies to embed the architect.",
  },
  {
    id: 3,
    title: "AgencyOS",
    tagline: "Turn any small travel agency into an AI-powered competitor overnight",
    ocean: "Blue-Purple",
    audience: ["Small Agencies"],
    moats: ["Network Effects", "AI UX"],
    effort: "Medium-High",
    revenue: "High",
    summary:
      "A white-label SaaS platform for small/niche travel agencies that bundles LiteAPI's inventory with AI-powered client management, dynamic pricing intelligence, and automated itinerary building. Think 'Shopify for travel agencies' — they get a branded booking site, CRM, and AI concierge in one package.",
    howItWorks: [
      "Agency signs up → gets a branded booking portal powered by LiteAPI inventory",
      "Built-in AI concierge handles client inquiries, suggests properties, builds quotes automatically",
      "Dynamic margin optimizer: AI suggests markups based on demand, client history, and competitor pricing",
      "Client loyalty system with vouchers and cashback (built on LiteAPI's guest/loyalty features)",
      "Analytics dashboard showing booking trends, popular destinations, revenue forecasts",
    ],
    whyPurple:
      "Small agencies are caught between OTA giants and their own lack of tech. Existing travel agent tools are legacy CRMs from the 2000s. Nobody gives them modern, AI-native tools with direct booking infrastructure built in. 85% of agencies lack AI infrastructure.",
    underserved:
      "5,000+ small/independent travel agencies globally that specialize in niches (honeymoons, adventure travel, religious pilgrimages, diaspora travel) but lack technology.",
    revenueModel:
      "Monthly SaaS subscription (tiered), percentage of booking commissions, premium AI features upsell, data insights packages.",
  },
  {
    id: 4,
    title: "StayMatch",
    tagline: "Tinder for accommodation — swipe-based AI matching, not search",
    ocean: "Purple Ocean",
    audience: ["End Consumers"],
    moats: ["AI UX", "Proprietary Data"],
    effort: "Medium",
    revenue: "Medium-High",
    summary:
      "Kill the search box entirely. Instead of searching 'hotels in Barcelona,' users answer 5 quick preference questions or swipe through visual cards. The AI learns their taste profile across multiple dimensions (aesthetic, practical, budget) and serves increasingly perfect matches. The more you use it, the better it gets.",
    howItWorks: [
      "Onboarding: swipe through 10-15 hotel images/scenarios to build initial taste profile",
      "AI generates a multi-dimensional preference vector: aesthetic style, noise tolerance, social vs private, urban vs nature, etc.",
      "For each trip, present 3-5 curated matches (not 500 results) with AI-generated 'why this fits you' explanations",
      "Post-stay feedback refines the model — builds a proprietary preference graph per user",
      "Social layer: 'People with your taste loved…' recommendations",
    ],
    whyPurple:
      "Every platform assumes travelers know what they want and can express it in search terms. Most don't. They know a vibe, a feeling, a 'something like that place we stayed in Porto.' Preference-based matching is proven in dating/music/social but hasn't been properly applied to accommodation.",
    underserved:
      "Gen Z and younger millennials (who discover via vibes, not search), repeat travelers bored of the same search results, couples/groups where preferences need to be merged.",
    revenueModel:
      "Freemium (limited matches free, unlimited with subscription), commission on bookings, premium 'Taste Report' exports for agencies.",
  },
  {
    id: 5,
    title: "Invisible Booking Layer (B2B2C)",
    tagline: "Let any app become a travel app with zero effort",
    ocean: "Blue Ocean",
    audience: ["Underserved: Non-Travel Apps"],
    moats: ["Network Effects", "AI UX"],
    effort: "Medium",
    revenue: "Very High",
    summary:
      "Package LiteAPI into an embeddable AI widget that any non-travel app can drop into their product. A fitness app could offer 'book a hotel near your marathon.' A concert ticketing app could offer stays near venues. A wedding planning app could handle guest accommodation. The booking happens inside their app, you power it invisibly.",
    howItWorks: [
      "SDK/widget that any app embeds in <10 lines of code",
      "Context-aware: pulls event dates, locations, user preferences from the host app",
      "AI generates relevant accommodation suggestions within the host app's UX",
      "Revenue share: host app earns commission, you earn commission, LiteAPI earns commission",
      "Dashboard for partner apps to track bookings, revenue, and user engagement",
    ],
    whyPurple:
      "LiteAPI already has the low-code widget concept, but this is a distribution strategy, not just a feature. You become the 'Stripe of travel' — invisible infrastructure that powers bookings everywhere. The more apps embed you, the more data you have, the better the AI gets.",
    underserved:
      "Event platforms (Eventbrite, Meetup), fitness/marathon apps, wedding platforms, conference tools, relocation services, university apps for campus visits — millions of contextual booking moments that current travel platforms miss entirely.",
    revenueModel:
      "Revenue share per booking, monthly platform fee for high-volume partners, premium AI customization.",
  },
  {
    id: 6,
    title: "Emerging Markets First",
    tagline: "Build for the next billion travelers, not the saturated Western market",
    ocean: "Blue Ocean",
    audience: ["End Consumers", "Small Agencies"],
    moats: ["Proprietary Data", "Network Effects"],
    effort: "High",
    revenue: "Very High (long-term)",
    summary:
      "Most travel platforms are built for Western travelers booking Western hotels. But 80% of travel growth is coming from LATAM, MENA, Africa, and Southeast Asia. Build a platform specifically for emerging market travelers: local payment methods (M-Pesa, PIX, UPI), vernacular language AI, cultural travel norms (group bookings, family rooms, halal-friendly filters), and local inventory that global OTAs ignore.",
    howItWorks: [
      "LiteAPI's 2M properties as the global backbone, supplemented with local inventory partnerships",
      "AI concierge in 20+ languages with cultural context (not just translation — understanding of travel norms)",
      "Integrated local payment rails: PIX for Brazil, M-Pesa for East Africa, UPI for India, regional credit options",
      "Culturally-specific filters: halal-friendly, family suite configurations, prayer room proximity, vegetarian kitchen, etc.",
      "Diaspora travel features: book accommodation in your home country for visiting family, group coordination tools",
    ],
    whyPurple:
      "Booking.com and Expedia are retrofitting their Western products for these markets. Building native-first for emerging market travelers is a fundamentally different and defensible approach. 74% of LATAM travelers book online but the tools aren't built for them.",
    underserved:
      "The next billion travelers: African middle class, Indian domestic travelers, Latin American cross-border travelers, Middle Eastern family travelers, Southeast Asian intra-regional travelers.",
    revenueModel:
      "Commission on bookings, partnerships with local payment providers, B2B licensing to regional agencies, advertising from local tourism boards.",
  },
  {
    id: 7,
    title: "GroupStay Coordinator",
    tagline: "The unsolved nightmare of booking for more than one person",
    ocean: "Purple Ocean",
    audience: ["End Consumers", "Small Agencies"],
    moats: ["AI UX", "Network Effects"],
    effort: "Medium",
    revenue: "High",
    summary:
      "Group travel booking is still done via spreadsheets and WhatsApp. Build the definitive platform for group accommodation: weddings (guest blocks), corporate retreats, family reunions, friend trips, sports teams, religious pilgrimages. AI handles the coordination nightmare — different budgets, dates, preferences — and books optimally.",
    howItWorks: [
      "Organizer creates a trip → shares a link → each participant enters preferences, budget, dates",
      "AI finds the optimal accommodation solution: same hotel, nearby cluster, or mixed strategy",
      "Built-in voting/polling: the group decides together with AI-facilitated compromise",
      "Split payment handling: everyone pays their share directly",
      "Group rate negotiation: AI automatically requests group discounts from properties via LiteAPI",
    ],
    whyPurple:
      "58% of millennial parents plan extended family vacations. 60% of travelers book around events. Group coordination is a massive, unglamorous problem that nobody has solved well because it's complex. That complexity IS the moat — hard to replicate.",
    underserved:
      "Wedding planners, corporate travel managers (small companies), sports team coordinators, religious pilgrimage organizers, family reunion planners, bachelor/bachelorette party organizers.",
    revenueModel:
      "Commission on group bookings (higher total value), premium organizer features, B2B white-label for event/wedding platforms.",
  },
];

const priorityColors = {
  "Purple Ocean": { bg: "#7C3AED", text: "#fff" },
  "Blue-Purple": { bg: "#3B82F6", text: "#fff" },
  "Blue Ocean": { bg: "#06B6D4", text: "#fff" },
};

const effortMap = {
  Medium: "⚡⚡",
  "Medium-High": "⚡⚡⚡",
  High: "⚡⚡⚡⚡",
};

const revenueMap = {
  "Medium-High": "💰💰💰",
  High: "💰💰💰💰",
  "Very High": "💰💰💰💰💰",
  "Very High (long-term)": "💰💰💰💰💰",
};

export default function App() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? ideas
      : ideas.filter(
          (i) =>
            i.audience.some((a) =>
              a.toLowerCase().includes(filter.toLowerCase())
            ) || i.moats.some((m) => m.toLowerCase().includes(filter.toLowerCase()))
        );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#E8E6E3",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0A0F 0%, #1a103a 40%, #0d1f3c 70%, #0A0A0F 100%)",
          padding: "48px 32px 40px",
          borderBottom: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7C3AED",
              marginBottom: 12,
              fontFamily: "'Courier New', monospace",
            }}
          >
            Monetization Brainstorm · LiteAPI × AI
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.15,
              margin: "0 0 16px",
              color: "#F5F3F0",
            }}
          >
            Purple Ocean
            <span style={{ color: "#7C3AED" }}> Opportunities</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "#9B9A97",
              maxWidth: 680,
              margin: 0,
            }}
          >
            7 defensible business concepts built on LiteAPI's 2M+ property
            infrastructure. Each targets underserved segments with proprietary
            data moats and AI-powered experiences that incumbents can't easily
            replicate.
          </p>

          {/* Market context */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "40%", label: "of travelers use AI but don't book through it" },
              { num: "85%", label: "of small agencies lack AI infrastructure" },
              { num: "$532B", label: "projected AI-in-travel market by 2029" },
              { num: "74%", label: "of travelers want local recommendations" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.15)",
                  borderRadius: 8,
                  padding: "12px 18px",
                  minWidth: 170,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#A78BFA",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: 12, color: "#8B8A87", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "20px 32px 0",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "All Ideas", value: "all" },
          { label: "End Consumers", value: "consumer" },
          { label: "Small Agencies", value: "agenc" },
          { label: "Underserved", value: "underserved" },
          { label: "Proprietary Data", value: "proprietary" },
          { label: "AI UX", value: "ai" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              background:
                filter === f.value
                  ? "rgba(124,58,237,0.2)"
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f.value ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f.value ? "#A78BFA" : "#8B8A87",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 0.5,
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 32px 60px" }}>
        {filtered.map((idea) => {
          const isOpen = selected === idea.id;
          const oColor = priorityColors[idea.ocean] || priorityColors["Purple Ocean"];
          return (
            <div
              key={idea.id}
              style={{
                background: isOpen
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isOpen ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10,
                marginBottom: 12,
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              {/* Card header */}
              <div
                onClick={() => setSelected(isOpen ? null : idea.id)}
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 11,
                        color: "#5B5A57",
                      }}
                    >
                      #{idea.id.toString().padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        background: oColor.bg,
                        color: oColor.text,
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {idea.ocean}
                    </span>
                    <span style={{ fontSize: 12, color: "#5B5A57" }}>
                      Effort: {effortMap[idea.effort]} · Revenue:{" "}
                      {revenueMap[idea.revenue]}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      margin: "0 0 4px",
                      color: "#F5F3F0",
                    }}
                  >
                    {idea.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#9B9A97",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {idea.tagline}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "#5B5A57",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  +
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div
                  style={{
                    padding: "0 24px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: 20,
                  }}
                >
                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginBottom: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    {idea.audience.map((a) => (
                      <span
                        key={a}
                        style={{
                          background: "rgba(6,182,212,0.1)",
                          border: "1px solid rgba(6,182,212,0.2)",
                          color: "#67E8F9",
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                    {idea.moats.map((m) => (
                      <span
                        key={m}
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          color: "#A78BFA",
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#C8C6C1",
                      marginBottom: 24,
                    }}
                  >
                    {idea.summary}
                  </p>

                  {/* Three columns */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    {/* How it works */}
                    <div
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: 8,
                        padding: 16,
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#7C3AED",
                          marginBottom: 10,
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        How It Works
                      </div>
                      {idea.howItWorks.map((step, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 8,
                            fontSize: 13,
                            lineHeight: 1.55,
                            color: "#9B9A97",
                          }}
                        >
                          <span
                            style={{
                              color: "#5B5A57",
                              fontFamily: "'Courier New', monospace",
                              fontSize: 11,
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>

                    {/* Why Purple + Underserved */}
                    <div>
                      <div
                        style={{
                          background: "rgba(124,58,237,0.06)",
                          borderRadius: 8,
                          padding: 16,
                          border: "1px solid rgba(124,58,237,0.12)",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#A78BFA",
                            marginBottom: 8,
                            fontFamily: "'Courier New', monospace",
                          }}
                        >
                          Why This Is Defensible
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: "#C8C6C1",
                            margin: 0,
                          }}
                        >
                          {idea.whyPurple}
                        </p>
                      </div>
                      <div
                        style={{
                          background: "rgba(6,182,212,0.06)",
                          borderRadius: 8,
                          padding: 16,
                          border: "1px solid rgba(6,182,212,0.12)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#67E8F9",
                            marginBottom: 8,
                            fontFamily: "'Courier New', monospace",
                          }}
                        >
                          Underserved Segments
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: "#C8C6C1",
                            margin: 0,
                          }}
                        >
                          {idea.underserved}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue model */}
                  <div
                    style={{
                      background: "rgba(16,185,129,0.06)",
                      borderRadius: 8,
                      padding: 14,
                      border: "1px solid rgba(16,185,129,0.12)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#34D399",
                        marginBottom: 6,
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      Revenue Model
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "#C8C6C1",
                        margin: 0,
                      }}
                    >
                      {idea.revenueModel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Recommendation section */}
        <div
          style={{
            marginTop: 40,
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.06) 100%)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 10,
            padding: 28,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#7C3AED",
              marginBottom: 12,
              fontFamily: "'Courier New', monospace",
            }}
          >
            Recommended Starting Strategy
          </div>
          <h3
            style={{ fontSize: 20, margin: "0 0 14px", color: "#F5F3F0", fontWeight: 500 }}
          >
            The Compound Approach: Start with #1 + #4, expand to #2
          </h3>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#9B9A97",
              marginBottom: 16,
            }}
          >
            <strong style={{ color: "#C8C6C1" }}>Phase 1 (0-6 months):</strong>{" "}
            Launch <em>StayMatch</em> (swipe-based discovery) as your consumer-facing
            product. It's medium effort, immediately differentiating, and generates
            the booking volume you need. Simultaneously, build the{" "}
            <em>Local Truth Engine</em> data collection into the post-booking flow.
            Every booking feeds your proprietary dataset.
          </p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#9B9A97",
              marginBottom: 16,
            }}
          >
            <strong style={{ color: "#C8C6C1" }}>Phase 2 (6-12 months):</strong>{" "}
            Your Truth Engine data becomes the moat. Launch the{" "}
            <em>AI Trip Architect</em> powered by your proprietary data — now you
            don't just have AI, you have AI with data nobody else has. Add{" "}
            <em>GroupStay</em> as a feature, not a separate product.
          </p>
          <p
            style={{ fontSize: 14, lineHeight: 1.7, color: "#9B9A97", margin: 0 }}
          >
            <strong style={{ color: "#C8C6C1" }}>Phase 3 (12-18 months):</strong>{" "}
            License your data + AI to agencies via <em>AgencyOS</em>. Open the{" "}
            <em>Invisible Booking Layer</em> to non-travel apps. Your proprietary
            data is now the core asset; the consumer app, B2B tools, and embedded
            widgets are all distribution channels for it.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            padding: "16px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            fontSize: 11,
            color: "#4B4A47",
            fontFamily: "'Courier New', monospace",
          }}
        >
          Built for brainstorming · All concepts use LiteAPI as booking
          infrastructure · Feb 2026
        </div>
      </div>
    </div>
  );
}
