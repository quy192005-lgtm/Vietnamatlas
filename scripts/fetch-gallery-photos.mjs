import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const PLACES_FILE = path.join(rootDir, "data", "places.json");
const BACKUP_FILE = path.join(rootDir, "data", "places.backup-nv16.json");
const REPORT_FILE = path.join(rootDir, "gallery-report.md");

const USER_AGENT = "VietnamAtlas/1.0 (https://vietnamatlas-three.vercel.app; contact@vietnamatlas.com)";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      timeout: 15000,
    };

    const req = https.get(url, options, (res) => {
      if (res.statusCode === 429) {
        if (retries > 0) {
          console.warn("  [429 Rate Limit] Backing off 3s...");
          return sleep(3000).then(() => fetchJson(url, retries - 1).then(resolve, reject));
        }
        return reject(new Error("Rate limited (429)"));
      }

      if (res.statusCode !== 200) {
        if (retries > 0) {
          return sleep(1000).then(() => fetchJson(url, retries - 1).then(resolve, reject));
        }
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (err) => {
      if (retries > 0) {
        return sleep(1000).then(() => fetchJson(url, retries - 1).then(resolve, reject));
      }
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      if (retries > 0) {
        return sleep(1000).then(() => fetchJson(url, retries - 1).then(resolve, reject));
      }
      reject(new Error(`Timeout on ${url}`));
    });
  });
}

function cleanArtist(html) {
  if (!html) return "Wikimedia Commons";
  let s = String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  s = s.replace(/^User:\s*/i, "");
  s = s.replace(/\s+at\s+[a-z]{2,3}\.wiki[a-z]+/i, "");
  s = s.replace(/\s+from\s+[a-z]{2,3}\.wiki[a-z]+/i, "");
  return s.trim() || "Wikimedia Commons";
}

