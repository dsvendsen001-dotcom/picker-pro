import { useState, useRef, useEffect, useCallback } from "react";

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
  { id: "video",   label: "Video",   icon: "🎬" },
  { id: "batch",   label: "Haul",    icon: "🎯" },
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
      { title: "Grab Immediately", items: [
        { label: "Canon AE-1 / AE-1 Program", value: "$80–$200" },
        { label: "Olympus OM-1, OM-10", value: "$60–$180" },
        { label: "Pentax K1000, ME Super", value: "$60–$150" },
        { label: "Minolta X-series", value: "$40–$120" },
        { label: "Yashica / Ricoh compacts", value: "$30–$80" },
        { label: "Polaroid SX-70 or 600", value: "$60–$200" },
      ]},
      { title: "30-Second Check", items: [
        { label: "Film advance lever", value: "Cocks the shutter?" },
        { label: "Shutter fires", value: "All speeds vary?" },
        { label: "Light seals", value: "Not crumbling/sticky?" },
        { label: "Lens glass", value: "No fungus/haze/scratches?" },
        { label: "Light meter", value: "Needle moves?" },
      ]},
    ],
  },
  {
    id: "ceramics", title: "Ceramics & Pottery", icon: "🏺",
    content: [
      { title: "Australian — Check Base", items: [
        { label: "Remued", value: "Emu mark → $30–$300+" },
        { label: "Diana Pottery", value: "Signed → $20–$150" },
        { label: "Bendigo (vintage only)", value: "$15–$80" },
        { label: "Signed studio pottery", value: "Research name on spot" },
      ]},
      { title: "Scandinavian Sleepers", items: [
        { label: "Arabia (Finland)", value: "Crown mark → $40–$200" },
        { label: "Rörstrand (Sweden)", value: "$30–$150" },
        { label: "Iittala glassware", value: "$20–$80" },
        { label: "Le Creuset cast iron", value: "$60–$200" },
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
        { label: "Knobs & switches", value: "No crackling?" },
        { label: "Both channels", value: "Working?" },
        { label: "Weight test", value: "Heavy = better transformer" },
      ]},
    ],
  },
  {
    id: "watches", title: "Watches", icon: "⌚",
    content: [
      { title: "Flip It Over", items: [
        { label: "Seiko automatic", value: "'17 jewels' → $40–$300" },
        { label: "Citizen automatic", value: "$30–$200" },
        { label: "Omega (any)", value: "$200–$2000+" },
        { label: "Longines / Tissot", value: "$80–$500" },
        { label: "Casio G-Shock vintage", value: "$50–$300" },
      ]},
      { title: "Quick Check", items: [
        { label: "Crown winds smoothly", value: "Yes?" },
        { label: "Seconds hand moves", value: "Smoothly?" },
        { label: "Crystal", value: "Scratched/cracked?" },
        { label: "Case", value: "Dents or corrosion?" },
      ]},
    ],
  },
  {
    id: "brands", title: "Brand Cheat Sheet", icon: "🏷️",
    content: [
      { title: "Clothing — Always Pick Up", items: [
        { label: "Carhartt work jackets", value: "$60–$200" },
        { label: "Patagonia fleece/puffer", value: "$80–$250" },
        { label: "Arc'teryx anything", value: "$150–$500+" },
        { label: "Ralph Lauren vintage", value: "$40–$150" },
        { label: "Vintage Adidas tracksuit", value: "$40–$120" },
        { label: "Driza-Bone oilskin", value: "$80–$300" },
        { label: "R.M. Williams boots", value: "$100–$400" },
      ]},
      { title: "Homewares Sleepers", items: [
        { label: "Le Creuset cast iron", value: "$60–$250" },
        { label: "Staub cookware", value: "$50–$180" },
        { label: "Vintage Pyrex (patterned)", value: "$20–$120" },
        { label: "Villeroy & Boch china", value: "$30–$150" },
        { label: "Wedgwood pieces", value: "$20–$200" },
      ]},
    ],
  },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const loadLS  = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const saveLS  = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ─── API ─────────────────────────────────────────────────────────────────────

async function callClaude(messages, useWebSearch = false) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, useWebSearch }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  if (data._textContent) return data._textContent;
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  return JSON.parse(clean.slice(start, end + 1));
}

// ─── IMAGE COMPRESSION ───────────────────────────────────────────────────────

async function compressImage(file, maxPx = 1200, quality = 0.85) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", quality);
  return new Promise(res => canvas.toBlob(blob => {
    const reader = new FileReader();
    reader.onload = () => res({ url, b64: reader.result.split(",")[1] });
    reader.readAsDataURL(blob);
  }, "image/jpeg", quality));
}

