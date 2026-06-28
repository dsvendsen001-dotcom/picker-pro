import { useState, useRef, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook", name: "Facebook Marketplace", icon: "📘", color: "#1877F2" },
  { id: "ebay",     name: "eBay AU",               icon: "🛒", color: "#E53238" },
  { id: "depop",    name: "Depop",                  icon: "👗", color: "#FF2300" },
  { id: "gumtree",  name: "Gumtree",                icon: "🌳", color: "#72B500" },
  { id: "etsy",     name: "Etsy AU",                icon: "🎨", color: "#F1641E" },
  { id: "vinted",   name: "Vinted AU",              icon: "♻️", color: "#09B1BA" },
];

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

const TABS = [
  { id: "scan",    label: "Scan",    icon: "📷" },
  { id: "saved",   label: "Saved",   icon: "📦" },
  { id: "tracker", label: "Profit",  icon: "💰" },
  { id: "guide",   label: "Guide",   icon: "📖" },
];

const QUICK_GUIDES = [
  {
    id: "levis", title: "Levi's Tag Guide", icon: "👖",
    content: [
      { title: "Red Tab — First Look", items: [
        { label: "Big E — LEVI'S all caps", value: "Pre-1971 → most valuable" },
        { label: "Little e — LeVI'S", value: "Post-1971 → still great" },
      ]},
      { title: "Back Patch", items: [
        { label: "Real leather patch", value: "Pre-1980s → premium" },
        { label: "Paper/cardboard patch", value: "1980s onwards" },
        { label: "No patch at all", value: "Usually 1990s+" },
      ]},
      { title: "Care Tag Inside Waistband", items: [
        { label: "No care tag", value: "Pre-1971" },
        { label: "Made in USA only", value: "1970s–late 1990s" },
        { label: "Made in USA + wash symbols", value: "1980s–1990s" },
        { label: "No 'Made in USA'", value: "Post late-1990s offshore" },
      ]},
      { title: "Best Cuts to Hunt", items: [
        { label: "501", value: "Button fly — always sells" },
        { label: "505", value: "Zip fly — slim & wearable" },
        { label: "517", value: "Bootcut — 70s–80s gold" },
        { label: "550", value: "Relaxed taper — 90s wave" },
        { label: "701/702", value: "Women's vintage — underpriced" },
      ]},
      { title: "Melbourne Price Guide", items: [
        { label: "Big E, good condition", value: "$80–$300+" },
        { label: "Made in USA 501s", value: "$60–$120" },
        { label: "Made in USA 505/517", value: "$40–$80" },
        { label: "Post-USA production", value: "$25–$50" },
        { label: "Women's vintage cuts", value: "$30–$70" },
      ]},
    ],
  },
  {
    id: "cameras", title: "Film Camera Checklist", icon: "📷",
    content: [
      { title: "Brands to Grab Immediately", items: [
        { label: "Canon AE-1 / AE-1 Program", value: "$80–$200 resale" },
        { label: "Olympus OM-1, OM-10", value: "$60–$180 resale" },
        { label: "Pentax K1000, ME Super", value: "$60–$150 resale" },
        { label: "Minolta X-series", value: "$40–$120 resale" },
        { label: "Yashica / Ricoh compacts", value: "$30–$80 resale" },
        { label: "Polaroid SX-70 or 600", value: "$60–$200 resale" },
      ]},
      { title: "30-Second Condition Check", items: [
        { label: "Film advance lever", value: "Does it cock the shutter?" },
        { label: "Shutter fires", value: "Listen — does speed vary?" },
        { label: "Light seals", value: "Foam not crumbling or sticky" },
        { label: "Lens glass", value: "No fungus, haze, scratches" },
        { label: "Light meter needle", value: "Moves when light changes" },
      ]},
    ],
  },
  {
    id: "ceramics", title: "Ceramics & Pottery", icon: "🏺",
    content: [
      { title: "Australian — Always Check Base", items: [
        { label: "Remued", value: "Emu mark → $30–$300+" },
        { label: "Diana Pottery", value: "Signed base → $20–$150" },
        { label: "Bendigo Pottery (vintage only)", value: "$15–$80" },
        { label: "Signed studio pottery", value: "Research name on spot" },
      ]},
      { title: "Scandinavian Sleepers", items: [
        { label: "Arabia (Finland)", value: "Blue crown mark → $40–$200" },
        { label: "Rörstrand (Sweden)", value: "$30–$150" },
        { label: "Iittala glassware", value: "Minimalist Finnish → $20–$80" },
        { label: "Le Creuset cast iron", value: "Any colour → $60–$200" },
      ]},
    ],
  },
  {
    id: "audio", title: "Vintage Audio", icon: "🎵",
    content: [
      { title: "Receivers — Heavier = Better", items: [
        { label: "Sansui G-series", value: "$100–$500" },
        { label: "Marantz 2200-series", value: "$150–$600" },
        { label: "Pioneer SX-series", value: "$80–$400" },
        { label: "Technics SL-1200", value: "Holy grail → $300–$800" },
        { label: "Dual / Thorens turntables", value: "$80–$300" },
      ]},
      { title: "Floor Test", items: [
        { label: "Power on", value: "All channels light up?" },
        { label: "Knobs & switches", value: "No crackling when turned" },
        { label: "Both speaker channels", value: "Working?" },
        { label: "Weight test", value: "Heavy = better transformer" },
      ]},
    ],
  },
  {
    id: "watches", title: "Watches", icon: "⌚",
    content: [
      { title: "Flip It Over — Read the Case Back", items: [
        { label: "Seiko automatic", value: "Look for '17 jewels' → $40–$300" },
        { label: "Citizen automatic", value: "$30–$200" },
        { label: "Omega (any model)", value: "$200–$2000+" },
        { label: "Longines / Tissot", value: "$80–$500" },
        { label: "Casio G-Shock vintage", value: "$50–$300" },
      ]},
      { title: "Quick Check", items: [
        { label: "Crown winds", value: "Does it feel smooth?" },
        { label: "Seconds hand moves", value: "Smoothly or ticking?" },
        { label: "Crystal", value: "Scratched or cracked?" },
        { label: "Case condition", value: "Dents? Corrosion?" },
      ]},
    ],
  },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const loadLS  = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const saveLS  = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ─── API CALL ─────────────────────────────────────────────────────────────────

async function callClaude(messages, useWebSearch = false) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, useWebSearch }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  // Use pre-extracted text content from server, or fall back
  if (data._textContent) return data._textContent;
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function PickerPro() {
  const [tab, setTab]                 = useState("scan");
  const [screen, setScreen]           = useState("home");
  const [image, setImage]             = useState(null);
  const [imageB64, setImageB64]       = useState(null);
  const [condition, setCondition]     = useState("Good");
  const [loading, setLoading]         = useState(false);
  const [loadingMsg, setLoadingMsg]   = useState("");
  const [analysis, setAnalysis]       = useState(null);
  const [marketData, setMarketData]   = useState(null);
  const [selPlatform, setSelPlatform] = useState(null);
  const [listing, setListing]         = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [copied, setCopied]           = useState(null);
  const [error, setError]             = useState(null);
  const [saved, setSaved]             = useState(() => loadLS("pp_saved", []));
  const [sales, setSales]             = useState(() => loadLS("pp_sales", []));
  const [activeGuide, setActiveGuide] = useState(null);
  const [saleModal, setSaleModal]     = useState(null);
  const [salePrice, setSalePrice]     = useState("");
  const [saleCost, setSaleCost]       = useState("");
  const fileRef   = useRef();
  const cameraRef = useRef();

  useEffect(() => saveLS("pp_saved", saved), [saved]);
  useEffect(() => saveLS("pp_sales", sales), [sales]);

  const toB64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const handleFile = async (file) => {
    if (!file) return;
    // Compress large images before sending
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const MAX = 1200;
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/jpeg", 0.88));
    canvas.toBlob(async (blob) => {
      const b64 = await toB64(blob);
      setImageB64(b64);
    }, "image/jpeg", 0.88);
    setScreen("scan");
  };

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  const saveItem = () => {
    if (!analysis) return;
    const exists = saved.find(i => i.id === analysis._scanId);
    if (exists) return;
    setSaved(prev => [{ id: analysis._scanId, date: new Date().toLocaleDateString("en-AU"), image, analysis, marketData, condition }, ...prev]);
  };

  const deleteItem = (id) => setSaved(prev => prev.filter(i => i.id !== id));

  const markSold = (item) => {
    setSaleModal(item);
    setSalePrice(String(item.analysis.resale_avg));
    setSaleCost("15");
  };

  const confirmSale = () => {
    const sp = parseFloat(salePrice) || 0;
    const sc = parseFloat(saleCost) || 0;
    setSales(prev => [{
      id: Date.now(), date: new Date().toLocaleDateString("en-AU"),
      name: saleModal.analysis.name, brand: saleModal.analysis.brand,
      sellPrice: sp, buyCost: sc, profit: sp - sc,
      roi: sc > 0 ? Math.round(((sp - sc) / sc) * 100) : 0,
    }, ...prev]);
    setSaved(prev => prev.filter(i => i.id !== saleModal.id));
    setSaleModal(null);
  };

  // ── STEP 1: Identify the item with vision ──
  // ── STEP 2: Search real-time market prices ──
  // ── STEP 3: Merge and return final analysis ──
  const analyseItem = async () => {
    setLoading(true); setError(null); setMarketData(null);
    const scanId = Date.now();

    try {
      // STEP 1 — Identify item
      setLoadingMsg("🔍 Identifying item…");
      const identPrompt = `You are an expert Australian op shop picker. Analyse this image and identify the item precisely.

Return ONLY valid JSON:
{
  "name": "Precise item name",
  "brand": "Brand or null",
  "era": "Decade/era or null",
  "model": "Specific model if known or null",
  "category": "Denim|Camera|Ceramics|Audio|Clothing|Homewares|Books|Toys|Watches|Footwear|Sporting|Other",
  "search_query": "Best eBay/Depop search query to find this item selling in Australia right now e.g. 'Levi 501 made in USA vintage jeans' or 'Canon AE-1 film camera'",
  "confidence": "high|medium|low",
  "condition_note": "What to physically check given condition is ${condition}",
  "key_features": ["feature1","feature2","feature3"],
  "red_flags": ["flag1","flag2"],
  "tips": ["picker tip1","tip2","tip3"]
}`;

      const identText = await callClaude([{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageB64 } },
          { type: "text", text: identPrompt },
        ],
      }]);
      const ident = parseJSON(identText);

      // STEP 2 — Real-time market price search
      setLoadingMsg("📡 Checking live market prices…");
      const pricePrompt = `You are an expert Australian reseller. Search for CURRENT selling prices for: "${ident.search_query}" in Australia.

Use your web_search tool to search:
1. Search eBay Australia SOLD listings: "${ident.search_query} site:ebay.com.au"
2. Search Depop Australia: "${ident.search_query} depop australia"
3. Search Facebook Marketplace Australia: "${ident.search_query} facebook marketplace australia"

After searching, return ONLY valid JSON with REAL prices you found:
{
  "market_searched": true,
  "sources_checked": ["eBay AU", "Depop", "Facebook Marketplace"],
  "live_prices_found": ["$X from eBay - condition", "$Y from Depop", "$Z from FB"],
  "resale_low": number (lowest realistic sell price AUD),
  "resale_high": number (highest realistic sell price AUD),
  "resale_avg": number (most likely sell price AUD),
  "op_shop_value": "What op shops typically charge e.g. $8-15",
  "best_platform": "Facebook Marketplace|eBay AU|Depop|Gumtree|Etsy AU|Vinted AU",
  "roi_percent": number (based on typical $15 op shop cost vs resale_avg),
  "pick_verdict": "BUY|MAYBE|PASS",
  "verdict_reason": "One sentence based on real market data found",
  "market_note": "One sentence summarising what the market looks like right now"
}`;

      const priceText = await callClaude([{
        role: "user", content: pricePrompt,
      }], true); // useWebSearch = true

      let priceData;
      try { priceData = parseJSON(priceText); }
      catch { 
        // Fallback if web search JSON parse fails
        priceData = {
          market_searched: false,
          sources_checked: [],
          live_prices_found: [],
          resale_low: 20, resale_high: 80, resale_avg: 45,
          op_shop_value: "$10-20",
          best_platform: "Facebook Marketplace",
          roi_percent: 200,
          pick_verdict: "MAYBE",
          verdict_reason: "Could not retrieve live prices — estimate based on category.",
          market_note: "Live price search unavailable. Values are estimates only.",
        };
      }

      setMarketData(priceData);

      const finalAnalysis = {
        ...ident,
        ...priceData,
        _scanId: scanId,
      };

      setAnalysis(finalAnalysis);
      setScreen("result");
    } catch (err) {
      setError("Scan failed: " + (err.message || "Try a clearer photo showing labels."));
    }
    setLoading(false); setLoadingMsg("");
  };

  const generateListing = async (platform) => {
    setSelPlatform(platform); setListLoading(true); setListing(null); setScreen("listing");
    try {
      const prompt = `You are an expert Australian reseller. Write a high-converting listing for ${platform.name}.

Item details: ${JSON.stringify({ ...analysis, ...marketData })}
Condition: ${condition}
Live market data: ${JSON.stringify(marketData?.live_prices_found || [])}

Optimise the price based on the live market data above.

Return ONLY valid JSON:
{
  "title": "Optimised listing title for ${platform.name} (punchy, keyword-rich, max 80 chars)",
  "price_suggestion": number (based on live market data),
  "price_reasoning": "One sentence why this price based on market",
  "description": "Full listing description using \\n for line breaks. Include: what it is, condition, key features, why it's special, pickup from Melbourne inner north or postage available. Genuine tone not spammy. 120-180 words.",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5","tag6"],
  "photo_tips": ["specific angle tip","lighting tip","detail tip","scale tip"],
  "negotiation_tip": "How to handle lowballers for this specific item",
  "best_time_to_post": "Best day/time to post this on ${platform.name} for maximum visibility"
}`;

      const text = await callClaude([{ role: "user", content: prompt }]);
      setListing(parseJSON(text));
    } catch {
      setError("Listing failed — try again.");
    }
    setListLoading(false);
  };

  const resetScan = () => {
    setScreen("home"); setImage(null); setImageB64(null);
    setAnalysis(null); setMarketData(null); setListing(null);
    setSelPlatform(null); setError(null); setCondition("Good");
  };

  const vc = (v) => ({ BUY:"#00C853", MAYBE:"#FFB300", PASS:"#FF3D00" })[v] || "#888";
  const rc = (r) => r >= 400 ? "#00C853" : r >= 150 ? "#FFB300" : "#FF6B35";

  const totalProfit = sales.reduce((a,s) => a + s.profit, 0);
  const totalSpent  = sales.reduce((a,s) => a + s.buyCost, 0);
  const totalRev    = sales.reduce((a,s) => a + s.sellPrice, 0);
  const avgROI      = sales.length ? Math.round(sales.reduce((a,s) => a + s.roi,0)/sales.length) : 0;

  // ─── SCAN TAB ───────────────────────────────────────────────────────────────

  const renderScanTab = () => {
    if (screen === "home") return (
      <div style={S.wrap}>
        <div style={S.logoRow}>
          <div>
            <div style={S.logoTitle}>PICKER PRO</div>
            <div style={S.logoSub}>Melbourne Op Shop Intelligence</div>
          </div>
          <span style={{ fontSize:32 }}>🏷️</span>
        </div>

        <div style={{ ...S.heroCard, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📸</div>
          <div style={{ fontSize:15, color:"#CCC", lineHeight:1.65 }}>
            Scan any item. Get live market prices,<br/>a BUY verdict, and a ready-to-post listing.
          </div>
        </div>

        <button style={{ ...S.btn, background:"#FF6B35" }} onClick={() => cameraRef.current.click()}>
          📷  Take a Photo
        </button>
        <button style={{ ...S.btn, background:"#222", border:"1px solid #444" }} onClick={() => fileRef.current.click()}>
          🖼️  Upload from Gallery
        </button>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
        <input ref={fileRef}   type="file" accept="image/*"                        style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

        <div style={S.tipRow}>
          <span style={{ color:"#FF6B35", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>💡 TIP</span>
          <span style={{ color:"#888", fontSize:12, lineHeight:1.5 }}>Include labels, tags, and brand markings in shot. More info = better prices.</span>
        </div>

        <div style={{ ...S.tipRow, background:"#0D1F0D" }}>
          <span style={{ color:"#00C853", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>📡 LIVE</span>
          <span style={{ color:"#888", fontSize:12, lineHeight:1.5 }}>Prices are cross-referenced against real eBay AU, Depop & Facebook listings in real time.</span>
        </div>

        {saved.length > 0 && (
          <div style={{ ...S.tipRow, cursor:"pointer" }} onClick={() => setTab("saved")}>
            <span style={{ color:"#00C853", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>📦 {saved.length}</span>
            <span style={{ color:"#888", fontSize:12 }}>item{saved.length!==1?"s":""} saved — tap to view</span>
          </div>
        )}
      </div>
    );

    if (screen === "scan") return (
      <div style={S.wrap}>
        <TopBar title="Review & Scan" onBack={resetScan} />
        <div style={S.previewBox}>
          <img src={image} alt="item" style={{ width:"100%", maxHeight:300, objectFit:"contain" }} />
        </div>
        <div>
          <div style={S.label}>Item Condition</div>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            {CONDITIONS.map(c => (
              <button key={c} style={{ ...S.condBtn, ...(condition===c?S.condOn:{}) }} onClick={() => setCondition(c)}>{c}</button>
            ))}
          </div>
        </div>
        {error && <div style={S.errBox}>{error}</div>}
        {loading ? (
          <div style={{ background:"#1A1A1A", border:"1px solid #333", borderRadius:14, padding:24, textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>
              {loadingMsg.startsWith("📡") ? "📡" : "🔍"}
            </div>
            <div style={{ color:"#FF6B35", fontWeight:700, fontSize:15, marginBottom:6 }}>{loadingMsg}</div>
            <div style={{ color:"#666", fontSize:12 }}>
              {loadingMsg.startsWith("📡") ? "Checking eBay AU, Depop & Facebook…" : "Reading brand, era, and features…"}
            </div>
            <div style={{ marginTop:14, height:3, background:"#222", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"#FF6B35", borderRadius:4, width: loadingMsg.startsWith("📡") ? "80%" : "40%", transition:"width 0.5s" }} />
            </div>
          </div>
        ) : (
          <button style={{ ...S.btn, background:"#FF6B35" }} onClick={analyseItem}>
            🔍  Identify + Get Live Prices
          </button>
        )}
        {!loading && <button style={S.ghost} onClick={resetScan}>Choose different photo</button>}
      </div>
    );

    if (screen === "result" && analysis) return (
      <div style={S.wrap}>
        <TopBar title="Analysis" onBack={resetScan} />

        {/* Verdict */}
        <div style={{ ...S.card, border:`2px solid ${vc(analysis.pick_verdict)}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ ...S.pill, background:vc(analysis.pick_verdict), fontSize:13, padding:"6px 14px" }}>
              {analysis.pick_verdict==="BUY"?"✅ BUY IT":analysis.pick_verdict==="MAYBE"?"🤔 MAYBE":"❌ PASS"}
            </span>
            {analysis.market_searched && (
              <span style={{ fontSize:11, color:"#00C853", fontWeight:700, background:"#0D1F0D", padding:"4px 10px", borderRadius:20 }}>
                📡 LIVE PRICES
              </span>
            )}
          </div>
          <div style={{ fontSize:14, color:"#CCC", lineHeight:1.55 }}>{analysis.verdict_reason}</div>
          {analysis.market_note && (
            <div style={{ fontSize:12, color:"#888", fontStyle:"italic" }}>{analysis.market_note}</div>
          )}
          <button style={{ ...S.smallBtn, background:"#1F3A20", color:"#00C853", border:"1px solid #00C853", alignSelf:"flex-start" }} onClick={saveItem}>
            📦 Save Item
          </button>
        </div>

        {/* ID Card */}
        <div style={S.card}>
          <div style={{ display:"flex", gap:14 }}>
            <img src={image} alt="" style={{ width:72, height:72, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
              <div style={{ fontSize:16, fontWeight:700, color:"#F0F0F0", lineHeight:1.3 }}>{analysis.name}</div>
              {analysis.brand && <div style={{ fontSize:13, fontWeight:600, color:"#FF6B35" }}>{analysis.brand}</div>}
              {analysis.model && <div style={{ fontSize:12, color:"#AAA" }}>{analysis.model}</div>}
              {analysis.era   && <div style={{ fontSize:12, color:"#888" }}>{analysis.era}</div>}
              <span style={S.catPill}>{analysis.category}</span>
            </div>
          </div>
          <div style={{ fontSize:12, color:"#666", borderTop:"1px solid #2A2A2A", paddingTop:8, lineHeight:1.5 }}>
            <b style={{ color:"#AAA" }}>Condition: {condition}</b> — {analysis.condition_note}
          </div>
        </div>

        {/* Live Valuation */}
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={S.label}>💰 Valuation</div>
            {analysis.market_searched && <span style={{ fontSize:10, color:"#00C853", fontWeight:700 }}>LIVE DATA</span>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              ["Op Shop Pay",  analysis.op_shop_value,                         "#F0F0F0"],
              ["Resale Range", `$${analysis.resale_low}–$${analysis.resale_high}`, "#F0F0F0"],
              ["Avg Sell",     `$${analysis.resale_avg}`,                      "#FF6B35"],
              ["Est. ROI",     `${analysis.roi_percent}%`,                     rc(analysis.roi_percent)],
            ].map(([lbl,val,col]) => (
              <div key={lbl} style={{ background:"#222", borderRadius:10, padding:12 }}>
                <div style={{ fontSize:10, color:"#666", textTransform:"uppercase", fontWeight:700, letterSpacing:"0.06em", marginBottom:4 }}>{lbl}</div>
                <div style={{ fontSize:18, fontWeight:800, color:col }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Live prices found */}
          {analysis.live_prices_found?.length > 0 && (
            <div style={{ borderTop:"1px solid #2A2A2A", paddingTop:10 }}>
              <div style={{ fontSize:11, color:"#00C853", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>
                📡 Real Listings Found
              </div>
              {analysis.live_prices_found.map((p,i) => (
                <div key={i} style={{ fontSize:12, color:"#BBB", lineHeight:1.6 }}>• {p}</div>
              ))}
            </div>
          )}

          <div style={{ display:"flex", gap:8, borderTop:"1px solid #2A2A2A", paddingTop:10 }}>
            <span style={{ fontSize:11, color:"#666", fontWeight:700, textTransform:"uppercase" }}>Best platform:</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#FF6B35" }}>{analysis.best_platform}</span>
          </div>
        </div>

        {/* Features */}
        <div style={S.card}>
          <div style={S.label}>✅ Key Features</div>
          {analysis.key_features?.map((f,i) => (
            <div key={i} style={{ fontSize:13, color:"#CCC", lineHeight:1.6 }}><span style={{ color:"#00C853" }}>•</span> {f}</div>
          ))}
          {analysis.red_flags?.length > 0 && <>
            <div style={{ ...S.label, marginTop:6, color:"#FF6B35" }}>⚠️ Watch Out For</div>
            {analysis.red_flags.map((f,i) => (
              <div key={i} style={{ fontSize:13, color:"#CCC", lineHeight:1.6 }}><span style={{ color:"#FF6B35" }}>•</span> {f}</div>
            ))}
          </>}
        </div>

        {/* Tips */}
        <div style={S.card}>
          <div style={S.label}>🧠 Picker Tips</div>
          {analysis.tips?.map((t,i) => (
            <div key={i} style={{ fontSize:13, color:"#BBB", lineHeight:1.7 }}>{i+1}. {t}</div>
          ))}
        </div>

        {/* Listing Generator */}
        <div style={S.card}>
          <div style={S.label}>📣 Generate Listing For…</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} style={{ ...S.platformBtn, borderColor:p.color }} onClick={() => generateListing(p)}>
                <span style={{ fontSize:20 }}>{p.icon}</span>
                <span style={{ fontSize:14, fontWeight:700, color:"#EEE", flex:1, textAlign:"left" }}>{p.name}</span>
                <span style={{ fontSize:12, color:"#555" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (screen === "listing") return (
      <div style={S.wrap}>
        <TopBar title={`${selPlatform?.icon} ${selPlatform?.name}`} onBack={() => setScreen("result")} />

        {listLoading && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>✍️</div>
            <div style={{ color:"#FF6B35", fontWeight:700, fontSize:15, marginBottom:4 }}>Writing your listing…</div>
            <div style={{ color:"#666", fontSize:12 }}>Using live market data to set the best price</div>
          </div>
        )}

        {listing && <>
          {/* Price */}
          <div style={{ background:"#1F1410", border:"2px solid #FF6B35", borderRadius:14, padding:20, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#FF6B35", textTransform:"uppercase", fontWeight:700, letterSpacing:"0.1em", marginBottom:4 }}>Suggested Price</div>
            <div style={{ fontSize:38, fontWeight:900, color:"#FF6B35" }}>${listing.price_suggestion}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:4 }}>{listing.price_reasoning}</div>
          </div>

          {listing.best_time_to_post && (
            <div style={{ ...S.tipRow, background:"#0D1A2A" }}>
              <span style={{ color:"#4A9EFF", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>🕐 POST</span>
              <span style={{ color:"#888", fontSize:12 }}>{listing.best_time_to_post}</span>
            </div>
          )}

          {/* Title */}
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={S.label}>Title</div>
              <button style={S.copyBtn} onClick={() => copyText(listing.title,"title")}>{copied==="title"?"✅ Copied":"📋 Copy"}</button>
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:"#F0F0F0", lineHeight:1.4 }}>{listing.title}</div>
          </div>

          {/* Description */}
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={S.label}>Description</div>
              <button style={S.copyBtn} onClick={() => copyText(listing.description,"desc")}>{copied==="desc"?"✅ Copied":"📋 Copy"}</button>
            </div>
            <div style={{ fontSize:13, color:"#CCC", lineHeight:1.75, whiteSpace:"pre-wrap", background:"#222", borderRadius:10, padding:12 }}>{listing.description}</div>
          </div>

          {/* Hashtags */}
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={S.label}>Hashtags</div>
              <button style={S.copyBtn} onClick={() => copyText(listing.hashtags.map(h=>`#${h}`).join(" "),"tags")}>{copied==="tags"?"✅ Copied":"📋 Copy"}</button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {listing.hashtags.map((h,i) => (
                <span key={i} style={{ background:"#2A2A2A", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#FF6B35", fontWeight:600 }}>#{h}</span>
              ))}
            </div>
          </div>

          {/* Photo Tips */}
          <div style={S.card}>
            <div style={S.label}>📸 Photo Tips</div>
            {listing.photo_tips.map((t,i) => (
              <div key={i} style={{ fontSize:13, color:"#BBB", lineHeight:1.65 }}>{i+1}. {t}</div>
            ))}
          </div>

          {/* Lowballer tip */}
          <div style={S.card}>
            <div style={S.label}>🤝 Lowballer Handling</div>
            <div style={{ fontSize:13, color:"#CCC", lineHeight:1.6, background:"#222", borderRadius:10, padding:12, fontStyle:"italic" }}>{listing.negotiation_tip}</div>
          </div>

          <button style={{ ...S.btn, background:"#FF6B35" }} onClick={() => setScreen("result")}>← Try Another Platform</button>
          <button style={S.ghost} onClick={resetScan}>Scan New Item</button>
        </>}
      </div>
    );
  };

  // ─── SAVED TAB ──────────────────────────────────────────────────────────────

  const renderSavedTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}>
        <div style={{ fontSize:20, fontWeight:800, color:"#F0F0F0" }}>📦 Saved Items</div>
        <span style={{ fontSize:13, color:"#888" }}>{saved.length} item{saved.length!==1?"s":""}</span>
      </div>

      {saved.length===0 && (
        <div style={{ ...S.heroCard, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
          <div style={{ fontSize:14, color:"#888", lineHeight:1.6 }}>Nothing saved yet. Scan an item and tap Save Item.</div>
        </div>
      )}

      {saved.map(item => (
        <div key={item.id} style={S.card}>
          <div style={{ display:"flex", gap:12 }}>
            <img src={item.image} alt="" style={{ width:64, height:64, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#F0F0F0", lineHeight:1.3 }}>{item.analysis.name}</div>
              {item.analysis.brand && <div style={{ fontSize:12, color:"#FF6B35", fontWeight:600 }}>{item.analysis.brand}</div>}
              <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{item.date} · {item.condition}</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#00C853", marginTop:3 }}>~${item.analysis.resale_avg} AUD</div>
              {item.analysis.market_searched && (
                <span style={{ fontSize:10, color:"#00C853", fontWeight:700 }}>📡 live priced</span>
              )}
            </div>
            <span style={{ ...S.pill, background:vc(item.analysis.pick_verdict), fontSize:10, padding:"3px 9px", alignSelf:"flex-start" }}>
              {item.analysis.pick_verdict}
            </span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ ...S.smallBtn, background:"#1A3320", color:"#00C853", border:"1px solid #00C853", flex:1 }} onClick={() => markSold(item)}>
              💸 Mark Sold
            </button>
            <button style={{ ...S.smallBtn, background:"#2A1A1A", color:"#FF3D00", border:"1px solid #FF3D00" }} onClick={() => deleteItem(item.id)}>
              🗑️
            </button>
          </div>
        </div>
      ))}

      {saleModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 }}>
          <div style={{ background:"#1A1A1A", border:"1px solid #333", borderRadius:18, padding:24, width:"100%", maxWidth:380, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#F0F0F0" }}>Record Sale 💸</div>
            <div style={{ fontSize:13, color:"#888" }}>{saleModal.analysis.name}</div>
            <div>
              <div style={S.label}>Sell Price (AUD)</div>
              <input style={S.input} type="number" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder="e.g. 85" />
            </div>
            <div>
              <div style={S.label}>What You Paid (AUD)</div>
              <input style={S.input} type="number" value={saleCost} onChange={e=>setSaleCost(e.target.value)} placeholder="e.g. 12" />
            </div>
            {salePrice && saleCost && (
              <div style={{ background:"#0D1F0D", borderRadius:10, padding:"12px 14px", display:"flex", gap:24 }}>
                <div>
                  <div style={{ fontSize:10, color:"#666", textTransform:"uppercase", fontWeight:700 }}>Profit</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#00C853" }}>${(parseFloat(salePrice)-parseFloat(saleCost)).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"#666", textTransform:"uppercase", fontWeight:700 }}>ROI</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#00C853" }}>
                    {parseFloat(saleCost)>0?Math.round(((parseFloat(salePrice)-parseFloat(saleCost))/parseFloat(saleCost))*100):0}%
                  </div>
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...S.btn, flex:1, background:"#00C853", padding:13 }} onClick={confirmSale}>Confirm Sale</button>
              <button style={{ ...S.btn, flex:1, background:"#2A2A2A", border:"1px solid #444", padding:13 }} onClick={()=>setSaleModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── TRACKER TAB ────────────────────────────────────────────────────────────

  const renderTrackerTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}>
        <div style={{ fontSize:20, fontWeight:800, color:"#F0F0F0" }}>💰 Profit Tracker</div>
        <span style={{ fontSize:13, color:"#888" }}>{sales.length} sale{sales.length!==1?"s":""}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          ["Total Profit",  `$${totalProfit.toFixed(2)}`,  "#00C853"],
          ["Avg ROI",       `${avgROI}%`,                  rc(avgROI)],
          ["Total Revenue", `$${totalRev.toFixed(2)}`,     "#FF6B35"],
          ["Total Spent",   `$${totalSpent.toFixed(2)}`,   "#888"],
        ].map(([lbl,val,col]) => (
          <div key={lbl} style={{ background:"#1A1A1A", border:"1px solid #2A2A2A", borderRadius:12, padding:14 }}>
            <div style={{ fontSize:10, color:"#666", textTransform:"uppercase", fontWeight:700, letterSpacing:"0.06em", marginBottom:4 }}>{lbl}</div>
            <div style={{ fontSize:22, fontWeight:800, color:col }}>{val}</div>
          </div>
        ))}
      </div>

      {sales.length===0 && (
        <div style={{ ...S.heroCard, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📊</div>
          <div style={{ fontSize:14, color:"#888", lineHeight:1.6 }}>No sales yet. Save items and mark them as sold.</div>
        </div>
      )}

      {sales.map(s => (
        <div key={s.id} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#F0F0F0" }}>{s.name}</div>
              {s.brand && <div style={{ fontSize:12, color:"#FF6B35" }}>{s.brand}</div>}
              <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{s.date}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#00C853" }}>+${s.profit.toFixed(2)}</div>
              <div style={{ fontSize:12, color:"#888" }}>{s.roi}% ROI</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:16, borderTop:"1px solid #2A2A2A", paddingTop:8, fontSize:12, color:"#666" }}>
            <span>Bought: <b style={{ color:"#AAA" }}>${s.buyCost}</b></span>
            <span>Sold: <b style={{ color:"#AAA" }}>${s.sellPrice}</b></span>
          </div>
        </div>
      ))}

      {sales.length>0 && (
        <button style={{ ...S.ghost, color:"#FF3D00", borderColor:"#FF3D00" }}
          onClick={() => { if(window.confirm("Clear all sales history?")) setSales([]); }}>
          Clear History
        </button>
      )}
    </div>
  );

  // ─── GUIDE TAB ──────────────────────────────────────────────────────────────

  const renderGuideTab = () => {
    if (activeGuide) {
      const guide = QUICK_GUIDES.find(g => g.id===activeGuide);
      return (
        <div style={S.wrap}>
          <TopBar title={`${guide.icon} ${guide.title}`} onBack={() => setActiveGuide(null)} />
          {guide.content.map((sec,si) => (
            <div key={si} style={S.card}>
              <div style={S.label}>{sec.title}</div>
              {sec.items.map((item,ii) => (
                <div key={ii} style={{ display:"flex", justifyContent:"space-between", gap:12, borderBottom: ii<sec.items.length-1?"1px solid #222":"none", paddingBottom: ii<sec.items.length-1?10:0, marginBottom: ii<sec.items.length-1?10:0 }}>
                  <div style={{ fontSize:13, color:"#CCC", flex:1, lineHeight:1.5 }}>{item.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#FF6B35", textAlign:"right" }}>{item.value}</div>
                </div>
              ))}
            </div>
          ))}
          <div style={S.tipRow}>
            <span style={{ color:"#FF6B35", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>💡</span>
            <span style={{ color:"#888", fontSize:12 }}>Screenshot this page before heading out — works offline.</span>
          </div>
        </div>
      );
    }

    return (
      <div style={S.wrap}>
        <div style={{ fontSize:20, fontWeight:800, color:"#F0F0F0" }}>📖 Picker Guides</div>
        <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>Quick-reference cheat sheets for the op shop floor. Screenshot before you go — works offline.</div>
        {QUICK_GUIDES.map(g => (
          <button key={g.id} style={{ ...S.card, cursor:"pointer", flexDirection:"row", alignItems:"center", gap:14 }} onClick={() => setActiveGuide(g.id)}>
            <span style={{ fontSize:30 }}>{g.icon}</span>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F0F0F0" }}>{g.title}</div>
              <div style={{ fontSize:12, color:"#666", marginTop:2 }}>Tap to open cheat sheet</div>
            </div>
            <span style={{ color:"#444", fontSize:18 }}>›</span>
          </button>
        ))}
      </div>
    );
  };

  // ─── ROOT ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight:"100vh", background:"#111", color:"#F0F0F0", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, overflowY:"auto", paddingBottom:82 }}>
        {tab==="scan"    && renderScanTab()}
        {tab==="saved"   && renderSavedTab()}
        {tab==="tracker" && renderTrackerTab()}
        {tab==="guide"   && renderGuideTab()}
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#161616", borderTop:"1px solid #252525", display:"flex", justifyContent:"space-around", padding:"10px 0 20px" }}>
        {TABS.map(t => (
          <button key={t.id} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"4px 16px" }}
            onClick={() => { setTab(t.id); if(t.id==="scan") resetScan(); }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:11, fontWeight:700, color:tab===t.id?"#FF6B35":"#444", letterSpacing:"0.03em" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopBar({ title, onBack }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:12, borderBottom:"1px solid #222", marginBottom:4 }}>
      <button style={{ background:"none", border:"none", color:"#FF6B35", fontSize:14, cursor:"pointer", padding:0, fontWeight:600 }} onClick={onBack}>← Back</button>
      <span style={{ fontSize:15, fontWeight:700, color:"#F0F0F0" }}>{title}</span>
      <span style={{ width:44 }} />
    </div>
  );
}

const S = {
  wrap:       { maxWidth:480, margin:"0 auto", padding:"18px 16px 8px", display:"flex", flexDirection:"column", gap:14 },
  logoRow:    { display:"flex", alignItems:"center", justifyContent:"space-between" },
  logoTitle:  { fontSize:22, fontWeight:900, letterSpacing:"0.1em", color:"#FF6B35" },
  logoSub:    { fontSize:10, color:"#555", letterSpacing:"0.06em", textTransform:"uppercase" },
  heroCard:   { background:"#1A1A1A", border:"1px solid #2A2A2A", borderRadius:16, padding:"22px 18px" },
  card:       { background:"#1A1A1A", border:"1px solid #2A2A2A", borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:10 },
  btn:        { width:"100%", padding:"15px", borderRadius:12, border:"none", fontSize:16, fontWeight:700, color:"#fff", cursor:"pointer", letterSpacing:"0.01em" },
  ghost:      { width:"100%", padding:"13px", borderRadius:12, border:"1px solid #2A2A2A", fontSize:14, color:"#666", background:"transparent", cursor:"pointer" },
  label:      { fontSize:11, fontWeight:700, color:"#666", textTransform:"uppercase", letterSpacing:"0.08em" },
  pill:       { display:"inline-block", padding:"5px 12px", borderRadius:30, fontSize:12, fontWeight:800, color:"#fff", alignSelf:"flex-start" },
  catPill:    { alignSelf:"flex-start", background:"#252525", borderRadius:20, padding:"3px 10px", fontSize:11, color:"#888", fontWeight:600, marginTop:2 },
  condBtn:    { flex:1, padding:"10px 2px", borderRadius:10, border:"1px solid #2A2A2A", background:"#1A1A1A", color:"#666", fontSize:12, cursor:"pointer", fontWeight:600 },
  condOn:     { borderColor:"#FF6B35", color:"#FF6B35", background:"#1F1410" },
  previewBox: { width:"100%", borderRadius:14, overflow:"hidden", border:"1px solid #2A2A2A", background:"#1A1A1A", maxHeight:300, display:"flex", alignItems:"center", justifyContent:"center" },
  platformBtn:{ display:"flex", alignItems:"center", gap:12, background:"#1F1F1F", border:"1px solid", borderRadius:12, padding:"13px 14px", cursor:"pointer", width:"100%" },
  smallBtn:   { padding:"9px 14px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", background:"transparent" },
  copyBtn:    { background:"#252525", border:"1px solid #333", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#AAA", cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" },
  tipRow:     { display:"flex", alignItems:"flex-start", gap:10, background:"#1A1A1A", borderRadius:10, padding:"11px 14px" },
  errBox:     { background:"#1F1010", border:"1px solid #FF3D00", borderRadius:10, padding:"12px 14px", color:"#FF6B35", fontSize:13, lineHeight:1.5 },
  input:      { width:"100%", background:"#222", border:"1px solid #333", borderRadius:10, padding:"12px 14px", fontSize:15, color:"#F0F0F0", marginTop:6, boxSizing:"border-box", outline:"none" },
};
