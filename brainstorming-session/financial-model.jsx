import { useState, useMemo } from "react";

const mono = "'JetBrains Mono', 'Fira Code', monospace";
const display = "'Playfair Display', 'Georgia', serif";
const body = "'DM Sans', 'Helvetica Neue', sans-serif";

// ───── CORE MODEL ─────
function buildModel(inputs) {
  const {
    avgBookingValue, marginPct, contributionRate, truthCheckCost,
    agencyPrice, agencyChurn, premiumPct, premiumPrice,
    dmoClientPrice, hotelGroupPrice, embeddedCommission,
    monthlyGrowthRate, startingUsers, bookingsPerUserPerYear,
    b2bStartMonth, premiumStartMonth, embeddedStartMonth, dataLicenseStartMonth,
    teamSize, avgSalary, infraCostBase, marketingPctRevenue, seedFunding
  } = inputs;

  const months = [];
  let cumulativeBookings = 0;
  let cumulativeTruth = 0;
  let cumulativeUsers = 0;
  let cashBalance = seedFunding;
  let agencies = 0;
  let dmoClients = 0;
  let hotelGroups = 0;
  let embeddedPartners = 0;

  for (let m = 1; m <= 24; m++) {
    // User growth (logistic-ish curve)
    const growthMultiplier = m <= 3 ? 0.6 : m <= 6 ? 0.8 : m <= 12 ? 1.0 : 1.15;
    const newUsers = m === 1 ? startingUsers : Math.round(months[m-2].totalUsers * monthlyGrowthRate * growthMultiplier);
    const totalUsers = m === 1 ? startingUsers : months[m-2].totalUsers + newUsers;
    cumulativeUsers = totalUsers;

    // Bookings
    const monthlyBookings = Math.round(totalUsers * (bookingsPerUserPerYear / 12) * (m <= 3 ? 0.3 : m <= 6 ? 0.5 : m <= 12 ? 0.65 : 0.75));
    cumulativeBookings += monthlyBookings;

    // Truth data
    const truthContributions = Math.round(monthlyBookings * contributionRate);
    cumulativeTruth += truthContributions;
    const truthCost = truthContributions * truthCheckCost;

    // ── REVENUE STREAMS ──
    // 1. Consumer booking commission
    const commissionPerBooking = avgBookingValue * marginPct;
    const bookingRevenue = monthlyBookings * commissionPerBooking;

    // 2. B2B Agency SaaS
    if (m >= b2bStartMonth) {
      const newAgencies = m === b2bStartMonth ? 5 : m <= 10 ? 3 : m <= 14 ? 5 : 8;
      const churned = Math.round(agencies * agencyChurn);
      agencies = agencies + newAgencies - churned;
    }
    const agencyRevenue = agencies * agencyPrice;

    // 3. Premium consumer subscriptions
    let premiumUsers = 0;
    let premiumRevenue = 0;
    if (m >= premiumStartMonth) {
      premiumUsers = Math.round(totalUsers * premiumPct * Math.min(1, (m - premiumStartMonth + 1) / 6));
      premiumRevenue = premiumUsers * premiumPrice;
    }

    // 4. Data licensing (DMOs + Hotel Groups)
    if (m >= dataLicenseStartMonth) {
      const months_since = m - dataLicenseStartMonth;
      dmoClients = Math.min(15, Math.floor(months_since / 2) + 1);
      hotelGroups = Math.min(25, Math.floor(months_since / 1.5) + 2);
    }
    const dataLicenseRevenue = (dmoClients * dmoClientPrice) + (hotelGroups * hotelGroupPrice);

    // 5. Embedded booking (partner-generated)
    if (m >= embeddedStartMonth) {
      const months_since = m - embeddedStartMonth;
      embeddedPartners = Math.min(15, months_since + 2);
    }
    const embeddedBookings = embeddedPartners * Math.round(200 * Math.min(1, (m - embeddedStartMonth + 1) / 4));
    const embeddedRevenue = m >= embeddedStartMonth ? embeddedBookings * embeddedCommission : 0;

    // Total revenue
    const totalRevenue = bookingRevenue + agencyRevenue + premiumRevenue + dataLicenseRevenue + embeddedRevenue;

    // ── COSTS ──
    const teamCost = teamSize * avgSalary * (m <= 6 ? 0.6 : m <= 12 ? 0.8 : 1.0); // ramp up
    const infraCost = infraCostBase * (1 + Math.floor(m / 6) * 0.5);
    const marketingCost = Math.max(totalRevenue * marketingPctRevenue, m <= 6 ? 5000 : m <= 12 ? 10000 : 15000);
    const totalCosts = teamCost + infraCost + marketingCost + truthCost;

    // Cash
    const netIncome = totalRevenue - totalCosts;
    cashBalance += netIncome;

    // Unit economics
    const cac = marketingCost / Math.max(newUsers, 1);
    const ltv = commissionPerBooking * bookingsPerUserPerYear * 3; // 3 year horizon
    const ltvCacRatio = ltv / Math.max(cac, 0.01);

    months.push({
      month: m,
      newUsers, totalUsers, monthlyBookings, cumulativeBookings,
      truthContributions, cumulativeTruth, truthCost,
      bookingRevenue, agencyRevenue, premiumRevenue, dataLicenseRevenue, embeddedRevenue,
      totalRevenue,
      agencies, premiumUsers, dmoClients, hotelGroups, embeddedPartners, embeddedBookings,
      teamCost, infraCost, marketingCost, totalCosts,
      netIncome, cashBalance,
      cac, ltv, ltvCacRatio,
      mrr: totalRevenue,
      arr: totalRevenue * 12,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - truthCost - infraCost) / totalRevenue * 100) : 0,
    });
  }
  return months;
}

