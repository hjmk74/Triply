function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastRequestTime = 0;

async function waitForRateLimit() {
  const minimumDelay = 4000;
  const elapsed = Date.now() - lastRequestTime;

  if (elapsed < minimumDelay) {
    await wait(minimumDelay - elapsed);
  }

  lastRequestTime = Date.now();
}

const BAD_WORDS = [
  "pdf",
  "fileicon",
  "icon",
  "logo",
  "map",
  "flag",
  "symbol",
  "diagram",
  "chart",
  "coat of arms",
  "book",
  "cover",
  "document",
  "stamp",
  "poster",
];

const STAY_WORDS = [
  "hotel",
  "resort",
  "inn",
  "lodge",
  "guesthouse",
  "guest house",
  "hostel",
  "villa",
  "accommodation",
  "motel",
  "camp",
  "camping",
  "chalet",
];

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isBadCandidate(candidate) {
  const text = normalize(`${candidate.title} ${candidate.url}`);
  const mime = (candidate.mime || "").toLowerCase();

  if (!mime.startsWith("image/")) {
    return true;
  }

  return BAD_WORDS.some((word) => text.includes(normalize(word)));
}

function scoreCandidate(candidate, { hotelName, destination, country }) {
  if (isBadCandidate(candidate)) {
    return -9999;
  }

  const title = normalize(candidate.title);
  const hotel = normalize(hotelName);
  const place = normalize(destination);
  const nation = normalize(country);

  let score = 0;

  if (hotel && title.includes(hotel)) {
    score += 120;
  }

  if (place && title.includes(place)) {
    score += 60;
  }

  if (nation && title.includes(nation)) {
    score += 15;
  }

  for (const word of STAY_WORDS) {
    if (title.includes(word)) {
      score += 25;
    }
  }

  const width = Number(candidate.width || 0);
  const height = Number(candidate.height || 0);

  if (width >= 800) {
    score += 10;
  }

  if (height >= 500) {
    score += 10;
  }

  if (width > height) {
    score += 8;
  }

  if (width && height && (width < 400 || height < 250)) {
    score -= 40;
  }

  return score;
}

async function searchWikimediaImages(searchQuery, limit = 10, maxAttempts = 2) {
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php` +
    `?action=query` +
    `&generator=search` +
    `&gsrsearch=${encodeURIComponent(searchQuery)}` +
    `&gsrnamespace=6` +
    `&gsrlimit=${limit}` +
    `&prop=imageinfo` +
    `&iiprop=url%7Cmime%7Csize` +
    `&iiurlwidth=1200` +
    `&format=json`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await waitForRateLimit();

      console.log(
        `Searching images: ${searchQuery} - attempt ${attempt}/${maxAttempts}`,
      );

      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Triply/1.0 (local development; contact Triply)",
          Accept: "application/json",
        },
      });

      if (response.status === 429) {
        console.log("Wikimedia rate limit reached. Waiting 15 seconds...");
        await wait(15000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`Wikimedia returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const pages = data?.query?.pages;

      if (!pages) {
        return [];
      }

      return Object.values(pages)
        .map((page) => {
          const info = page?.imageinfo?.[0];

          return {
            title: page?.title || "",
            url: info?.thumburl || info?.url || null,
            mime: info?.mime || "",
            width: info?.width || 0,
            height: info?.height || 0,
          };
        })
        .filter((item) => item.url);
    } catch (error) {
      console.error(
        `Wikimedia attempt ${attempt} failed for ${searchQuery}:`,
        error.message,
      );

      if (attempt < maxAttempts) {
        await wait(5000);
      }
    }
  }

  return [];
}

async function searchWikimediaImage(destination, country = "", limit = 10) {
  const queries = [`${destination} ${country}`, destination];

  for (const query of queries) {
    const candidates = await searchWikimediaImages(query, limit);

    const validCandidates = candidates.filter(
      (candidate) => !isBadCandidate(candidate),
    );

    if (validCandidates.length > 0) {
      return validCandidates[0].url;
    }
  }

  return null;
}

async function findBestHotelImage({
  hotelName,
  destination,
  country,
  usedUrls = new Set(),
  destinationImage = null,
}) {
  const queries = [
    `${hotelName} ${destination} ${country}`,
    `${hotelName} ${country}`,
    `${destination} hotel ${country}`,
    `${destination} resort ${country}`,
    `${destination} accommodation ${country}`,
    `${destination} guesthouse ${country}`,
  ];

  const normalizedUsed = new Set(
    [...usedUrls].filter(Boolean).map((url) => url.split("?")[0]),
  );

  const normalizedDestinationImage = destinationImage
    ? destinationImage.split("?")[0]
    : null;

  const candidates = [];

  for (const query of queries) {
    const found = await searchWikimediaImages(query, 10);

    for (const candidate of found) {
      const cleanUrl = candidate.url?.split("?")[0];

      if (!cleanUrl) {
        continue;
      }

      if (normalizedUsed.has(cleanUrl)) {
        continue;
      }

      if (
        normalizedDestinationImage &&
        cleanUrl === normalizedDestinationImage
      ) {
        continue;
      }

      if (isBadCandidate(candidate)) {
        continue;
      }

      const score = scoreCandidate(candidate, {
        hotelName,
        destination,
        country,
      });

      candidates.push({
        ...candidate,
        score,
      });
    }

    const strongCandidates = candidates.filter((item) => item.score >= 80);

    if (strongCandidates.length >= 3) {
      break;
    }

    await wait(2500);
  }

  candidates.sort((a, b) => b.score - a.score);

  return candidates[0] || null;
}

module.exports = {
  searchWikimediaImages,
  searchWikimediaImage,
  findBestHotelImage,
  wait,
};