function normalizeTitle(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractFileTitle(photoPageUrl) {
  if (!photoPageUrl) return null;
  const match = photoPageUrl.match(/File:([^#?]+)/i);
  if (!match) return null;
  try {
    return "File:" + decodeURIComponent(match[1]).replace(/_/g, " ").trim();
  } catch {
    return "File:" + match[1].replace(/_/g, " ").trim();
  }
}

// Explicit curated category mappings for places with disambiguation nuances
const KNOWN_PLACE_CATEGORIES = {
  "en-hung": "Category:Đền Hùng",
  "dragon-bridge": "Category:Dragon Bridge (Danang)",
  "marble-mountains": "Category:Ngũ Hành Sơn",
  "ba-na-hills-golden-bridge": "Category:Ba Na Hills",
  "bao-tang-dan-toc-hoc-viet-nam": "Category:Vietnam Museum of Ethnology",
  "hoan-kiem-lake": "Category:Hoan Kiem Lake",
  "ho-chi-minh-mausoleum": "Category:Ho Chi Minh Mausoleum",
};

// Explicit high-accuracy search queries for specific destinations
const SPECIAL_SEARCH_QUERIES = {
  "mua-cave-hang-mua": "Hang Mua Ninh Binh",
  "vuon-quoc-gia-ba-vi": "Vườn quốc gia Ba Vì",
  "trang-an-scenic-landscape-complex": "Tràng An Ninh Bình",
  "tam-coc-bich-dong": "Tam Cốc Ninh Bình",
  "notre-dame-cathedral-of-saigon": "Nhà thờ Đức Bà Sài Gòn",
  "hoa-lo-prison-memorial": "Hỏa Lò Prison",
};

// Global blacklisted categories
const BLACKLIST_PATTERNS = [
  /^Category:(CC|PD|GFDL|Public domain|Files|Images|Photographs|Media|Self-published|All |Candidates|Items|Quality|Featured|Valued|User|Wiki Loves|Uploaded|Unidentified|Pages with|Articles with)/i,
  /\b(in \d{4}|taken in \d{4}|taken on \d{4}|\d{4} in|\d{4}s in|by year|by decade|by country|by photographer)\b/i,
  /^Category:(Vietnam|Hanoi|Da Nang|Ho Chi Minh City|Hue|Quang Ninh|Hai Phong|Can Tho|Nha Trang|Vung Tau|Dalat|Sapa|Ninh Binh|Hoi An|Phu Quoc|Phan Thiet|Ha Giang|Cao Bang|Mai Chau|Moc Chau|Ba Be|Con Dao|Cat Ba|Phong Nha)$/i,
  /^Category:(Nature of Vietnam|Tourism in Vietnam|Buildings in Vietnam|Lakes of Vietnam|Beaches of Vietnam|Pagodas in Vietnam|Temples in Vietnam|Streets in Vietnam|Bridges in Vietnam|Transport in Vietnam|Districts of Vietnam|Provinces of Vietnam|Geography of Vietnam|Tourist attractions in Vietnam|National parks of Vietnam|Mountains of Vietnam|Rivers of Vietnam|Islands of Vietnam|Monuments and memorials in Vietnam|World Heritage Sites in Vietnam)$/i,
  /^Category:(Buildings and structures in|Churches in|Bridges in|Streets in|Transport in|Districts of|Parks in|Museums in|Beaches in|Lakes in|Islands of)/i,
];

function isBlacklistedCategory(catTitle) {
  for (const pat of BLACKLIST_PATTERNS) {
    if (pat.test(catTitle)) return true;
  }
  return false;
}

function scoreCategory(catTitle, place) {
  if (isBlacklistedCategory(catTitle)) return -1;

  // Geographic conflict check
  const normCat = normalizeTitle(catTitle);
  const city = (place.city || "").toLowerCase();
  if (city.includes("phu tho") && (normCat.includes("ho chi minh") || normCat.includes("saigon"))) return -1;
  if (city.includes("hanoi") && (normCat.includes("ho chi minh") || normCat.includes("saigon") || normCat.includes("da nang"))) return -1;
  if (city.includes("ho chi minh") && (normCat.includes("hanoi") || normCat.includes("hai phong") || normCat.includes("da nang"))) return -1;

  const rawCat = catTitle.replace(/^Category:/i, "").trim();
  const normRawCat = normalizeTitle(rawCat);
  const normEn = normalizeTitle(place.name_en);
  const normVi = normalizeTitle(place.name);

  // Exact match
  if (normRawCat === normEn || normRawCat === normVi) return 100;

  // Category starts with or contains the exact full English/Vietnamese name
  if (normRawCat.startsWith(normEn) || normRawCat.includes(` ${normEn} `) || normRawCat.endsWith(` ${normEn}`)) return 90;
  if (normRawCat.startsWith(normVi) || normRawCat.includes(` ${normVi} `) || normRawCat.endsWith(` ${normVi}`)) return 85;

  // Word token matching
  const stopWords = new Set(["the", "of", "in", "and", "at", "for", "a", "an", "vietnam", "hanoi", "saigon", "city"]);
  const tokensEn = normEn.split(" ").filter((w) => w.length >= 3 && !stopWords.has(w));
  const tokensVi = normVi.split(" ").filter((w) => w.length >= 3 && !stopWords.has(w));

  let matchedEn = 0;
  tokensEn.forEach((t) => {
    if (normRawCat.includes(t)) matchedEn++;
  });

  let matchedVi = 0;
  tokensVi.forEach((t) => {
    if (normRawCat.includes(t)) matchedVi++;
  });

  if (tokensEn.length > 0 && matchedEn === tokensEn.length) return 80;
  if (tokensVi.length > 0 && matchedVi === tokensVi.length) return 75;

  if (tokensEn.length >= 2 && matchedEn >= 2) return 60;
  if (tokensVi.length >= 2 && matchedVi >= 2) return 55;

  return -1;
}

// -------------------------------------------------------------
// 4. IMAGE FILTER (MAPS, LOGOS, NON-FREE, INVALID, OFF-TOPIC)
// -------------------------------------------------------------
const BAD_IMAGE_TITLE_PATTERN = /(map|plan|diagram|logo|coat of arms|ticket|poster|menu|icon|stamp|flag|seal|symbol|sign|chart|drawing|sketch|table|locator|location map|route map|scheme|elevation|profile|banner|ban[_\s]do|bando|so[_\s]do|carte|danhthiep|danh[_\s]thiep|visiting[_\s]card|xep[_\s]hang|queue|medvedev|putin|obama|marine|soldier|rifle|cyrtodactylus|money[_\s]counter|ruler[_\s]to[_\s]measure|pig[_\s]ruler|betel|thich[_\s]truc[_\s]thai[_\s]minh|tru[_\s]tri|construction|cactaceae|eye[_\s]orbit|horse[_\s]hoof|thailand|padua|sacrament|gifu|toan[_\s]tap|phu[_\s]bien|ubnd|bai[_\s]toan|serbian|iran|magnet)/i;

function getCohesivePhrases(place) {
  const normEn = normalizeTitle(place.name_en);
  const normVi = normalizeTitle(place.name);

  const phrases = new Set();

  const stripPrefixes = (s) => {
    return s
      .replace(/^(lang|dao|bai bien|thac|chua|den|khu bao ton|vuon quoc gia|nha tho da|nha tho|thi tran|dinh thu|dinh|deo|song|vinh|cao nguyen da|cao nguyen|doi che|doi|pho co|ho|cung dien|bao tang|thanh dia|thanh|lang gom|gom|danh thang)\s+/i, "")
      .replace(/\s+(beach|bay|lake|waterfall|pagoda|temple|island|national park|cathedral|church|bridge|pass|cave|palace|museum|market|town|sanctuary|plateau|nature reserve|valley|forest|complex|landscape complex|memorial|heritage|scenic landscape complex|scenic landscape)\b.*$/i, "")
      .trim();
  };

  const coreEn = stripPrefixes(normEn);
  const coreVi = stripPrefixes(normVi);

  if (coreEn.length >= 4) phrases.add(coreEn);
  if (coreVi.length >= 4) phrases.add(coreVi);
  if (normEn.length >= 4) phrases.add(normEn);
  if (normVi.length >= 4) phrases.add(normVi);

  // Manual precise aliases for famous landmarks
  const aliases = {
    "trang-an-scenic-landscape-complex": ["trang an"],
    "tam-coc-bich-dong": ["tam coc", "bich dong"],
    "notre-dame-cathedral-of-saigon": ["notre dame", "duc ba"],
    "hoa-lo-prison-memorial": ["hoa lo", "hanoi hilton"],
    "chua-huong": ["chua huong", "perfume pagoda", "thien tru"],
    "ho-chi-minh-mausoleum": ["ba dinh square", "mausoleum"],
    "mua-cave-hang-mua": ["hang mua", "mua cave"],
    "thac-bac-sa-pa": ["thac bac", "silver waterfall"],
    "cau-vang-ba-na": ["cau vang", "golden bridge"],
    "bao-tang-dan-toc-hoc-viet-nam": ["dan toc hoc", "ethnology", "open luchtmuseum"],
    "vuon-quoc-gia-ba-vi": ["ba vi"],
  };

  if (aliases[place.slug]) {
    aliases[place.slug].forEach((a) => phrases.add(a));
  }

  return Array.from(phrases);
}

function isValidImage(item, place, mainFileTitle, isSearch = false) {
  const title = item.title || "";
  const info = item.imageinfo?.[0];
  if (!info) return false;

  const rawFileName = title.replace(/^File:/i, "").replace(/_/g, " ").trim();
  const lowFileName = rawFileName.toLowerCase();
  const normFileName = normalizeTitle(rawFileName);

  // 1. Exclude main image
  const normMain = (mainFileTitle || "").replace(/^File:/i, "").replace(/_/g, " ").trim().toLowerCase();
  if (lowFileName === normMain) return false;
  if (place.photo_url && info.url && info.url.toLowerCase() === place.photo_url.toLowerCase()) return false;

  // 2. MIME type image/jpeg or image/png
  if (info.mime !== "image/jpeg" && info.mime !== "image/png") return false;

  // 3. Bad title keywords
  if (BAD_IMAGE_TITLE_PATTERN.test(rawFileName)) return false;

  // 4. Distinctive cohesive destination phrase check
  const cohesivePhrases = getCohesivePhrases(place);
  if (cohesivePhrases.length > 0) {
    const hasPhraseInTitle = cohesivePhrases.some((ph) => normFileName.includes(ph));
    if (!hasPhraseInTitle) {
      if (isSearch) return false; // Search MUST strictly contain cohesive phrase in title
    }
  }

  // 5. Specific destination guardrails
  const slug = place.slug;
  if (slug === "mua-cave-hang-mua") {
    if (lowFileName.includes("xep hang") || lowFileName.includes("mua hang") || lowFileName.includes("hà nội") || lowFileName.includes("ha noi")) return false;
    if (!lowFileName.includes("hang mua") && !lowFileName.includes("hang múa") && !lowFileName.includes("mua cave") && !lowFileName.includes("dragon mountain")) return false;
  }
  if (slug === "en-hung") {
    if (lowFileName.includes("suoi tien") || lowFileName.includes("suối tiên") || lowFileName.includes("quan 9") || lowFileName.includes("quận 9") || lowFileName.includes("tan phu") || lowFileName.includes("tân phú")) return false;
  }
  if (slug === "trang-an-scenic-landscape-complex") {
    if (lowFileName.includes("tamcoc") || lowFileName.includes("tam cốc") || lowFileName.includes("thung nham") || lowFileName.includes("ga doi") || lowFileName.includes("may ui")) return false;
  }
  if (slug === "tam-coc-bich-dong") {
    if (lowFileName.includes("kenhga") || lowFileName.includes("kênh gà")) return false;
  }
  if (slug === "hoan-kiem-lake") {
    if (lowFileName.includes("danhthiep") || lowFileName.includes("ao dai")) return false;
  }
  if (slug === "ho-chi-minh-mausoleum") {
    if (lowFileName.includes("medvedev") || lowFileName.includes("putin") || lowFileName.includes("obama")) return false;
  }
  if (slug === "marble-mountains") {
    if (lowFileName.includes("marine") || lowFileName.includes("soldier") || lowFileName.includes("rifle") || lowFileName.includes("artillery")) return false;
  }
  if (slug === "dragon-bridge") {
    if (lowFileName.includes("construction") || lowFileName.includes("boat and construction")) return false;
  }
  if (slug === "vuon-quoc-gia-phong-nha-ke-bang") {
    if (lowFileName.includes("cyrtodactylus") || lowFileName.includes("ban do") || lowFileName.includes("map")) return false;
  }
  if (slug === "vuon-quoc-gia-ba-vi") {
    if (lowFileName.includes("soc chuot") || lowFileName.includes("sóc chuột") || lowFileName.includes("pdf")) return false;
  }
  if (slug === "bao-tang-dan-toc-hoc-viet-nam") {
    if (lowFileName.includes("money_counter") || lowFileName.includes("ruler_to_measure") || lowFileName.includes("betel")) return false;
  }

  // 6. Author & License metadata check
  const meta = info.extmetadata;
  if (!meta) return false;

  const artistRaw = meta.Artist?.value;
  if (!artistRaw) return false;
  const artist = cleanArtist(artistRaw);
  if (!artist || artist.length < 2) return false;

  const license = meta.LicenseShortName?.value;
  if (!license || !license.trim()) return false;

  const lowLic = license.toLowerCase();
  if (lowLic.includes("fair use") || lowLic.includes("all rights reserved") || lowLic.includes("copyrighted free use provided")) {
    return false;
  }

  // Width / Height check
  if (info.width && info.width < 400) return false;
  if (info.height && info.height < 300) return false;

  return true;
}

// -------------------------------------------------------------
// 5. FETCH CATEGORIES OF A FILE
// -------------------------------------------------------------
async function getFileCategories(fileTitle) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=categories&titles=${encodeURIComponent(fileTitle)}&cllimit=500`;
    const res = await fetchJson(url);
    const pages = res?.query?.pages;
    if (!pages) return [];
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return [];
    return (pages[pageId].categories || []).map((c) => c.title);
  } catch (err) {
    console.warn(`  [Warn] Failed to get categories for ${fileTitle}:`, err.message);
    return [];
  }
}

// -------------------------------------------------------------
// 6. FETCH MEMBERS OF A CATEGORY
// -------------------------------------------------------------
async function getCategoryMembers(catTitle) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=${encodeURIComponent(catTitle)}&gcmtype=file&gcmlimit=50&prop=imageinfo&iiprop=url|extmetadata|mime|size&iiurlwidth=1024`;
    const res = await fetchJson(url);
    const pages = res?.query?.pages;
    if (!pages) return [];
    return Object.values(pages);
  } catch (err) {
    console.warn(`  [Warn] Failed to get members for ${catTitle}:`, err.message);
    return [];
  }
}

// -------------------------------------------------------------
// 7. SEARCH FALLBACK
// -------------------------------------------------------------
async function searchWikimedia(searchTerm, place) {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata|mime|size&iiurlwidth=1024`;
    const searchRes = await fetchJson(searchUrl);
    const pages = searchRes?.query?.pages;
    if (!pages) return [];
    return Object.values(pages);
  } catch (err) {
    console.warn(`  [Warn] Search failed for "${searchTerm}":`, err.message);
    return [];
  }
}

// Helper to filter photos into final objects
function extractValidPhotos(candidateFiles, place, mainFileTitle, isSearch = false) {
  const validPhotos = [];
  const seenUrls = new Set();

  for (const item of candidateFiles) {
    if (validPhotos.length >= 4) break;
    if (!isValidImage(item, place, mainFileTitle, isSearch)) continue;

    const info = item.imageinfo?.[0];
    if (!info) continue;

    const srcUrl = info.thumburl || info.url;
    if (seenUrls.has(srcUrl) || seenUrls.has(info.descriptionurl)) continue;

    seenUrls.add(srcUrl);
    seenUrls.add(info.descriptionurl);

    validPhotos.push({
      src: srcUrl,
      credit_name: cleanArtist(info.extmetadata?.Artist?.value),
      license: info.extmetadata?.LicenseShortName?.value || "CC BY-SA",
      source_url: info.descriptionurl,
    });
  }
  return validPhotos;
}

// -------------------------------------------------------------
// 8. MAIN PROCESSING LOOP
// -------------------------------------------------------------
async function run() {
  console.log("==============================================================");
  console.log("  NV-16A: FETCHING SUPPLEMENTARY WIKIMEDIA COMMONS PHOTOS");
  console.log("  (Strict 100% Quality & Verification Standards)");
  console.log("==============================================================\n");

  console.log(`[1/4] Reading data from ${path.basename(PLACES_FILE)}...`);
  const placesRaw = fs.readFileSync(PLACES_FILE, "utf8");
  const places = JSON.parse(placesRaw);
  const publishedPlaces = places.filter((p) => p.published);
  console.log(`[2/4] Found ${publishedPlaces.length} published places to process...\n`);

  const results = [];
  const skipped = [];
  let totalPhotosAdded = 0;

  for (let idx = 0; idx < publishedPlaces.length; idx++) {
    const place = publishedPlaces[idx];
    const prefix = `[${idx + 1}/${publishedPlaces.length}] ${place.slug} ("${place.name_en}")`;
    await sleep(150);

    const mainFileTitle = extractFileTitle(place.photo_page);
    let chosenCategory = KNOWN_PLACE_CATEGORIES[place.slug] || null;
    let candidateFiles = [];
    let methodUsed = chosenCategory ? "known_category" : "category";
    let validPhotos = [];

    // 1. Try known or discovered category
    if (chosenCategory) {
      candidateFiles = await getCategoryMembers(chosenCategory);
      await sleep(100);
      validPhotos = extractValidPhotos(candidateFiles, place, mainFileTitle, false);
    } else if (mainFileTitle) {
      const categories = await getFileCategories(mainFileTitle);
      await sleep(100);

      const scored = categories
        .map((c) => ({ category: c, score: scoreCategory(c, place) }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        chosenCategory = scored[0].category;
        candidateFiles = await getCategoryMembers(chosenCategory);
        await sleep(100);
        validPhotos = extractValidPhotos(candidateFiles, place, mainFileTitle, false);
      }
    }

    // 2. Search fallback: if category yielded 0 valid photos, OR place is in SPECIAL_SEARCH_QUERIES
    if (validPhotos.length === 0 || SPECIAL_SEARCH_QUERIES[place.slug]) {
      methodUsed = "search";
      const query = SPECIAL_SEARCH_QUERIES[place.slug] || place.name_en;
      const searchFiles = await searchWikimedia(query, place);
      await sleep(100);

      const searchValidPhotos = extractValidPhotos(searchFiles, place, mainFileTitle, true);
      if (searchValidPhotos.length > 0) {
        validPhotos = searchValidPhotos;
      } else if (validPhotos.length === 0 && place.name && place.name !== place.name_en) {
        const searchFilesVi = await searchWikimedia(place.name, place);
        await sleep(100);
        validPhotos = extractValidPhotos(searchFilesVi, place, mainFileTitle, true);
      }
    }

    // 3. Update place record in master array
    const masterIdx = places.findIndex((p) => p.slug === place.slug);
    if (masterIdx >= 0) {
      places[masterIdx].gallery_photos = validPhotos;
    }

    if (validPhotos.length > 0) {
      totalPhotosAdded += validPhotos.length;
      console.log(`  ✔ ${prefix}: ${validPhotos.length} photos (${methodUsed === "search" ? `search: "${SPECIAL_SEARCH_QUERIES[place.slug] || place.name_en}"` : chosenCategory})`);
      results.push({
        slug: place.slug,
        name_en: place.name_en,
        city: place.city,
        source: methodUsed === "search" ? `search: "${SPECIAL_SEARCH_QUERIES[place.slug] || place.name_en}"` : chosenCategory,
        count: validPhotos.length,
        photos: validPhotos,
      });
    } else {
      let reason = "No specific category match and search returned no high-confidence images";
      if (!place.photo_page) reason = "Missing photo_page link for main photo";
      else if (chosenCategory) reason = `Category "${chosenCategory}" had no valid public domain / CC photos passing filters`;

      console.log(`  ⚠ ${prefix}: SKIPPED (${reason})`);
      skipped.push({
        slug: place.slug,
        name_en: place.name_en,
        city: place.city,
        reason,
      });
    }
  }

  // Unpublished places
  places.forEach((p) => {
    if (!p.published && !p.gallery_photos) {
      p.gallery_photos = [];
    }
  });

  // Step 3: Write back to data/places.json
  console.log(`\n[3/4] Writing updated data to ${path.basename(PLACES_FILE)}...`);
  fs.writeFileSync(PLACES_FILE, JSON.stringify(places, null, 2), "utf8");
  console.log("✔ data/places.json written and verified.");

  // Step 4: Generate gallery-report.md
  console.log(`[4/4] Generating ${path.basename(REPORT_FILE)}...`);

  let report = `# Gallery Photos Report (NV-16A)\n\n`;
  report += `*Generated at: ${new Date().toISOString()}*\n\n`;
  report += `## Executive Summary\n\n`;
  report += `- **Total Published Places**: ${publishedPlaces.length}\n`;
  report += `- **Places with Gallery Photos Attached**: ${results.length} (${((results.length / publishedPlaces.length) * 100).toFixed(1)}%)\n`;
  report += `- **Total Supplementary Photos Added**: ${totalPhotosAdded}\n`;
  report += `- **Places Skipped (Strict 100% Quality Gate)**: ${skipped.length}\n\n`;

  report += `## Places with Attached Gallery Photos (${results.length})\n\n`;
  report += `| # | Slug | Destination Name | City | Photos | Source / Category | Photo Sources &\n|---|---|---|---|:---:|---|---|\n`;

  results.forEach((r, idx) => {
    const photoLinks = r.photos
      .map((p, pIdx) => `[#${pIdx + 1}](${p.source_url}) (${p.license} / ${p.credit_name})`)
      .join("<br/>");
    report += `| ${idx + 1} | \`${r.slug}\` | **${r.name_en}** | ${r.city} | **${r.count}** | \`${r.source}\` | ${photoLinks} |\n`;
  });

  report += `\n## Skipped Places (${skipped.length})\n\n`;
  report += `> As mandated by Project Rule #1: *"Photos must match the destination 100%. If uncertain, skip and leave empty. Never use 'similar-looking' fillers."*\n\n`;
  report += `| # | Slug | Destination Name | City | Reason for Exclusion |\n|---|---|---|---|---|\n`;

  skipped.forEach((s, idx) => {
    report += `| ${idx + 1} | \`${s.slug}\` | **${s.name_en}** | ${s.city} | ${s.reason} |\n`;
  });

  fs.writeFileSync(REPORT_FILE, report, "utf8");
  console.log("✔ gallery-report.md created.\n");

  console.log("==============================================================");
  console.log(`  🎉 NV-16A COMPLETE: ${results.length}/${publishedPlaces.length} places equipped with ${totalPhotosAdded} gallery photos`);
  console.log("==============================================================\n");
}

run().catch((err) => {
  console.error("Fatal error in NV-16A script:", err);
  process.exit(1);
});