const defaultInputs = {
  avgBookingValue: 165,
  marginPct: 0.12,
  contributionRate: 0.18,
  truthCheckCost: 0.50,
  agencyPrice: 249,
  agencyChurn: 0.03,
  premiumPct: 0.04,
  premiumPrice: 9.99,
  dmoClientPrice: 3500,
  hotelGroupPrice: 999,
  embeddedCommission: 8,
  monthlyGrowthRate: 0.22,
  startingUsers: 200,
  bookingsPerUserPerYear: 3.5,
  b2bStartMonth: 7,
  premiumStartMonth: 14,
  embeddedStartMonth: 15,
  dataLicenseStartMonth: 13,
  teamSize: 6,
  avgSalary: 8500,
  infraCostBase: 2000,
  marketingPctRevenue: 0.25,
  seedFunding: 250000,
};

function fmt(n, decimals = 0) {
  if (Math.abs(n) >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return "$" + (n / 1000).toFixed(decimals > 0 ? 1 : 0) + "K";
  return "$" + n.toFixed(decimals);
}

function fmtN(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function pct(n) { return (n * 100).toFixed(1) + "%"; }

// ───── MINI BAR CHART ─────
function BarChart({ data, height = 120, color = "#8B5CF6", label, formatFn = fmt }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = Math.max(6, Math.min(18, Math.floor(500 / data.length) - 2));
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 10, fontFamily: mono, color: "#52525B", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height, padding: "0 0 20px" }}>
        {data.map((d, i) => {
          const h = Math.max(2, (d.value / max) * (height - 20));
          const isQuarter = (d.month) % 3 === 0;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div title={`M${d.month}: ${formatFn(d.value)}`} style={{
                width: barW, height: h, background: d.value >= 0 ? color : "#EF4444",
                borderRadius: "2px 2px 0 0", opacity: d.month <= 6 ? 0.5 : d.month <= 12 ? 0.7 : 1,
                cursor: "default", transition: "height 0.3s"
              }} />
              {isQuarter && <div style={{ fontSize: 8, color: "#3F3F46", fontFamily: mono, marginTop: 4 }}>M{d.month}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: mono, color: "#3F3F46" }}>
        <span>M1</span><span>M6</span><span>M12</span><span>M18</span><span>M24</span>
      </div>
    </div>
  );
}

// ───── STACKED REVENUE CHART ─────
function StackedRevenueChart({ data }) {
  const maxRev = Math.max(...data.map(d => d.totalRevenue), 1);
  const streams = [
    { key: "bookingRevenue", color: "#8B5CF6", label: "Booking Commission" },
    { key: "agencyRevenue", color: "#06B6D4", label: "Agency SaaS" },
    { key: "premiumRevenue", color: "#F59E0B", label: "Premium Subs" },
    { key: "dataLicenseRevenue", color: "#10B981", label: "Data Licensing" },
    { key: "embeddedRevenue", color: "#D946EF", label: "Embedded Commerce" },
  ];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontFamily: mono, color: "#52525B", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Revenue by Stream (Monthly)</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140, padding: "0 0 20px" }}>
        {data.map((d, i) => {
          const total = d.totalRevenue;
          const totalH = Math.max(2, (total / maxRev) * 120);
          let accum = 0;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column-reverse", flex: 1, height: totalH }}>
              {streams.map((s, si) => {
                const val = d[s.key];
                const h = total > 0 ? (val / total) * totalH : 0;
                accum += val;
                return <div key={si} style={{ width: "100%", height: Math.max(0, h), background: s.color, opacity: 0.85 }} title={`${s.label}: ${fmt(val)}`} />;
              })}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
        {streams.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 9, color: "#71717A", fontFamily: mono }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───── INPUT SLIDER ─────
function InputSlider({ label, value, onChange, min, max, step = 1, format = "number", suffix = "" }) {
  const display = format === "dollar" ? `$${value.toFixed(step < 1 ? 2 : 0)}` :
    format === "percent" ? `${(value * 100).toFixed(1)}%` :
    format === "month" ? `Month ${value}` :
    `${value}${suffix}`;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#A1A1AA", fontFamily: body }}>{label}</span>
        <span style={{ fontSize: 11, color: "#FAFAFA", fontFamily: mono, fontWeight: 600 }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#8B5CF6", height: 4, cursor: "pointer" }} />
    </div>
  );
}

// ───── KPI CARD ─────
function KPI({ label, value, sub, color = "#FAFAFA", small = false }) {
  return (
    <div style={{ padding: small ? "8px 10px" : "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
      <div style={{ fontSize: 9, color: "#52525B", fontFamily: mono, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: small ? 16 : 22, fontWeight: 400, color, fontFamily: display }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: "#52525B", fontFamily: mono, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

// ───── MAIN COMPONENT ─────
export default function App() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [activeView, setActiveView] = useState("dashboard");
  const [showInputs, setShowInputs] = useState(false);

  const model = useMemo(() => buildModel(inputs), [inputs]);
  const upd = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }));

  const m6 = model[5], m12 = model[11], m18 = model[17], m24 = model[23];
  const totalRev24 = model.reduce((a, m) => a + m.totalRevenue, 0);
  const totalCost24 = model.reduce((a, m) => a + m.totalCosts, 0);
  const breakeven = model.findIndex(m => m.netIncome > 0) + 1;

  const views = [
    { id: "dashboard", label: "Dashboard" },
    { id: "revenue", label: "Revenue Model" },
    { id: "unit", label: "Unit Economics" },
    { id: "costs", label: "Cost Structure" },
    { id: "scenarios", label: "Scenario Analysis" },
    { id: "table", label: "Full P&L Table" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#09090B", color: "#E4E4E7", fontFamily: body }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #09090B 0%, #1C0F26 35%, #091620 65%, #09090B 100%)", padding: "32px 20px 20px", borderBottom: "1px solid rgba(168,85,247,0.12)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#A855F7", fontFamily: mono, marginBottom: 6 }}>Financial Projections · 24-Month Model</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: "0 0 6px", color: "#FAFAFA", fontFamily: display }}>
            The Path to <span style={{ color: "#10B981" }}>{fmt(m24.mrr)} MRR</span> in 24 Months
          </h1>
          <p style={{ fontSize: 12, color: "#52525B", margin: 0, fontFamily: mono }}>
            {fmtN(m24.totalUsers)} users · {fmtN(m24.cumulativeBookings)} total bookings · {fmtN(m24.cumulativeTruth)} truth data points · {model.filter(m => m.netIncome > 0).length > 0 ? `Breakeven: Month ${breakeven}` : "Pre-profit"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "12px 20px 0", display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 10 }}>
        {views.map((v) => (
          <button key={v.id} onClick={() => setActiveView(v.id)} style={{
            background: activeView === v.id ? "rgba(168,85,247,0.15)" : "transparent",
            border: `1px solid ${activeView === v.id ? "rgba(168,85,247,0.3)" : "transparent"}`,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            fontSize: 11, color: activeView === v.id ? "#C084FC" : "#52525B", fontFamily: mono
          }}>{v.label}</button>
        ))}
        <button onClick={() => setShowInputs(!showInputs)} style={{
          marginLeft: "auto", background: showInputs ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${showInputs ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          fontSize: 11, color: showInputs ? "#F97316" : "#52525B", fontFamily: mono
        }}>⚙ Adjust Assumptions</button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 20px 60px" }}>
        {/* Assumptions panel */}
        {showInputs && (
          <div style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#F97316", letterSpacing: 2, marginBottom: 12 }}>ADJUSTABLE ASSUMPTIONS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 20px" }}>
              <InputSlider label="Avg Booking Value" value={inputs.avgBookingValue} onChange={upd("avgBookingValue")} min={80} max={350} format="dollar" />
              <InputSlider label="Your Margin (via LiteAPI)" value={inputs.marginPct} onChange={upd("marginPct")} min={0.05} max={0.25} step={0.01} format="percent" />
              <InputSlider label="Truth Contribution Rate" value={inputs.contributionRate} onChange={upd("contributionRate")} min={0.05} max={0.40} step={0.01} format="percent" />
              <InputSlider label="Monthly User Growth Rate" value={inputs.monthlyGrowthRate} onChange={upd("monthlyGrowthRate")} min={0.08} max={0.40} step={0.01} format="percent" />
              <InputSlider label="Bookings/User/Year" value={inputs.bookingsPerUserPerYear} onChange={upd("bookingsPerUserPerYear")} min={1} max={8} step={0.5} suffix="/yr" />
              <InputSlider label="Agency SaaS Price" value={inputs.agencyPrice} onChange={upd("agencyPrice")} min={99} max={999} format="dollar" />
              <InputSlider label="Team Size" value={inputs.teamSize} onChange={upd("teamSize")} min={2} max={15} suffix=" people" />
              <InputSlider label="Seed Funding" value={inputs.seedFunding} onChange={upd("seedFunding")} min={50000} max={1000000} step={25000} format="dollar" />
            </div>
            <button onClick={() => setInputs(defaultInputs)} style={{ marginTop: 8, fontSize: 10, color: "#71717A", background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: mono }}>Reset to Defaults</button>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {activeView === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 20 }}>
              <KPI label="Month 24 MRR" value={fmt(m24.mrr)} sub={`${fmt(m24.arr)} ARR`} color="#10B981" />
              <KPI label="Total Users" value={fmtN(m24.totalUsers)} sub={`+${fmtN(m24.newUsers)}/mo`} />
              <KPI label="Monthly Bookings" value={fmtN(m24.monthlyBookings)} sub={`${fmtN(m24.cumulativeBookings)} cumulative`} />
              <KPI label="Truth Data Points" value={fmtN(m24.cumulativeTruth)} sub={`${pct(inputs.contributionRate)} rate`} />
              <KPI label="Cash Balance" value={fmt(m24.cashBalance)} sub={m24.cashBalance > 0 ? "Funded" : "Needs capital"} color={m24.cashBalance > 0 ? "#10B981" : "#EF4444"} />
              <KPI label="LTV:CAC Ratio" value={m24.ltvCacRatio.toFixed(1) + "x"} sub={m24.ltvCacRatio >= 3 ? "Healthy" : "Below 3x"} color={m24.ltvCacRatio >= 3 ? "#10B981" : "#F59E0B"} />
            </div>

            <StackedRevenueChart data={model} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <BarChart data={model.map(m => ({ month: m.month, value: m.totalUsers }))} color="#8B5CF6" label="Total Users" formatFn={fmtN} />
              <BarChart data={model.map(m => ({ month: m.month, value: m.netIncome }))} color="#10B981" label="Net Income (Monthly)" />
            </div>

            {/* Phase milestones */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 16 }}>
              {[
                { label: "Phase 1 (M6)", data: m6, color: "#8B5CF6" },
                { label: "Phase 2 (M12)", data: m12, color: "#06B6D4" },
                { label: "Phase 3 (M18)", data: m18, color: "#10B981" },
              ].map((p) => (
                <div key={p.label} style={{ background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, fontFamily: mono, color: p.color, fontWeight: 700, marginBottom: 8 }}>{p.label}</div>
                  <div style={{ fontSize: 9, color: "#71717A", fontFamily: mono, lineHeight: 1.8 }}>
                    MRR: {fmt(p.data.mrr)}<br />
                    Users: {fmtN(p.data.totalUsers)}<br />
                    Bookings/mo: {fmtN(p.data.monthlyBookings)}<br />
                    Agencies: {p.data.agencies}<br />
                    Truth: {fmtN(p.data.cumulativeTruth)} pts<br />
                    Cash: {fmt(p.data.cashBalance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVENUE MODEL VIEW */}
        {activeView === "revenue" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", letterSpacing: 2, marginBottom: 12 }}>REVENUE STREAMS BREAKDOWN</div>

            {[
              {
                name: "Consumer Booking Commission", color: "#8B5CF6", icon: "🏨",
                formula: `${fmtN(m24.monthlyBookings)} bookings/mo × ${fmt(inputs.avgBookingValue)} avg × ${pct(inputs.marginPct)} margin`,
                m6: m6.bookingRevenue, m12: m12.bookingRevenue, m18: m18.bookingRevenue, m24: m24.bookingRevenue,
                assumptions: [
                  `Avg booking value: ${fmt(inputs.avgBookingValue)} (2-night stay, mid-range hotel). Industry avg $150-200/night × 2 nights = $300-400 total, but including budget stays pulls average down.`,
                  `Your margin via LiteAPI: ${pct(inputs.marginPct)}. LiteAPI lets you set margin parameter dynamically. OTA commissions are 15-25%; as a reseller building on LiteAPI, ${pct(inputs.marginPct)} is conservative after LiteAPI takes their cut.`,
                  `Booking frequency: ${inputs.bookingsPerUserPerYear}/user/year. Digital nomads book 6-12x/yr; mainstream travelers 2-4x/yr. Blended rate reflects evolving user mix.`,
                  "Commission paid weekly by LiteAPI on confirmed (checked-out) bookings. ~10% cancellation rate already factored into booking volume."
                ]
              },
              {
                name: "Agency SaaS (Truth Score API)", color: "#06B6D4", icon: "🏢",
                formula: `${m24.agencies} agencies × ${fmt(inputs.agencyPrice)}/mo`,
                m6: m6.agencyRevenue, m12: m12.agencyRevenue, m18: m18.agencyRevenue, m24: m24.agencyRevenue,
                assumptions: [
                  `Launches month ${inputs.b2bStartMonth}. Initial 5 beta agencies → paid conversion at ~60%.`,
                  `Price: ${fmt(inputs.agencyPrice)}/mo includes Truth Score API access, embeddable widget, and 1K API calls/mo.`,
                  `Monthly churn: ${pct(inputs.agencyChurn)} — low because switching means losing access to data their clients now expect.`,
                  "~45,000 travel agencies in US. Top of funnel is small; bottom of funnel is high-value. 100 agencies = $25K+ MRR."
                ]
              },
              {
                name: "Premium Consumer Subscription", color: "#F59E0B", icon: "⭐",
                formula: `${fmtN(m24.premiumUsers)} premium users × ${fmt(inputs.premiumPrice)}/mo`,
                m6: m6.premiumRevenue, m12: m12.premiumRevenue, m18: m18.premiumRevenue, m24: m24.premiumRevenue,
                assumptions: [
                  `Launches month ${inputs.premiumStartMonth}. Delayed until enough free-tier value exists to justify premium.`,
                  `Conversion: ${pct(inputs.premiumPct)} of active users (Spotify free→paid is ~3-4%, strong benchmark).`,
                  `Price: ${fmt(inputs.premiumPrice)}/mo for unlimited AI conversations, advanced Truth filters, family profiles, early city access.`,
                  "Small revenue stream but important signal: willingness to pay validates consumer product-market fit."
                ]
              },
              {
                name: "Data Licensing (DMOs + Hotels)", color: "#10B981", icon: "📊",
                formula: `${m24.dmoClients} DMOs × ${fmt(inputs.dmoClientPrice)}/mo + ${m24.hotelGroups} hotel groups × ${fmt(inputs.hotelGroupPrice)}/mo`,
                m6: m6.dataLicenseRevenue, m12: m12.dataLicenseRevenue, m18: m18.dataLicenseRevenue, m24: m24.dataLicenseRevenue,
                assumptions: [
                  `Launches month ${inputs.dataLicenseStartMonth}. Requires enough data density to be meaningful.`,
                  `DMO pricing: ${fmt(inputs.dmoClientPrice)}/mo — quarterly city reports on hotel quality benchmarks. There are hundreds of DMOs globally.`,
                  `Hotel group pricing: ${fmt(inputs.hotelGroupPrice)}/mo — competitive intelligence dashboard (their properties vs competitors).`,
                  "Near-100% margin — packaging data you already collect. No incremental cost per client."
                ]
              },
              {
                name: "Embedded Commerce (Partner Bookings)", color: "#D946EF", icon: "🔌",
                formula: `${m24.embeddedPartners} partners × ~${fmtN(m24.embeddedBookings / Math.max(m24.embeddedPartners, 1))} bookings/partner × ${fmt(inputs.embeddedCommission)} commission`,
                m6: m6.embeddedRevenue, m12: m12.embeddedRevenue, m18: m18.embeddedRevenue, m24: m24.embeddedRevenue,
                assumptions: [
                  `Launches month ${inputs.embeddedStartMonth}. White-label booking widget for non-travel apps.`,
                  `Commission: ${fmt(inputs.embeddedCommission)}/booking — lower than direct because partner drives acquisition.`,
                  "Partners: fitness apps, conference platforms, airline blogs, lifestyle apps. Each embeds your AI + booking.",
                  "Scales without your own acquisition costs. Long tail of small integrations adds up."
                ]
              },
            ].map((stream, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${stream.color}20`, borderRadius: 10, padding: 16, marginBottom: 10, borderLeft: `3px solid ${stream.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#FAFAFA", fontFamily: display }}>{stream.icon} {stream.name}</div>
                    <div style={{ fontSize: 11, color: stream.color, fontFamily: mono, marginTop: 2 }}>{stream.formula}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, color: stream.color, fontFamily: display }}>{fmt(stream.m24)}<span style={{ fontSize: 10, color: "#52525B" }}>/mo</span></div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
                  {[{ l: "M6", v: stream.m6 }, { l: "M12", v: stream.m12 }, { l: "M18", v: stream.m18 }, { l: "M24", v: stream.m24 }].map((d) => (
                    <div key={d.l} style={{ background: `${stream.color}08`, borderRadius: 4, padding: "4px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#52525B", fontFamily: mono }}>{d.l}</div>
                      <div style={{ fontSize: 12, color: "#A1A1AA", fontFamily: mono }}>{fmt(d.v)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#52525B", lineHeight: 1.6 }}>
                  {stream.assumptions.map((a, ai) => <div key={ai} style={{ marginBottom: 3, paddingLeft: 10, borderLeft: `2px solid ${stream.color}15` }}>{a}</div>)}
                </div>
              </div>
            ))}

            <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8, padding: 14, marginTop: 16 }}>
              <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", marginBottom: 6 }}>REVENUE DIVERSIFICATION AT MONTH 24</div>
              <div style={{ display: "flex", gap: 4, height: 24, borderRadius: 4, overflow: "hidden" }}>
                {[
                  { v: m24.bookingRevenue, c: "#8B5CF6", l: "Booking" },
                  { v: m24.agencyRevenue, c: "#06B6D4", l: "Agency" },
                  { v: m24.premiumRevenue, c: "#F59E0B", l: "Premium" },
                  { v: m24.dataLicenseRevenue, c: "#10B981", l: "Data" },
                  { v: m24.embeddedRevenue, c: "#D946EF", l: "Embedded" },
                ].map((s) => {
                  const w = m24.totalRevenue > 0 ? (s.v / m24.totalRevenue * 100) : 0;
                  return w > 0 ? <div key={s.l} title={`${s.l}: ${(w).toFixed(0)}%`} style={{ width: w + "%", background: s.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {w > 8 && <span style={{ fontSize: 8, color: "#000", fontWeight: 700, fontFamily: mono }}>{(w).toFixed(0)}%</span>}
                  </div> : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* UNIT ECONOMICS VIEW */}
        {activeView === "unit" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", letterSpacing: 2, marginBottom: 12 }}>UNIT ECONOMICS</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 20 }}>
              <KPI label="Revenue/Booking" value={fmt(inputs.avgBookingValue * inputs.marginPct, 2)} sub={`${pct(inputs.marginPct)} of ${fmt(inputs.avgBookingValue)}`} color="#8B5CF6" small />
              <KPI label="CAC (Month 24)" value={fmt(m24.cac, 2)} sub="Blended all channels" color="#F59E0B" small />
              <KPI label="LTV (3yr)" value={fmt(m24.ltv)} sub={`${inputs.bookingsPerUserPerYear} bookings/yr`} color="#10B981" small />
              <KPI label="LTV:CAC" value={m24.ltvCacRatio.toFixed(1) + "x"} sub={m24.ltvCacRatio >= 3 ? "✅ Healthy" : "⚠️ Improve"} color={m24.ltvCacRatio >= 3 ? "#10B981" : "#F59E0B"} small />
              <KPI label="Payback Period" value={m24.cac > 0 ? (m24.cac / (inputs.avgBookingValue * inputs.marginPct * inputs.bookingsPerUserPerYear / 12)).toFixed(1) + " mo" : "—"} sub="Months to recover CAC" small />
              <KPI label="Gross Margin" value={m24.grossMargin.toFixed(0) + "%"} sub="Revenue - data costs - infra" color={m24.grossMargin > 70 ? "#10B981" : "#F59E0B"} small />
            </div>

            <BarChart data={model.map(m => ({ month: m.month, value: m.ltvCacRatio }))} color="#10B981" label="LTV:CAC Ratio Over Time" formatFn={(n) => n.toFixed(1) + "x"} />
            <BarChart data={model.map(m => ({ month: m.month, value: m.cac }))} color="#F59E0B" label="Customer Acquisition Cost (CAC)" />

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 16, marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#FAFAFA", fontFamily: display, marginBottom: 8 }}>Why These Unit Economics Work</div>
              {[
                { title: "Low marginal cost per booking", desc: `LiteAPI handles payment processing, supplier relations, and fulfillment. Your incremental cost per booking is near-zero (API call + compute). The ${pct(inputs.marginPct)} margin is almost pure gross profit.` },
                { title: "Data collection piggybacks on bookings", desc: `At ${fmt(inputs.truthCheckCost)} per truth contribution (the 5% discount incentive cost), you're building a proprietary dataset for essentially nothing vs. the value it creates. A competitor would need to pay $10-50 per data point to crowdsource equivalent data.` },
                { title: "B2B revenue has 90%+ gross margins", desc: "Agency SaaS and data licensing have near-zero marginal cost — you're licensing access to data that already exists. Every new B2B customer is almost pure margin." },
                { title: "Switching costs improve retention over time", desc: "As taste profiles deepen and agencies integrate your API, retention improves naturally. This increases LTV without increasing CAC, improving the ratio over time." },
              ].map((p, i) => (
                <div key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: "2px solid rgba(168,85,247,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#D4D4D8" }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: "#71717A", lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COST STRUCTURE VIEW */}
        {activeView === "costs" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", letterSpacing: 2, marginBottom: 12 }}>COST STRUCTURE</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
              <KPI label="Month 24 Costs" value={fmt(m24.totalCosts)} sub={`${fmt(m24.netIncome)} net income`} color={m24.netIncome > 0 ? "#10B981" : "#EF4444"} />
              <KPI label="Team Cost" value={fmt(m24.teamCost)} sub={`${inputs.teamSize} people × ${fmt(inputs.avgSalary)}/mo`} />
              <KPI label="Infra Cost" value={fmt(m24.infraCost)} sub="Cloud + API + tools" />
              <KPI label="Marketing" value={fmt(m24.marketingCost)} sub={`${pct(inputs.marketingPctRevenue)} of revenue`} />
              <KPI label="24mo Total Spend" value={fmt(totalCost24)} sub={`${fmt(totalRev24)} total rev`} />
              <KPI label="Cash Remaining" value={fmt(m24.cashBalance)} sub={`from ${fmt(inputs.seedFunding)} seed`} color={m24.cashBalance > 0 ? "#10B981" : "#EF4444"} />
            </div>

            <BarChart data={model.map(m => ({ month: m.month, value: m.cashBalance }))} color={m24.cashBalance > 0 ? "#10B981" : "#EF4444"} label="Cash Balance (Runway)" />
            <BarChart data={model.map(m => ({ month: m.month, value: m.totalCosts }))} color="#EF4444" label="Total Monthly Costs" />

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#FAFAFA", fontFamily: display, marginBottom: 10 }}>Team Scaling Plan</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {[
                  { phase: "M1–6", size: "3–4", roles: "Founder/CEO, Full-stack engineer, Designer/frontend, Growth marketer (part-time)" },
                  { phase: "M7–12", size: "5–6", roles: "+ Backend/data engineer (Truth pipeline), BD/sales (agencies), Community manager (part-time)" },
                  { phase: "M13–18", size: "7–9", roles: "+ ML engineer (recommendation model), B2B sales lead, Customer success, Content writer" },
                  { phase: "M19–24", size: "8–12", roles: "+ DevOps/SRE, Data analyst, Regional expansion lead, Additional engineers as needed" },
                ].map((t) => (
                  <div key={t.phase} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: 10 }}>
                    <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", fontWeight: 600 }}>{t.phase} · {t.size} people</div>
                    <div style={{ fontSize: 11, color: "#71717A", marginTop: 4, lineHeight: 1.5 }}>{t.roles}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO ANALYSIS */}
        {activeView === "scenarios" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", letterSpacing: 2, marginBottom: 12 }}>SCENARIO ANALYSIS</div>
            {(() => {
              const bear = buildModel({ ...inputs, monthlyGrowthRate: 0.14, marginPct: 0.08, contributionRate: 0.10, bookingsPerUserPerYear: 2.5 });
              const base = model;
              const bull = buildModel({ ...inputs, monthlyGrowthRate: 0.30, marginPct: 0.15, contributionRate: 0.25, bookingsPerUserPerYear: 4.5 });
              const scenarios = [
                { name: "Bear Case", desc: "Slow growth (14%/mo), lower margin (8%), weak contribution (10%), fewer bookings (2.5/yr)", data: bear, color: "#EF4444" },
                { name: "Base Case", desc: "Moderate growth (22%/mo), 12% margin, 18% contribution, 3.5 bookings/yr", data: base, color: "#F59E0B" },
                { name: "Bull Case", desc: "Strong growth (30%/mo), higher margin (15%), strong contribution (25%), 4.5 bookings/yr", data: bull, color: "#10B981" },
              ];

              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                    {scenarios.map((s) => {
                      const d24 = s.data[23];
                      const dTotalRev = s.data.reduce((a, m) => a + m.totalRevenue, 0);
                      return (
                        <div key={s.name} style={{ background: `${s.color}06`, border: `1px solid ${s.color}20`, borderRadius: 10, padding: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: mono, marginBottom: 4 }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: "#52525B", lineHeight: 1.5, marginBottom: 10 }}>{s.desc}</div>
                          <div style={{ fontSize: 9, fontFamily: mono, color: "#71717A", lineHeight: 2 }}>
                            <div>M24 MRR: <span style={{ color: s.color, fontWeight: 600 }}>{fmt(d24.mrr)}</span></div>
                            <div>M24 ARR: <span style={{ color: "#A1A1AA" }}>{fmt(d24.arr)}</span></div>
                            <div>Total Users: <span style={{ color: "#A1A1AA" }}>{fmtN(d24.totalUsers)}</span></div>
                            <div>Total Bookings: <span style={{ color: "#A1A1AA" }}>{fmtN(d24.cumulativeBookings)}</span></div>
                            <div>Truth Data: <span style={{ color: "#A1A1AA" }}>{fmtN(d24.cumulativeTruth)}</span></div>
                            <div>24mo Revenue: <span style={{ color: "#A1A1AA" }}>{fmt(dTotalRev)}</span></div>
                            <div>Cash: <span style={{ color: d24.cashBalance > 0 ? "#10B981" : "#EF4444" }}>{fmt(d24.cashBalance)}</span></div>
                            <div>LTV:CAC: <span style={{ color: "#A1A1AA" }}>{d24.ltvCacRatio.toFixed(1)}x</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 10, fontFamily: mono, color: "#52525B", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>MRR Comparison Across Scenarios</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140, marginBottom: 16 }}>
                    {Array.from({ length: 24 }, (_, i) => {
                      const maxV = bull[23].mrr;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, justifyContent: "flex-end", height: "100%" }}>
                          {scenarios.map((s) => (
                            <div key={s.name} style={{ height: Math.max(1, s.data[i].mrr / maxV * 40), background: s.color, opacity: 0.7, borderRadius: 1 }} />
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#FAFAFA", fontFamily: display, marginBottom: 8 }}>Key Sensitivity Drivers</div>
                    {[
                      { driver: "Monthly growth rate", impact: "Most sensitive lever. Difference between 14% and 30% monthly growth is the difference between a lifestyle business and a venture-scale outcome. Growth rate is primarily a function of product-market fit + viral coefficient.", sensitivity: "VERY HIGH" },
                      { driver: "Margin via LiteAPI", impact: "Directly impacts unit economics. At 8% margin, you need higher volume to reach profitability. At 15%, you're profitable faster and can reinvest more into growth. Negotiate higher margins as volume grows.", sensitivity: "HIGH" },
                      { driver: "Truth contribution rate", impact: "Affects moat depth, not revenue directly. But more data → better recommendations → higher conversion → more bookings. The indirect effect on revenue is significant by month 12+.", sensitivity: "MEDIUM" },
                      { driver: "B2B conversion & pricing", impact: "Agency SaaS and data licensing are high-margin revenue that can become the majority of profit even if a minority of revenue. Price sensitivity testing is critical in months 7-10.", sensitivity: "MEDIUM" },
                    ].map((d, i) => (
                      <div key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${d.sensitivity === "VERY HIGH" ? "#EF4444" : d.sensitivity === "HIGH" ? "#F59E0B" : "#06B6D4"}30` }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#D4D4D8" }}>{d.driver}</span>
                          <span style={{ fontSize: 9, fontFamily: mono, color: d.sensitivity === "VERY HIGH" ? "#EF4444" : d.sensitivity === "HIGH" ? "#F59E0B" : "#06B6D4" }}>{d.sensitivity}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#71717A", lineHeight: 1.5 }}>{d.impact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* FULL P&L TABLE */}
        {activeView === "table" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#A855F7", letterSpacing: 2, marginBottom: 12 }}>MONTHLY P&L (SCROLL →)</div>
            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: mono, minWidth: 1200 }}>
                <thead>
                  <tr style={{ background: "rgba(168,85,247,0.08)" }}>
                    {["", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20", "M21", "M22", "M23", "M24"].map((h, i) => (
                      <th key={i} style={{ padding: "6px 4px", color: "#A1A1AA", fontWeight: 600, textAlign: i === 0 ? "left" : "right", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap", position: i === 0 ? "sticky" : "static", left: 0, background: i === 0 ? "#09090B" : "transparent", minWidth: i === 0 ? 120 : 50 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Users", key: "totalUsers", fmt: fmtN, group: "metrics" },
                    { label: "Bookings", key: "monthlyBookings", fmt: fmtN, group: "metrics" },
                    { label: "Truth Pts", key: "truthContributions", fmt: fmtN, group: "metrics" },
                    { label: "Agencies", key: "agencies", fmt: (n) => n.toString(), group: "metrics" },
                    { label: "—", key: null, group: "sep" },
                    { label: "Booking Rev", key: "bookingRevenue", fmt: fmt, group: "revenue", color: "#8B5CF6" },
                    { label: "Agency Rev", key: "agencyRevenue", fmt: fmt, group: "revenue", color: "#06B6D4" },
                    { label: "Premium Rev", key: "premiumRevenue", fmt: fmt, group: "revenue", color: "#F59E0B" },
                    { label: "Data License", key: "dataLicenseRevenue", fmt: fmt, group: "revenue", color: "#10B981" },
                    { label: "Embedded Rev", key: "embeddedRevenue", fmt: fmt, group: "revenue", color: "#D946EF" },
                    { label: "TOTAL REV", key: "totalRevenue", fmt: fmt, group: "total", bold: true },
                    { label: "—", key: null, group: "sep" },
                    { label: "Team", key: "teamCost", fmt: fmt, group: "costs" },
                    { label: "Infra", key: "infraCost", fmt: fmt, group: "costs" },
                    { label: "Marketing", key: "marketingCost", fmt: fmt, group: "costs" },
                    { label: "Truth Costs", key: "truthCost", fmt: fmt, group: "costs" },
                    { label: "TOTAL COSTS", key: "totalCosts", fmt: fmt, group: "total", bold: true },
                    { label: "—", key: null, group: "sep" },
                    { label: "NET INCOME", key: "netIncome", fmt: fmt, group: "bottom", bold: true },
                    { label: "CASH", key: "cashBalance", fmt: fmt, group: "bottom" },
                  ].map((row, ri) => {
                    if (row.group === "sep") return <tr key={ri}><td colSpan={25} style={{ height: 4, background: "rgba(255,255,255,0.02)" }} /></tr>;
                    return (
                      <tr key={ri} style={{ background: row.bold ? "rgba(255,255,255,0.03)" : "transparent" }}>
                        <td style={{ padding: "4px 6px", color: row.color || (row.bold ? "#FAFAFA" : "#71717A"), fontWeight: row.bold ? 700 : 400, position: "sticky", left: 0, background: "#09090B", borderRight: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{row.label}</td>
                        {model.map((m, mi) => {
                          const val = m[row.key];
                          const isNeg = val < 0;
                          return (
                            <td key={mi} style={{
                              padding: "4px 4px", textAlign: "right",
                              color: row.key === "netIncome" ? (isNeg ? "#EF4444" : "#10B981") :
                                row.key === "cashBalance" ? (val < 0 ? "#EF4444" : "#A1A1AA") :
                                row.bold ? "#FAFAFA" : "#52525B",
                              fontWeight: row.bold ? 600 : 400,
                              whiteSpace: "nowrap"
                            }}>{row.fmt(val)}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