// Extract frames from video at regular intervals
async function extractVideoFrames(videoFile, maxFrames = 12) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      const frameCount = Math.min(maxFrames, Math.floor(duration));
      const interval = duration / (frameCount + 1);
      const frames = [];
      let captured = 0;

      const captureFrame = (time) => {
        return new Promise(res => {
          video.currentTime = time;
          video.addEventListener("seeked", function handler() {
            video.removeEventListener("seeked", handler);
            const canvas = document.createElement("canvas");
            const MAX = 800;
            const scale = Math.min(1, MAX / Math.max(video.videoWidth, video.videoHeight));
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgUrl = canvas.toDataURL("image/jpeg", 0.8);
            canvas.toBlob(blob => {
              const reader = new FileReader();
              reader.onload = () => res({ url: imgUrl, b64: reader.result.split(",")[1], time: time.toFixed(1) });
              reader.readAsDataURL(blob);
            }, "image/jpeg", 0.8);
          }, { once: true });
        });
      };

      const captureAll = async () => {
        for (let i = 1; i <= frameCount; i++) {
          const frame = await captureFrame(interval * i);
          frames.push(frame);
        }
        URL.revokeObjectURL(url);
        resolve(frames);
      };

      captureAll().catch(reject);
    });

    video.addEventListener("error", reject);
    video.load();
  });
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function PickerPro() {
  // Core scan state
  const [tab, setTab]                   = useState("scan");
  const [screen, setScreen]             = useState("home");
  const [image, setImage]               = useState(null);
  const [imageB64, setImageB64]         = useState(null);
  const [condition, setCondition]       = useState("Good");
  const [loading, setLoading]           = useState(false);
  const [loadingMsg, setLoadingMsg]     = useState("");
  const [analysis, setAnalysis]         = useState(null);
  const [marketData, setMarketData]     = useState(null);
  const [selPlatform, setSelPlatform]   = useState(null);
  const [listing, setListing]           = useState(null);
  const [listLoading, setListLoading]   = useState(false);
  const [copied, setCopied]             = useState(null);
  const [error, setError]               = useState(null);

  // Saved & sales
  const [saved, setSaved]               = useState(() => loadLS("pp_saved", []));
  const [sales, setSales]               = useState(() => loadLS("pp_sales", []));
  const [saleModal, setSaleModal]       = useState(null);
  const [salePrice, setSalePrice]       = useState("");
  const [saleCost, setSaleCost]         = useState("");

  // Guide
  const [activeGuide, setActiveGuide]   = useState(null);

  // Batch state
  const [batchPhotos, setBatchPhotos]   = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // Video state
  const [videoFile, setVideoFile]       = useState(null);
  const [videoThumb, setVideoThumb]     = useState(null);
  const [videoFrames, setVideoFrames]   = useState([]);
  const [videoResults, setVideoResults] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoStage, setVideoStage]     = useState("idle"); // idle|extracting|analysing|done
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTotal, setVideoTotal]     = useState(0);

  // Refs
  const fileRef      = useRef();
  const cameraRef    = useRef();
  const batchCamRef  = useRef();
  const batchFileRef = useRef();
  const videoRef     = useRef();

  useEffect(() => saveLS("pp_saved", saved), [saved]);
  useEffect(() => saveLS("pp_sales", sales), [sales]);

  // ── Helpers ──
  const toB64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  const vc = (v) => ({ BUY:"#00C853", MAYBE:"#FFB300", PASS:"#FF3D00" })[v] || "#888";
  const rc = (r) => r >= 400 ? "#00C853" : r >= 150 ? "#FFB300" : "#FF6B35";

  const totalProfit = sales.reduce((a,s) => a + s.profit, 0);
  const totalSpent  = sales.reduce((a,s) => a + s.buyCost, 0);
  const totalRev    = sales.reduce((a,s) => a + s.sellPrice, 0);
  const avgROI      = sales.length ? Math.round(sales.reduce((a,s) => a + s.roi,0)/sales.length) : 0;

  // ── Scan helpers ──
  const handleFile = async (file) => {
    if (!file) return;
    const { url, b64 } = await compressImage(file);
    setImage(url); setImageB64(b64); setScreen("scan");
  };

  const resetScan = () => {
    setScreen("home"); setImage(null); setImageB64(null);
    setAnalysis(null); setMarketData(null); setListing(null);
    setSelPlatform(null); setError(null); setCondition("Good");
  };

  // ── Saved ──
  const saveItem = (a, img, cond) => {
    const id = a._scanId || Date.now();
    if (saved.find(i => i.id === id)) return;
    setSaved(prev => [{ id, date: new Date().toLocaleDateString("en-AU"), image: img||image, analysis: a, marketData, condition: cond||condition }, ...prev]);
  };

  const deleteItem = (id) => setSaved(prev => prev.filter(i => i.id !== id));

  const markSold = (item) => { setSaleModal(item); setSalePrice(String(item.analysis.resale_avg||0)); setSaleCost("15"); };

  const confirmSale = () => {
    const sp = parseFloat(salePrice)||0, sc = parseFloat(saleCost)||0;
    setSales(prev => [{ id:Date.now(), date:new Date().toLocaleDateString("en-AU"), name:saleModal.analysis.name, brand:saleModal.analysis.brand, sellPrice:sp, buyCost:sc, profit:sp-sc, roi:sc>0?Math.round(((sp-sc)/sc)*100):0 }, ...prev]);
    setSaved(prev => prev.filter(i => i.id !== saleModal.id));
    setSaleModal(null);
  };

  // ── SINGLE ITEM ANALYSIS ──
  const analyseItem = async () => {
    setLoading(true); setError(null); setMarketData(null);
    const scanId = Date.now();
    try {
      setLoadingMsg("🔍 Identifying item…");
      const identText = await callClaude([{ role:"user", content:[
        { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:imageB64 } },
        { type:"text", text:`You are an expert Australian op shop picker. Analyse this image precisely.
Return ONLY valid JSON:
{
  "name":"Item name",
  "brand":"Brand or null",
  "era":"Era or null",
  "model":"Model or null",
  "category":"Denim|Camera|Ceramics|Audio|Clothing|Homewares|Books|Toys|Watches|Footwear|Sporting|Other",
  "search_query":"Best eBay AU search query to find this selling now",
  "confidence":"high|medium|low",
  "condition_note":"What to check given condition is ${condition}",
  "key_features":["f1","f2","f3"],
  "red_flags":["flag1","flag2"],
  "tips":["tip1","tip2","tip3"]
}` }
      ]}]);
      const ident = parseJSON(identText);

      setLoadingMsg("📡 Checking live market prices…");
      const priceText = await callClaude([{ role:"user", content:`You are an expert Australian reseller. Search for CURRENT selling prices for: "${ident.search_query}" in Australia.

Search eBay AU sold listings, Depop Australia, and Facebook Marketplace Australia.

Return ONLY valid JSON:
{
  "market_searched":true,
  "sources_checked":["eBay AU","Depop","Facebook Marketplace"],
  "live_prices_found":["$X from eBay - condition desc","$Y from Depop","$Z FB Marketplace"],
  "resale_low":number,
  "resale_high":number,
  "resale_avg":number,
  "op_shop_value":"e.g. $8-15",
  "best_platform":"Facebook Marketplace|eBay AU|Depop|Gumtree|Etsy AU|Vinted AU",
  "roi_percent":number,
  "pick_verdict":"BUY|MAYBE|PASS",
  "verdict_reason":"One sentence based on real market data",
  "market_note":"One sentence on current market"
}` }], true);

      let priceData;
      try { priceData = parseJSON(priceText); }
      catch { priceData = { market_searched:false, sources_checked:[], live_prices_found:[], resale_low:20, resale_high:80, resale_avg:45, op_shop_value:"$10-20", best_platform:"Facebook Marketplace", roi_percent:200, pick_verdict:"MAYBE", verdict_reason:"Could not retrieve live prices — estimate only.", market_note:"Live search unavailable." }; }

      setMarketData(priceData);
      setAnalysis({ ...ident, ...priceData, _scanId:scanId });
      setScreen("result");
    } catch(err) {
      setError("Scan failed: " + (err.message || "Try a clearer photo."));
    }
    setLoading(false); setLoadingMsg("");
  };

  // ── LISTING GENERATION ──
  const generateListing = async (platform) => {
    setSelPlatform(platform); setListLoading(true); setListing(null); setScreen("listing");
    try {
      const text = await callClaude([{ role:"user", content:`Expert Australian reseller. Write a high-converting listing for ${platform.name}.

Item: ${JSON.stringify({...analysis,...marketData})}
Condition: ${condition}
Live market data: ${JSON.stringify(marketData?.live_prices_found||[])}

Return ONLY valid JSON:
{
  "title":"Optimised title for ${platform.name} max 80 chars",
  "price_suggestion":number,
  "price_reasoning":"One sentence why this price",
  "description":"Full listing 120-180 words using \\n for line breaks. Include what it is, condition, key features, why special, pickup Melbourne or postage available. Genuine not spammy.",
  "hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],
  "photo_tips":["angle tip","lighting tip","detail tip","scale tip"],
  "negotiation_tip":"How to handle lowballers for this specific item",
  "best_time_to_post":"Best day/time for ${platform.name}"
}` }]);
      setListing(parseJSON(text));
    } catch { setError("Listing failed — try again."); }
    setListLoading(false);
  };

  // ── BATCH ANALYSIS ──
  const addBatchPhoto = async (file) => {
    if (!file) return;
    const { url, b64 } = await compressImage(file, 800, 0.8);
    setBatchPhotos(prev => [...prev, { id:Date.now(), img:url, b64 }]);
  };

  const runBatchAnalysis = async () => {
    if (!batchPhotos.length) return;
    setBatchLoading(true); setBatchResults([]); setBatchProgress(0);
    const results = [];
    for (let i = 0; i < batchPhotos.length; i++) {
      setBatchProgress(i+1);
      const photo = batchPhotos[i];
      try {
        const text = await callClaude([{ role:"user", content:[
          { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:photo.b64 } },
          { type:"text", text:`Quick Australian op shop resale assessment. Return ONLY valid JSON:
{"name":"Item name","brand":"Brand or null","category":"Category","resale_low":number,"resale_high":number,"resale_avg":number,"op_shop_value":"e.g. $5-15","roi_percent":number,"pick_verdict":"BUY|MAYBE|PASS","verdict_reason":"One sentence","best_platform":"Best platform"}` }
        ]}]);
        results.push({ ...parseJSON(text), id:photo.id, img:photo.img });
      } catch {
        results.push({ id:photo.id, img:photo.img, name:"Could not identify", brand:null, resale_avg:0, resale_low:0, resale_high:0, roi_percent:0, pick_verdict:"PASS", verdict_reason:"Image unclear — try closer photo", op_shop_value:"Unknown", best_platform:"—" });
      }
    }
    const order = { BUY:0, MAYBE:1, PASS:2 };
    results.sort((a,b) => order[a.pick_verdict]!==order[b.pick_verdict] ? order[a.pick_verdict]-order[b.pick_verdict] : b.resale_avg-a.resale_avg);
    setBatchResults(results); setBatchLoading(false); setBatchProgress(0);
  };

  const saveBatchItem = (item) => {
    if (saved.find(s => s.id === item.id)) return;
    setSaved(prev => [{ id:item.id, date:new Date().toLocaleDateString("en-AU"), image:item.img, analysis:item, marketData:null, condition:"Good" }, ...prev]);
  };

  // ── VIDEO ANALYSIS ──
  const handleVideoFile = async (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoResults([]); setVideoFrames([]); setVideoStage("idle");
    // Thumbnail from first frame
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.src = url; vid.muted = true;
    vid.addEventListener("loadeddata", () => {
      vid.currentTime = 0.1;
      vid.addEventListener("seeked", () => {
        const c = document.createElement("canvas");
        c.width = 200; c.height = 150;
        c.getContext("2d").drawImage(vid, 0, 0, 200, 150);
        setVideoThumb(c.toDataURL("image/jpeg", 0.8));
        URL.revokeObjectURL(url);
      }, { once:true });
    }, { once:true });
    vid.load();
  };

  const runVideoAnalysis = async () => {
    if (!videoFile) return;
    setVideoLoading(true); setVideoResults([]); setVideoStage("extracting"); setVideoProgress(0);

    try {
      // Step 1: Extract frames
      const frames = await extractVideoFrames(videoFile, 12);
      setVideoFrames(frames);
      setVideoTotal(frames.length);
      setVideoStage("analysing");

      // Step 2: Send ALL frames to Claude at once for efficiency
      setVideoProgress(1);
      const frameContent = frames.map((f, i) => ([
        { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:f.b64 } },
        { type:"text", text:`Frame ${i+1} at ${f.time}s` }
      ])).flat();

      const text = await callClaude([{ role:"user", content:[
        ...frameContent,
        { type:"text", text:`You are an expert Australian op shop picker. These are frames extracted from a video walk-through of an op shop or pile of items.

Identify EVERY distinct item you can see across all frames. Ignore duplicates (same item in multiple frames = count once). Focus on items with resale potential.

Return ONLY valid JSON:
{
  "items": [
    {
      "name": "Item name",
      "brand": "Brand or null",
      "category": "Category",
      "frame_seen": number (which frame number 1-${frames.length}),
      "resale_low": number,
      "resale_high": number,
      "resale_avg": number,
      "op_shop_value": "e.g. $5-15",
      "roi_percent": number,
      "pick_verdict": "BUY|MAYBE|PASS",
      "verdict_reason": "One sentence",
      "best_platform": "Platform name"
    }
  ],
  "summary": "One sentence overview of the haul quality",
  "total_items_spotted": number,
  "top_pick": "Name of the single best item"
}` }
      ]}]);

      const parsed = parseJSON(text);
      const items = (parsed.items || []).map((item, i) => ({
        ...item,
        id: Date.now() + i,
        img: frames[Math.max(0, (item.frame_seen||1)-1)]?.url || frames[0]?.url,
      }));

      // Sort BUY first then by value
      const order = { BUY:0, MAYBE:1, PASS:2 };
      items.sort((a,b) => order[a.pick_verdict]!==order[b.pick_verdict] ? order[a.pick_verdict]-order[b.pick_verdict] : b.resale_avg-a.resale_avg);

      setVideoResults({ items, summary:parsed.summary, total:parsed.total_items_spotted, topPick:parsed.top_pick });
      setVideoStage("done");
    } catch(err) {
      setError("Video analysis failed: " + (err.message || "Try a shorter video."));
      setVideoStage("idle");
    }
    setVideoLoading(false); setVideoProgress(0);
  };

  const saveVideoItem = (item) => {
    if (saved.find(s => s.id === item.id)) return;
    setSaved(prev => [{ id:item.id, date:new Date().toLocaleDateString("en-AU"), image:item.img, analysis:item, marketData:null, condition:"Good" }, ...prev]);
  };

  // ─── SCAN TAB ─────────────────────────────────────────────────────────────

  const renderScanTab = () => {
    if (screen === "home") return (
      <div style={S.wrap}>
        <div style={S.logoRow}>
          <div><div style={S.logoTitle}>PICKER PRO</div><div style={S.logoSub}>Melbourne Op Shop Intelligence</div></div>
          <span style={{ fontSize:32 }}>🏷️</span>
        </div>
        <div style={{ ...S.heroCard, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📸</div>
          <div style={{ fontSize:15, color:"#CCC", lineHeight:1.65 }}>Scan any item. Get live market prices, a BUY verdict, and a ready-to-post listing.</div>
        </div>
        <button style={{ ...S.btn, background:"#FF6B35" }} onClick={() => cameraRef.current.click()}>📷  Take a Photo</button>
        <button style={{ ...S.btn, background:"#222", border:"1px solid #444" }} onClick={() => fileRef.current.click()}>🖼️  Upload from Gallery</button>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
        <input ref={fileRef}   type="file" accept="image/*"                        style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
        <div style={S.tipRow}><span style={{ color:"#FF6B35",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>💡 TIP</span><span style={{ color:"#888",fontSize:12,lineHeight:1.5 }}>Include labels and brand markings in shot for best results.</span></div>
        <div style={{ ...S.tipRow, background:"#0D1F0D" }}><span style={{ color:"#00C853",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>📡 LIVE</span><span style={{ color:"#888",fontSize:12,lineHeight:1.5 }}>Prices cross-referenced against real eBay AU, Depop & Facebook listings.</span></div>
        {saved.length > 0 && <div style={{ ...S.tipRow, cursor:"pointer" }} onClick={() => setTab("saved")}><span style={{ color:"#00C853",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>📦 {saved.length}</span><span style={{ color:"#888",fontSize:12 }}>item{saved.length!==1?"s":""} saved — tap to view</span></div>}
      </div>
    );

    if (screen === "scan") return (
      <div style={S.wrap}>
        <TopBar title="Review & Scan" onBack={resetScan} />
        <div style={S.previewBox}><img src={image} alt="item" style={{ width:"100%",maxHeight:300,objectFit:"contain" }} /></div>
        <div>
          <div style={S.label}>Item Condition</div>
          <div style={{ display:"flex",gap:8,marginTop:8 }}>
            {CONDITIONS.map(c=><button key={c} style={{ ...S.condBtn,...(condition===c?S.condOn:{}) }} onClick={()=>setCondition(c)}>{c}</button>)}
          </div>
        </div>
        {error && <div style={S.errBox}>{error}</div>}
        {loading ? (
          <div style={{ background:"#1A1A1A",border:"1px solid #333",borderRadius:14,padding:24,textAlign:"center" }}>
            <div style={{ fontSize:32,marginBottom:10 }}>{loadingMsg.startsWith("📡")?"📡":"🔍"}</div>
            <div style={{ color:"#FF6B35",fontWeight:700,fontSize:15,marginBottom:6 }}>{loadingMsg}</div>
            <div style={{ color:"#666",fontSize:12 }}>{loadingMsg.startsWith("📡")?"Checking eBay AU, Depop & Facebook…":"Reading brand, era, and features…"}</div>
            <div style={{ marginTop:14,height:3,background:"#222",borderRadius:4,overflow:"hidden" }}>
              <div style={{ height:"100%",background:"#FF6B35",borderRadius:4,width:loadingMsg.startsWith("📡")?"80%":"40%",transition:"width 0.5s" }} />
            </div>
          </div>
        ) : (
          <button style={{ ...S.btn,background:"#FF6B35" }} onClick={analyseItem}>🔍  Identify + Get Live Prices</button>
        )}
        {!loading && <button style={S.ghost} onClick={resetScan}>Choose different photo</button>}
      </div>
    );

    if (screen === "result" && analysis) return (
      <div style={S.wrap}>
        <TopBar title="Analysis" onBack={resetScan} />
        {/* Verdict */}
        <div style={{ ...S.card,border:`2px solid ${vc(analysis.pick_verdict)}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ ...S.pill,background:vc(analysis.pick_verdict),fontSize:13,padding:"6px 14px" }}>{analysis.pick_verdict==="BUY"?"✅ BUY IT":analysis.pick_verdict==="MAYBE"?"🤔 MAYBE":"❌ PASS"}</span>
            {analysis.market_searched && <span style={{ fontSize:11,color:"#00C853",fontWeight:700,background:"#0D1F0D",padding:"4px 10px",borderRadius:20 }}>📡 LIVE</span>}
          </div>
          <div style={{ fontSize:14,color:"#CCC",lineHeight:1.55 }}>{analysis.verdict_reason}</div>
          {analysis.market_note && <div style={{ fontSize:12,color:"#888",fontStyle:"italic" }}>{analysis.market_note}</div>}
          <button style={{ ...S.smallBtn,background:"#1F3A20",color:"#00C853",border:"1px solid #00C853",alignSelf:"flex-start" }} onClick={()=>saveItem(analysis,image,condition)}>📦 Save Item</button>
        </div>
        {/* ID */}
        <div style={S.card}>
          <div style={{ display:"flex",gap:14 }}>
            <img src={image} alt="" style={{ width:72,height:72,borderRadius:10,objectFit:"cover",flexShrink:0 }} />
            <div style={{ flex:1,display:"flex",flexDirection:"column",gap:4 }}>
              <div style={{ fontSize:16,fontWeight:700,color:"#F0F0F0",lineHeight:1.3 }}>{analysis.name}</div>
              {analysis.brand && <div style={{ fontSize:13,fontWeight:600,color:"#FF6B35" }}>{analysis.brand}</div>}
              {analysis.model && <div style={{ fontSize:12,color:"#AAA" }}>{analysis.model}</div>}
              {analysis.era   && <div style={{ fontSize:12,color:"#888" }}>{analysis.era}</div>}
              <span style={S.catPill}>{analysis.category}</span>
            </div>
          </div>
          <div style={{ fontSize:12,color:"#666",borderTop:"1px solid #2A2A2A",paddingTop:8,lineHeight:1.5 }}><b style={{ color:"#AAA" }}>Condition: {condition}</b> — {analysis.condition_note}</div>
        </div>
        {/* Valuation */}
        <div style={S.card}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={S.label}>💰 Valuation</div>
            {analysis.market_searched && <span style={{ fontSize:10,color:"#00C853",fontWeight:700 }}>LIVE DATA</span>}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[["Op Shop Pay",analysis.op_shop_value,"#F0F0F0"],["Resale Range",`$${analysis.resale_low}–$${analysis.resale_high}`,"#F0F0F0"],["Avg Sell",`$${analysis.resale_avg}`,"#FF6B35"],["Est. ROI",`${analysis.roi_percent}%`,rc(analysis.roi_percent)]].map(([lbl,val,col])=>(
              <div key={lbl} style={{ background:"#222",borderRadius:10,padding:12 }}>
                <div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700,letterSpacing:"0.06em",marginBottom:4 }}>{lbl}</div>
                <div style={{ fontSize:18,fontWeight:800,color:col }}>{val}</div>
              </div>
            ))}
          </div>
          {analysis.live_prices_found?.length>0 && (
            <div style={{ borderTop:"1px solid #2A2A2A",paddingTop:10 }}>
              <div style={{ fontSize:11,color:"#00C853",fontWeight:700,textTransform:"uppercase",marginBottom:8 }}>📡 Real Listings Found</div>
              {analysis.live_prices_found.map((p,i)=><div key={i} style={{ fontSize:12,color:"#BBB",lineHeight:1.6 }}>• {p}</div>)}
            </div>
          )}
          <div style={{ display:"flex",gap:8,borderTop:"1px solid #2A2A2A",paddingTop:10 }}>
            <span style={{ fontSize:11,color:"#666",fontWeight:700,textTransform:"uppercase" }}>Best platform:</span>
            <span style={{ fontSize:13,fontWeight:700,color:"#FF6B35" }}>{analysis.best_platform}</span>
          </div>
        </div>
        {/* Features */}
        <div style={S.card}>
          <div style={S.label}>✅ Key Features</div>
          {analysis.key_features?.map((f,i)=><div key={i} style={{ fontSize:13,color:"#CCC",lineHeight:1.6 }}><span style={{ color:"#00C853" }}>•</span> {f}</div>)}
          {analysis.red_flags?.length>0 && <>
            <div style={{ ...S.label,marginTop:6,color:"#FF6B35" }}>⚠️ Watch Out For</div>
            {analysis.red_flags.map((f,i)=><div key={i} style={{ fontSize:13,color:"#CCC",lineHeight:1.6 }}><span style={{ color:"#FF6B35" }}>•</span> {f}</div>)}
          </>}
        </div>
        {/* Tips */}
        <div style={S.card}>
          <div style={S.label}>🧠 Picker Tips</div>
          {analysis.tips?.map((t,i)=><div key={i} style={{ fontSize:13,color:"#BBB",lineHeight:1.7 }}>{i+1}. {t}</div>)}
        </div>
        {/* Listing */}
        <div style={S.card}>
          <div style={S.label}>📣 Generate Listing For…</div>
          {PLATFORMS.map(p=>(
            <button key={p.id} style={{ ...S.platformBtn,borderColor:p.color }} onClick={()=>generateListing(p)}>
              <span style={{ fontSize:20 }}>{p.icon}</span>
              <span style={{ fontSize:14,fontWeight:700,color:"#EEE",flex:1,textAlign:"left" }}>{p.name}</span>
              <span style={{ fontSize:12,color:"#555" }}>→</span>
            </button>
          ))}
        </div>
      </div>
    );

    if (screen === "listing") return (
      <div style={S.wrap}>
        <TopBar title={`${selPlatform?.icon} ${selPlatform?.name}`} onBack={()=>setScreen("result")} />
        {listLoading && <div style={{ textAlign:"center",padding:"60px 0" }}><div style={{ fontSize:44,marginBottom:12 }}>✍️</div><div style={{ color:"#FF6B35",fontWeight:700,fontSize:15,marginBottom:4 }}>Writing your listing…</div><div style={{ color:"#666",fontSize:12 }}>Using live market data to set the best price</div></div>}
        {listing && <>
          <div style={{ background:"#1F1410",border:"2px solid #FF6B35",borderRadius:14,padding:20,textAlign:"center" }}>
            <div style={{ fontSize:11,color:"#FF6B35",textTransform:"uppercase",fontWeight:700,letterSpacing:"0.1em",marginBottom:4 }}>Suggested Price</div>
            <div style={{ fontSize:38,fontWeight:900,color:"#FF6B35" }}>${listing.price_suggestion}</div>
            <div style={{ fontSize:12,color:"#888",marginTop:4 }}>{listing.price_reasoning}</div>
          </div>
          {listing.best_time_to_post && <div style={{ ...S.tipRow,background:"#0D1A2A" }}><span style={{ color:"#4A9EFF",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>🕐 POST</span><span style={{ color:"#888",fontSize:12 }}>{listing.best_time_to_post}</span></div>}
          {[{ label:"Title",key:"title",text:listing.title },{ label:"Description",key:"desc",text:listing.description,pre:true }].map(({label,key,text,pre})=>(
            <div key={key} style={S.card}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={S.label}>{label}</div>
                <button style={S.copyBtn} onClick={()=>copyText(text,key)}>{copied===key?"✅ Copied":"📋 Copy"}</button>
              </div>
              {pre ? <div style={{ fontSize:13,color:"#CCC",lineHeight:1.75,whiteSpace:"pre-wrap",background:"#222",borderRadius:10,padding:12 }}>{text}</div>
                   : <div style={{ fontSize:15,fontWeight:700,color:"#F0F0F0",lineHeight:1.4 }}>{text}</div>}
            </div>
          ))}
          <div style={S.card}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={S.label}>Hashtags</div>
              <button style={S.copyBtn} onClick={()=>copyText(listing.hashtags.map(h=>`#${h}`).join(" "),"tags")}>{copied==="tags"?"✅ Copied":"📋 Copy"}</button>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {listing.hashtags.map((h,i)=><span key={i} style={{ background:"#2A2A2A",borderRadius:20,padding:"4px 12px",fontSize:12,color:"#FF6B35",fontWeight:600 }}>#{h}</span>)}
            </div>
          </div>
          <div style={S.card}><div style={S.label}>📸 Photo Tips</div>{listing.photo_tips.map((t,i)=><div key={i} style={{ fontSize:13,color:"#BBB",lineHeight:1.65 }}>{i+1}. {t}</div>)}</div>
          <div style={S.card}><div style={S.label}>🤝 Lowballer Handling</div><div style={{ fontSize:13,color:"#CCC",lineHeight:1.6,background:"#222",borderRadius:10,padding:12,fontStyle:"italic" }}>{listing.negotiation_tip}</div></div>
          <button style={{ ...S.btn,background:"#FF6B35" }} onClick={()=>setScreen("result")}>← Try Another Platform</button>
          <button style={S.ghost} onClick={resetScan}>Scan New Item</button>
        </>}
      </div>
    );
  };

  // ─── VIDEO TAB ────────────────────────────────────────────────────────────

  const renderVideoTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}>
        <div><div style={S.logoTitle}>VIDEO SCANNER</div><div style={S.logoSub}>Record your op shop walk-through</div></div>
        <span style={{ fontSize:28 }}>🎬</span>
      </div>

      <div style={{ ...S.tipRow, background:"#0D1520" }}>
        <span style={{ color:"#4A9EFF",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>💡 HOW</span>
        <span style={{ color:"#888",fontSize:12,lineHeight:1.55 }}>Record a video slowly walking past items or panning over a pile. AI extracts frames and identifies every item it sees — ranked by value.</span>
      </div>

      {/* Upload video */}
      {videoStage === "idle" && (
        <>
          <button style={{ ...S.btn,background:"#FF6B35" }} onClick={()=>videoRef.current.click()}>
            🎬  Record or Upload Video
          </button>
          <input ref={videoRef} type="file" accept="video/*" capture="environment" style={{ display:"none" }} onChange={e=>handleVideoFile(e.target.files[0])} />

          {videoFile && (
            <div style={S.card}>
              <div style={S.label}>📹 Video Ready</div>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                {videoThumb && <img src={videoThumb} alt="" style={{ width:80,height:60,borderRadius:8,objectFit:"cover" }} />}
                <div>
                  <div style={{ fontSize:14,fontWeight:700,color:"#F0F0F0" }}>{videoFile.name}</div>
                  <div style={{ fontSize:12,color:"#888",marginTop:3 }}>{(videoFile.size/1024/1024).toFixed(1)} MB</div>
                  <div style={{ fontSize:12,color:"#888" }}>Will extract up to 12 frames</div>
                </div>
              </div>
              <button style={{ ...S.btn,background:"#00C853",padding:13 }} onClick={runVideoAnalysis}>
                🔍 Scan Video for Items
              </button>
            </div>
          )}

          {!videoFile && (
            <div style={{ ...S.heroCard,textAlign:"center" }}>
              <div style={{ fontSize:44,marginBottom:10 }}>🎬</div>
              <div style={{ fontSize:14,color:"#888",lineHeight:1.65 }}>
                Record a slow video walking past op shop shelves or panning over items. AI watches every frame and spots what's worth buying.
              </div>
            </div>
          )}
        </>
      )}

      {/* Extracting frames */}
      {videoStage === "extracting" && (
        <div style={{ ...S.card,textAlign:"center",padding:"28px 16px" }}>
          <div style={{ fontSize:38,marginBottom:10 }}>🎞️</div>
          <div style={{ fontSize:15,fontWeight:700,color:"#FF6B35",marginBottom:6 }}>Extracting frames from video…</div>
          <div style={{ fontSize:12,color:"#666" }}>Pulling key moments from your recording</div>
          <div style={{ marginTop:14,height:4,background:"#222",borderRadius:3,overflow:"hidden" }}>
            <div style={{ height:"100%",background:"#FF6B35",borderRadius:3,width:"60%",animation:"pulse 1.5s infinite" }} />
          </div>
        </div>
      )}

      {/* Analysing */}
      {videoStage === "analysing" && (
        <div style={{ ...S.card,textAlign:"center",padding:"28px 16px" }}>
          <div style={{ fontSize:38,marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:15,fontWeight:700,color:"#FF6B35",marginBottom:6 }}>AI scanning {videoTotal} frames…</div>
          <div style={{ fontSize:12,color:"#666",marginBottom:12 }}>Identifying every item and checking what it's worth</div>
          {videoFrames.length > 0 && (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:14 }}>
              {videoFrames.slice(0,8).map((f,i)=>(
                <img key={i} src={f.url} alt="" style={{ width:"100%",aspectRatio:"4/3",objectFit:"cover",borderRadius:6,opacity:0.7 }} />
              ))}
            </div>
          )}
          <div style={{ height:4,background:"#222",borderRadius:3,overflow:"hidden" }}>
            <div style={{ height:"100%",background:"#FF6B35",borderRadius:3,width:"85%",transition:"width 0.5s" }} />
          </div>
        </div>
      )}

      {/* Results */}
      {videoStage === "done" && videoResults?.items && (
        <>
          {/* Summary banner */}
          <div style={{ background:"#1F1410",border:"2px solid #FF6B35",borderRadius:14,padding:16 }}>
            <div style={{ fontSize:11,color:"#FF6B35",fontWeight:700,textTransform:"uppercase",marginBottom:6 }}>🎬 Video Haul Summary</div>
            <div style={{ fontSize:14,color:"#CCC",lineHeight:1.55,marginBottom:10 }}>{videoResults.summary}</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              {[["Buy",videoResults.items.filter(r=>r.pick_verdict==="BUY").length,"#00C853"],["Maybe",videoResults.items.filter(r=>r.pick_verdict==="MAYBE").length,"#FFB300"],["Pass",videoResults.items.filter(r=>r.pick_verdict==="PASS").length,"#FF3D00"]].map(([lbl,count,col])=>(
                <div key={lbl} style={{ background:"#222",borderRadius:10,padding:"10px 8px",textAlign:"center" }}>
                  <div style={{ fontSize:22,fontWeight:900,color:col }}>{count}</div>
                  <div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700 }}>{lbl}</div>
                </div>
              ))}
            </div>
            {videoResults.topPick && (
              <div style={{ marginTop:10,background:"#0D1F0D",borderRadius:10,padding:"10px 12px" }}>
                <span style={{ fontSize:11,color:"#00C853",fontWeight:700 }}>🏆 TOP PICK: </span>
                <span style={{ fontSize:13,color:"#F0F0F0",fontWeight:600 }}>{videoResults.topPick}</span>
              </div>
            )}
            <div style={{ marginTop:10,display:"flex",justifyContent:"space-between",fontSize:13,color:"#888" }}>
              <span>{videoResults.total} items spotted</span>
              <span style={{ color:"#FF6B35",fontWeight:700 }}>
                ~${videoResults.items.filter(r=>r.pick_verdict!=="PASS").reduce((a,r)=>a+r.resale_avg,0)} potential
              </span>
            </div>
          </div>

          {/* Frame strip */}
          {videoFrames.length > 0 && (
            <div style={S.card}>
              <div style={S.label}>🎞️ Frames Analysed</div>
              <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4 }}>
                {videoFrames.map((f,i)=>(
                  <img key={i} src={f.url} alt="" style={{ height:56,aspectRatio:"4/3",objectFit:"cover",borderRadius:6,flexShrink:0,border:"1px solid #333" }} />
                ))}
              </div>
            </div>
          )}

          <div style={S.label}>🏆 Items Found — Ranked Best First</div>

          {videoResults.items.map((item,i)=>(
            <div key={item.id} style={{ ...S.card,border:`1px solid ${vc(item.pick_verdict)}22` }}>
              <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                <div style={{ position:"relative",flexShrink:0 }}>
                  <img src={item.img} alt="" style={{ width:64,height:64,borderRadius:10,objectFit:"cover" }} />
                  <div style={{ position:"absolute",top:-6,left:-6,width:22,height:22,background:"#FF6B35",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff" }}>{i+1}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:"#F0F0F0",lineHeight:1.3,flex:1 }}>{item.name}</div>
                    <span style={{ ...S.pill,background:vc(item.pick_verdict),fontSize:10,padding:"3px 9px",flexShrink:0 }}>{item.pick_verdict}</span>
                  </div>
                  {item.brand && <div style={{ fontSize:12,color:"#FF6B35",fontWeight:600,marginTop:2 }}>{item.brand}</div>}
                  <div style={{ fontSize:12,color:"#888",marginTop:2,lineHeight:1.5 }}>{item.verdict_reason}</div>
                  <div style={{ display:"flex",gap:14,marginTop:6 }}>
                    {[["Op Shop",item.op_shop_value,"#AAA"],["Resale",`$${item.resale_avg}`,"#FF6B35"],["ROI",`${item.roi_percent}%`,rc(item.roi_percent)]].map(([lbl,val,col])=>(
                      <div key={lbl}>
                        <div style={{ fontSize:10,color:"#555",textTransform:"uppercase",fontWeight:700 }}>{lbl}</div>
                        <div style={{ fontSize:13,fontWeight:700,color:col }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button style={{ ...S.smallBtn,background:"#1F3A20",color:"#00C853",border:"1px solid #00C853",flex:1,fontSize:12 }} onClick={()=>saveVideoItem(item)}>📦 Save</button>
                <button style={{ ...S.smallBtn,background:"#1F1410",color:"#FF6B35",border:"1px solid #FF6B35",flex:1,fontSize:12 }}
                  onClick={()=>{ setAnalysis({...item,_scanId:item.id}); setMarketData(null); setImage(item.img); setTab("scan"); setScreen("result"); }}>
                  🔍 Deep Scan
                </button>
              </div>
            </div>
          ))}

          <button style={{ ...S.btn,background:"#FF6B35" }} onClick={()=>{ setVideoFile(null); setVideoThumb(null); setVideoFrames([]); setVideoResults([]); setVideoStage("idle"); }}>
            🎬 Scan New Video
          </button>
        </>
      )}
    </div>
  );

  // ─── BATCH TAB ────────────────────────────────────────────────────────────

  const renderBatchTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}>
        <div><div style={S.logoTitle}>HAUL SCANNER</div><div style={S.logoSub}>Photo every item, rank them all</div></div>
        <span style={{ fontSize:28 }}>🎯</span>
      </div>
      <div style={{ ...S.tipRow,background:"#0D1520" }}>
        <span style={{ color:"#4A9EFF",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>💡 HOW</span>
        <span style={{ color:"#888",fontSize:12,lineHeight:1.55 }}>Add photos one by one. When done tap Analyse — AI ranks everything BUY/MAYBE/PASS by value.</span>
      </div>
      <div style={{ display:"flex",gap:10 }}>
        <button style={{ ...S.btn,background:"#FF6B35",flex:1,padding:"13px" }} onClick={()=>batchCamRef.current.click()}>📷 Camera</button>
        <button style={{ ...S.btn,background:"#222",border:"1px solid #444",flex:1,padding:"13px" }} onClick={()=>batchFileRef.current.click()}>🖼️ Gallery</button>
      </div>
      <input ref={batchCamRef}  type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e=>addBatchPhoto(e.target.files[0])} />
      <input ref={batchFileRef} type="file" accept="image/*"                        style={{ display:"none" }} onChange={e=>addBatchPhoto(e.target.files[0])} />

      {batchPhotos.length > 0 && (
        <div style={S.card}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={S.label}>📸 {batchPhotos.length} photo{batchPhotos.length!==1?"s":""}</div>
            <button style={{ ...S.smallBtn,color:"#FF3D00",border:"1px solid #FF3D00",fontSize:12 }} onClick={()=>{ setBatchPhotos([]); setBatchResults([]); }}>Clear all</button>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {batchPhotos.map((p,i)=>(
              <div key={p.id} style={{ position:"relative" }}>
                <img src={p.img} alt={`item ${i+1}`} style={{ width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:10,border:"1px solid #333" }} />
                <button style={{ position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.7)",border:"none",borderRadius:50,width:22,height:22,color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setBatchPhotos(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
                {batchResults.find(r=>r.id===p.id) && <div style={{ position:"absolute",bottom:4,left:4,background:vc(batchResults.find(r=>r.id===p.id)?.pick_verdict),borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:800,color:"#fff" }}>{batchResults.find(r=>r.id===p.id)?.pick_verdict}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {batchLoading && (
        <div style={{ ...S.card,textAlign:"center",padding:"24px 16px" }}>
          <div style={{ fontSize:36,marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:15,fontWeight:700,color:"#FF6B35",marginBottom:6 }}>Analysing {batchProgress} of {batchPhotos.length}…</div>
          <div style={{ height:6,background:"#222",borderRadius:3,overflow:"hidden",margin:"12px 0" }}>
            <div style={{ height:"100%",background:"#FF6B35",borderRadius:3,width:`${(batchProgress/batchPhotos.length)*100}%`,transition:"width 0.4s" }} />
          </div>
          <div style={{ fontSize:12,color:"#666" }}>Checking each item…</div>
        </div>
      )}

      {batchPhotos.length > 0 && !batchLoading && batchResults.length === 0 && (
        <button style={{ ...S.btn,background:"#00C853" }} onClick={runBatchAnalysis}>🎯 Analyse Haul ({batchPhotos.length} items)</button>
      )}

      {batchResults.length > 0 && (
        <>
          <div style={S.card}>
            <div style={S.label}>📊 Haul Summary</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              {[["Buy",batchResults.filter(r=>r.pick_verdict==="BUY").length,"#00C853"],["Maybe",batchResults.filter(r=>r.pick_verdict==="MAYBE").length,"#FFB300"],["Pass",batchResults.filter(r=>r.pick_verdict==="PASS").length,"#FF3D00"]].map(([lbl,count,col])=>(
                <div key={lbl} style={{ background:"#222",borderRadius:10,padding:"10px 8px",textAlign:"center" }}>
                  <div style={{ fontSize:22,fontWeight:900,color:col }}>{count}</div>
                  <div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",borderTop:"1px solid #222",paddingTop:10 }}>
              <span style={{ fontSize:12,color:"#666" }}>Total potential</span>
              <span style={{ fontSize:14,fontWeight:800,color:"#FF6B35" }}>${batchResults.filter(r=>r.pick_verdict!=="PASS").reduce((a,r)=>a+r.resale_avg,0)} AUD</span>
            </div>
          </div>
          <div style={S.label}>🏆 Ranked Best First</div>
          {batchResults.map((item,i)=>(
            <div key={item.id} style={{ ...S.card,border:`1px solid ${vc(item.pick_verdict)}22` }}>
              <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                <div style={{ position:"relative",flexShrink:0 }}>
                  <img src={item.img} alt="" style={{ width:68,height:68,borderRadius:10,objectFit:"cover" }} />
                  <div style={{ position:"absolute",top:-6,left:-6,width:22,height:22,background:"#FF6B35",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff" }}>{i+1}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:"#F0F0F0",lineHeight:1.3,flex:1 }}>{item.name}</div>
                    <span style={{ ...S.pill,background:vc(item.pick_verdict),fontSize:10,padding:"3px 9px",flexShrink:0 }}>{item.pick_verdict}</span>
                  </div>
                  {item.brand && <div style={{ fontSize:12,color:"#FF6B35",fontWeight:600,marginTop:2 }}>{item.brand}</div>}
                  <div style={{ fontSize:12,color:"#888",marginTop:2,lineHeight:1.5 }}>{item.verdict_reason}</div>
                  <div style={{ display:"flex",gap:14,marginTop:6 }}>
                    {[["Op Shop",item.op_shop_value,"#AAA"],["Resale",`$${item.resale_avg}`,"#FF6B35"],["ROI",`${item.roi_percent}%`,rc(item.roi_percent)]].map(([lbl,val,col])=>(
                      <div key={lbl}><div style={{ fontSize:10,color:"#555",textTransform:"uppercase",fontWeight:700 }}>{lbl}</div><div style={{ fontSize:13,fontWeight:700,color:col }}>{val}</div></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button style={{ ...S.smallBtn,background:"#1F3A20",color:"#00C853",border:"1px solid #00C853",flex:1,fontSize:12 }} onClick={()=>saveBatchItem(item)}>📦 Save</button>
                <button style={{ ...S.smallBtn,background:"#1F1410",color:"#FF6B35",border:"1px solid #FF6B35",flex:1,fontSize:12 }} onClick={()=>{ setAnalysis({...item,_scanId:item.id}); setMarketData(null); setImage(item.img); setTab("scan"); setScreen("result"); }}>🔍 Full Scan</button>
              </div>
            </div>
          ))}
          <button style={{ ...S.btn,background:"#FF6B35" }} onClick={runBatchAnalysis}>🔄 Re-analyse</button>
          <button style={S.ghost} onClick={()=>{ setBatchPhotos([]); setBatchResults([]); }}>Start new haul</button>
        </>
      )}

      {batchPhotos.length === 0 && batchResults.length === 0 && (
        <div style={{ ...S.heroCard,textAlign:"center" }}>
          <div style={{ fontSize:44,marginBottom:10 }}>📸</div>
          <div style={{ fontSize:14,color:"#888",lineHeight:1.65 }}>Tap Camera or Gallery above to add photos of items. Add as many as you like then hit Analyse.</div>
        </div>
      )}
    </div>
  );

  // ─── SAVED TAB ────────────────────────────────────────────────────────────

  const renderSavedTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}><div style={{ fontSize:20,fontWeight:800,color:"#F0F0F0" }}>📦 Saved Items</div><span style={{ fontSize:13,color:"#888" }}>{saved.length} item{saved.length!==1?"s":""}</span></div>
      {saved.length===0 && <div style={{ ...S.heroCard,textAlign:"center" }}><div style={{ fontSize:40,marginBottom:10 }}>📭</div><div style={{ fontSize:14,color:"#888",lineHeight:1.6 }}>Nothing saved yet. Scan an item and tap Save.</div></div>}
      {saved.map(item=>(
        <div key={item.id} style={S.card}>
          <div style={{ display:"flex",gap:12 }}>
            <img src={item.image} alt="" style={{ width:64,height:64,borderRadius:8,objectFit:"cover",flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:700,color:"#F0F0F0",lineHeight:1.3 }}>{item.analysis.name}</div>
              {item.analysis.brand && <div style={{ fontSize:12,color:"#FF6B35",fontWeight:600 }}>{item.analysis.brand}</div>}
              <div style={{ fontSize:11,color:"#888",marginTop:2 }}>{item.date} · {item.condition}</div>
              <div style={{ fontSize:15,fontWeight:800,color:"#00C853",marginTop:3 }}>~${item.analysis.resale_avg} AUD</div>
            </div>
            <span style={{ ...S.pill,background:vc(item.analysis.pick_verdict),fontSize:10,padding:"3px 9px",alignSelf:"flex-start" }}>{item.analysis.pick_verdict}</span>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button style={{ ...S.smallBtn,background:"#1A3320",color:"#00C853",border:"1px solid #00C853",flex:1 }} onClick={()=>markSold(item)}>💸 Mark Sold</button>
            <button style={{ ...S.smallBtn,background:"#2A1A1A",color:"#FF3D00",border:"1px solid #FF3D00" }} onClick={()=>deleteItem(item.id)}>🗑️</button>
          </div>
        </div>
      ))}
      {saleModal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20 }}>
          <div style={{ background:"#1A1A1A",border:"1px solid #333",borderRadius:18,padding:24,width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:14 }}>
            <div style={{ fontSize:18,fontWeight:800,color:"#F0F0F0" }}>Record Sale 💸</div>
            <div style={{ fontSize:13,color:"#888" }}>{saleModal.analysis.name}</div>
            <div><div style={S.label}>Sell Price (AUD)</div><input style={S.input} type="number" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder="e.g. 85" /></div>
            <div><div style={S.label}>What You Paid (AUD)</div><input style={S.input} type="number" value={saleCost} onChange={e=>setSaleCost(e.target.value)} placeholder="e.g. 12" /></div>
            {salePrice && saleCost && (
              <div style={{ background:"#0D1F0D",borderRadius:10,padding:"12px 14px",display:"flex",gap:24 }}>
                <div><div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700 }}>Profit</div><div style={{ fontSize:22,fontWeight:800,color:"#00C853" }}>${(parseFloat(salePrice)-parseFloat(saleCost)).toFixed(2)}</div></div>
                <div><div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700 }}>ROI</div><div style={{ fontSize:22,fontWeight:800,color:"#00C853" }}>{parseFloat(saleCost)>0?Math.round(((parseFloat(salePrice)-parseFloat(saleCost))/parseFloat(saleCost))*100):0}%</div></div>
              </div>
            )}
            <div style={{ display:"flex",gap:10 }}>
              <button style={{ ...S.btn,flex:1,background:"#00C853",padding:13 }} onClick={confirmSale}>Confirm Sale</button>
              <button style={{ ...S.btn,flex:1,background:"#2A2A2A",border:"1px solid #444",padding:13 }} onClick={()=>setSaleModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── TRACKER TAB ─────────────────────────────────────────────────────────

  const renderTrackerTab = () => (
    <div style={S.wrap}>
      <div style={S.logoRow}><div style={{ fontSize:20,fontWeight:800,color:"#F0F0F0" }}>💰 Profit Tracker</div><span style={{ fontSize:13,color:"#888" }}>{sales.length} sale{sales.length!==1?"s":""}</span></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {[["Total Profit",`$${totalProfit.toFixed(2)}`,"#00C853"],["Avg ROI",`${avgROI}%`,rc(avgROI)],["Total Revenue",`$${totalRev.toFixed(2)}`,"#FF6B35"],["Total Spent",`$${totalSpent.toFixed(2)}`,"#888"]].map(([lbl,val,col])=>(
          <div key={lbl} style={{ background:"#1A1A1A",border:"1px solid #2A2A2A",borderRadius:12,padding:14 }}>
            <div style={{ fontSize:10,color:"#666",textTransform:"uppercase",fontWeight:700,letterSpacing:"0.06em",marginBottom:4 }}>{lbl}</div>
            <div style={{ fontSize:22,fontWeight:800,color:col }}>{val}</div>
          </div>
        ))}
      </div>
      {sales.length===0 && <div style={{ ...S.heroCard,textAlign:"center" }}><div style={{ fontSize:40,marginBottom:10 }}>📊</div><div style={{ fontSize:14,color:"#888",lineHeight:1.6 }}>No sales yet. Mark items as sold from the Saved tab.</div></div>}
      {sales.map(s=>(
        <div key={s.id} style={S.card}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div><div style={{ fontSize:14,fontWeight:700,color:"#F0F0F0" }}>{s.name}</div>{s.brand && <div style={{ fontSize:12,color:"#FF6B35" }}>{s.brand}</div>}<div style={{ fontSize:11,color:"#666",marginTop:2 }}>{s.date}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:18,fontWeight:800,color:"#00C853" }}>+${s.profit.toFixed(2)}</div><div style={{ fontSize:12,color:"#888" }}>{s.roi}% ROI</div></div>
          </div>
          <div style={{ display:"flex",gap:16,borderTop:"1px solid #2A2A2A",paddingTop:8,fontSize:12,color:"#666" }}>
            <span>Bought: <b style={{ color:"#AAA" }}>${s.buyCost}</b></span>
            <span>Sold: <b style={{ color:"#AAA" }}>${s.sellPrice}</b></span>
          </div>
        </div>
      ))}
      {sales.length>0 && <button style={{ ...S.ghost,color:"#FF3D00",borderColor:"#FF3D00" }} onClick={()=>{ if(window.confirm("Clear all sales history?")) setSales([]); }}>Clear History</button>}
    </div>
  );

  // ─── GUIDE TAB ───────────────────────────────────────────────────────────

  const renderGuideTab = () => {
    if (activeGuide) {
      const guide = QUICK_GUIDES.find(g=>g.id===activeGuide);
      return (
        <div style={S.wrap}>
          <TopBar title={`${guide.icon} ${guide.title}`} onBack={()=>setActiveGuide(null)} />
          {guide.content.map((sec,si)=>(
            <div key={si} style={S.card}>
              <div style={S.label}>{sec.title}</div>
              {sec.items.map((item,ii)=>(
                <div key={ii} style={{ display:"flex",justifyContent:"space-between",gap:12,borderBottom:ii<sec.items.length-1?"1px solid #222":"none",paddingBottom:ii<sec.items.length-1?10:0,marginBottom:ii<sec.items.length-1?10:0 }}>
                  <div style={{ fontSize:13,color:"#CCC",flex:1,lineHeight:1.5 }}>{item.label}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#FF6B35",textAlign:"right" }}>{item.value}</div>
                </div>
              ))}
            </div>
          ))}
          <div style={S.tipRow}><span style={{ color:"#FF6B35",fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>💡</span><span style={{ color:"#888",fontSize:12 }}>Screenshot before heading out — works offline.</span></div>
        </div>
      );
    }
    return (
      <div style={S.wrap}>
        <div style={{ fontSize:20,fontWeight:800,color:"#F0F0F0" }}>📖 Picker Guides</div>
        <div style={{ fontSize:13,color:"#888",lineHeight:1.5 }}>Quick-reference cheat sheets for the op shop floor.</div>
        {QUICK_GUIDES.map(g=>(
          <button key={g.id} style={{ ...S.card,cursor:"pointer",flexDirection:"row",alignItems:"center",gap:14 }} onClick={()=>setActiveGuide(g.id)}>
            <span style={{ fontSize:30 }}>{g.icon}</span>
            <div style={{ flex:1,textAlign:"left" }}><div style={{ fontSize:15,fontWeight:700,color:"#F0F0F0" }}>{g.title}</div><div style={{ fontSize:12,color:"#666",marginTop:2 }}>Tap to open</div></div>
            <span style={{ color:"#444",fontSize:18 }}>›</span>
          </button>
        ))}
      </div>
    );
  };

  // ─── ROOT ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight:"100vh",background:"#111",color:"#F0F0F0",fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column" }}>
      <div style={{ flex:1,overflowY:"auto",paddingBottom:82 }}>
        {tab==="scan"    && renderScanTab()}
        {tab==="video"   && renderVideoTab()}
        {tab==="batch"   && renderBatchTab()}
        {tab==="saved"   && renderSavedTab()}
        {tab==="tracker" && renderTrackerTab()}
        {tab==="guide"   && renderGuideTab()}
      </div>
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#161616",borderTop:"1px solid #252525",display:"flex",justifyContent:"space-around",padding:"10px 0 20px" }}>
        {TABS.map(t=>(
          <button key={t.id} style={{ background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"2px 8px" }}
            onClick={()=>{ setTab(t.id); if(t.id==="scan") resetScan(); }}>
            <span style={{ fontSize:20 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700,color:tab===t.id?"#FF6B35":"#444",letterSpacing:"0.03em" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopBar({ title, onBack }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12,borderBottom:"1px solid #222",marginBottom:4 }}>
      <button style={{ background:"none",border:"none",color:"#FF6B35",fontSize:14,cursor:"pointer",padding:0,fontWeight:600 }} onClick={onBack}>← Back</button>
      <span style={{ fontSize:15,fontWeight:700,color:"#F0F0F0" }}>{title}</span>
      <span style={{ width:44 }} />
    </div>
  );
}

const S = {
  wrap:        { maxWidth:480,margin:"0 auto",padding:"18px 16px 8px",display:"flex",flexDirection:"column",gap:14 },
  logoRow:     { display:"flex",alignItems:"center",justifyContent:"space-between" },
  logoTitle:   { fontSize:22,fontWeight:900,letterSpacing:"0.1em",color:"#FF6B35" },
  logoSub:     { fontSize:10,color:"#555",letterSpacing:"0.06em",textTransform:"uppercase" },
  heroCard:    { background:"#1A1A1A",border:"1px solid #2A2A2A",borderRadius:16,padding:"22px 18px" },
  card:        { background:"#1A1A1A",border:"1px solid #2A2A2A",borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:10 },
  btn:         { width:"100%",padding:"15px",borderRadius:12,border:"none",fontSize:16,fontWeight:700,color:"#fff",cursor:"pointer",letterSpacing:"0.01em" },
  ghost:       { width:"100%",padding:"13px",borderRadius:12,border:"1px solid #2A2A2A",fontSize:14,color:"#666",background:"transparent",cursor:"pointer" },
  label:       { fontSize:11,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:"0.08em" },
  pill:        { display:"inline-block",padding:"5px 12px",borderRadius:30,fontSize:12,fontWeight:800,color:"#fff",alignSelf:"flex-start" },
  catPill:     { alignSelf:"flex-start",background:"#252525",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#888",fontWeight:600,marginTop:2 },
  condBtn:     { flex:1,padding:"10px 2px",borderRadius:10,border:"1px solid #2A2A2A",background:"#1A1A1A",color:"#666",fontSize:12,cursor:"pointer",fontWeight:600 },
  condOn:      { borderColor:"#FF6B35",color:"#FF6B35",background:"#1F1410" },
  previewBox:  { width:"100%",borderRadius:14,overflow:"hidden",border:"1px solid #2A2A2A",background:"#1A1A1A",maxHeight:300,display:"flex",alignItems:"center",justifyContent:"center" },
  platformBtn: { display:"flex",alignItems:"center",gap:12,background:"#1F1F1F",border:"1px solid",borderRadius:12,padding:"13px 14px",cursor:"pointer",width:"100%" },
  smallBtn:    { padding:"9px 14px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",background:"transparent" },
  copyBtn:     { background:"#252525",border:"1px solid #333",borderRadius:8,padding:"5px 12px",fontSize:12,color:"#AAA",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap" },
  tipRow:      { display:"flex",alignItems:"flex-start",gap:10,background:"#1A1A1A",borderRadius:10,padding:"11px 14px" },
  errBox:      { background:"#1F1010",border:"1px solid #FF3D00",borderRadius:10,padding:"12px 14px",color:"#FF6B35",fontSize:13,lineHeight:1.5 },
  input:       { width:"100%",background:"#222",border:"1px solid #333",borderRadius:10,padding:"12px 14px",fontSize:15,color:"#F0F0F0",marginTop:6,boxSizing:"border-box",outline:"none" },
};
