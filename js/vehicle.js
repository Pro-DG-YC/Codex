import {
  loadJSON,
  formatCurrency,
  formatNumber,
  daysSince,
  setStorage,
  getStorage
} from "./utils.js";
import { updateSavedButtons } from "./site.js";

const galleryMain = document.querySelector("[data-gallery-main]");
const galleryThumbs = document.querySelector("[data-gallery-thumbs]");
const detailsContainer = document.querySelector("[data-vehicle-details]");
const featuresList = document.querySelector("[data-features]");
const specsTable = document.querySelector("[data-specs]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-img]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const stickyCta = document.querySelector("[data-sticky-cta]");
const breadcrumb = document.querySelector("[data-breadcrumb]");
const compareToggle = document.querySelector("[data-compare-toggle]");
const pageHeading = document.querySelector("[data-vehicle-heading]");
const heroBadges = document.querySelector("[data-hero-badges]");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  if (detailsContainer) {
    detailsContainer.innerHTML = "<p>Plan not found. Please return to the <a href='/inventory.html'>access plans</a>.</p>";
  }
} else {
  initVehicle();
}

async function initVehicle() {
  try {
    const data = await loadJSON("./data/inventory.json");
    const vehicle = data.vehicles.find((item) => item.slug === slug);
    if (!vehicle) {
      detailsContainer.innerHTML = "<p>Plan not found. It may have been updated. Please browse the <a href='/inventory.html'>access plans</a>.</p>";
      return;
    }

    document.title = `Auction Access Plan – ${vehicle.year} ${vehicle.make} ${vehicle.model} | American Auto Network LLC`;
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        Auction Access membership from American Auto Network LLC unlocks sample listings like this ${vehicle.year} ${vehicle.make} ${vehicle.model}. Schedule onboarding to access dealer-only auctions.
      );
    }

    renderHero(vehicle);
    renderGallery(vehicle);
    renderDetails(vehicle);
    renderFeatures(vehicle);
    renderSpecs(vehicle);
    renderStickyCta(vehicle);
    injectSchema(vehicle);
    initCompareToggle(vehicle);
    updateSavedButtons();
  } catch (error) {
    console.error(error);
    detailsContainer.innerHTML = "<p>We couldn't load this plan right now. Please refresh or try again later.</p>";
  }
}

function renderHero(vehicle) {
  if (!pageHeading) return;
  pageHeading.textContent = `Sample access: ${vehicle.make} ${vehicle.model}`;
  if (heroBadges) {
    const badges = [];
    if (daysSince(vehicle.dateListed) <= 14) badges.push("<span class='badge accent'>Fresh Auction Sample</span>");
    if (vehicle.certified) badges.push("<span class='badge'>Verified Auction</span>");
    if (vehicle.oneOwner) badges.push("<span class='badge'>One Owner Sample</span>");
    heroBadges.innerHTML = badges.join("");
  }
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="/index.html">Home</a> /
      <a href="/inventory.html">Access Plans</a> /
      <span>${vehicle.make} ${vehicle.model}</span>`;
  }
  const saveBtn = document.querySelector("[data-save-vehicle]");
  if (saveBtn) {
    saveBtn.setAttribute("data-save-vehicle", vehicle.id);
  }
}

function renderGallery(vehicle) {
  if (!galleryMain || !galleryThumbs) return;
  const images = vehicle.imageUrls?.length ? vehicle.imageUrls : ["./assets/vehicles/placeholder-1.svg"];
  galleryMain.innerHTML = `<img src="${images[0]}" alt="Sample auction photo of ${vehicle.year} ${vehicle.make} ${vehicle.model}" loading="lazy" />`;
  galleryThumbs.innerHTML = images
    .map(
      (url, index) => `
        <button type="button" data-gallery-index="${index}" aria-label="View image ${index + 1}">
          <img src="${url}" alt="Thumbnail ${index + 1} sample for ${vehicle.year} ${vehicle.make} ${vehicle.model}" class="${index === 0 ? "is-active" : ""}" loading="lazy" />
        </button>`
    )
    .join("");

  galleryThumbs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-gallery-index]");
    if (!button) return;
    const index = Number(button.dataset.galleryIndex);
    const selected = images[index];
    galleryMain.innerHTML = `<img src="${selected}" alt="Sample auction photo of ${vehicle.year} ${vehicle.make} ${vehicle.model}" loading="lazy" />`;
    galleryThumbs.querySelectorAll("img").forEach((img) => img.classList.remove("is-active"));
    button.querySelector("img").classList.add("is-active");
  });

  galleryMain.addEventListener("click", () => {
    lightbox.classList.remove("modal-hidden");
    lightboxImage.setAttribute("src", galleryMain.querySelector("img").src);
    lightboxImage.setAttribute("alt", galleryMain.querySelector("img").alt);
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.add("modal-hidden");
    lightboxImage.setAttribute("src", "");
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.add("modal-hidden");
      lightboxImage.setAttribute("src", "");
    }
  });
}

function renderDetails(vehicle) {
  if (!detailsContainer) return;
  detailsContainer.innerHTML = `
    <p class="print-note">Print this page for your records or share it with your licensing partners.</p>
    <p><strong>${formatCurrency(vehicle.price)}</strong> · ${formatNumber(vehicle.mileage)} day processing window</p>
    <p>Plan reference #${vehicle.stockNumber} · Concierge code ${vehicle.vin}</p>
    <p>${vehicle.bodyStyle} · ${vehicle.drivetrain} · ${vehicle.transmission}</p>
    <div class="grid" style="gap:1rem; margin-top:1.5rem;">
      <a class="btn-primary" href="#schedule">Schedule Onboarding</a>
      <a class="btn-secondary" href="#financing">See Pricing &amp; Financing</a>
      <a class="btn-secondary" href="#quote">Request Checklist</a>
      <a class="btn-secondary" href="/trade-in.html">Start Dealer Setup</a>
    </div>
    <p style="margin-top:1rem;"><a href="${vehicle.carfaxUrl || '#'}">View sample condition or auction report</a></p>
    <p style="margin-top:0.5rem; font-size:0.95rem; color:var(--muted, #4b5563);">Auction Access membership grants you dealer-only access to sample listings like this.</p>
  `;
}

function renderFeatures(vehicle) {
  if (!featuresList) return;
  if (!vehicle.features || !vehicle.features.length) {
    featuresList.innerHTML = '<li>Add membership benefits in data/inventory.json.</li>';
    return;
  }
  featuresList.innerHTML = vehicle.features
    .map((feature) => `<li>${feature}</li>`)
    .join("");
}

function renderSpecs(vehicle) {
  if (!specsTable) return;
  const specs = {
    "Sample Year": vehicle.year,
    "Sample Make": vehicle.make,
    "Sample Model": vehicle.model,
    "Sample Trim": vehicle.trim,
    "Sample Condition": vehicle.condition,
    "Sample Processing Days": `${formatNumber(vehicle.mileage)} days`,
    "Auction Delivery": vehicle.bodyStyle,
    "Support Level": vehicle.drivetrain,
    "Processing Speed": vehicle.transmission,
    "Documentation Package": vehicle.engine,
    "Support Channel": vehicle.fuelType,
    "Processing Estimate (min/max days)": `${vehicle.mpgCity}/${vehicle.mpgHighway}`,
    "Packet Type": vehicle.exteriorColor,
    "Support Add-On": vehicle.interiorColor,
    "Auction Location": vehicle.location
  };
  specsTable.innerHTML = Object.entries(specs)
    .map(
      ([label, value]) => `
        <tr>
          <th scope="row">${label}</th>
          <td>${value || "--"}</td>
        </tr>`
    )
    .join("");
}

function renderStickyCta(vehicle) {
  if (!stickyCta) return;
  stickyCta.innerHTML = `
    <strong>${formatCurrency(vehicle.price)}</strong>
    <span class="cta-note">Concierge plan overview</span>
    <a class="btn-primary" href="#schedule">Schedule Onboarding</a>
    <a class="btn-secondary" href="tel:${vehicle.phone || '(555) 123-4567'}">Call Concierge</a>
  `;
}

function injectSchema(vehicle) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Auction Access Plan – ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: `Auction Access membership from American Auto Network LLC unlocks sample listings like this ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
    image: vehicle.imageUrls,
    provider: {
      "@type": "Organization",
      name: "American Auto Network LLC",
      telephone: "(555) 123-4567"
    },
    areaServed: "US",
    serviceType: "Auction Access Concierge",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: vehicle.price,
      availability: "https://schema.org/InStock"
    }
  });
  document.head.appendChild(script);
}

function initCompareToggle(vehicle) {
  if (!compareToggle) return;
  const compareSet = new Set(getStorage("aann-compare"));
  const active = compareSet.has(vehicle.id);
  compareToggle.setAttribute("data-compare-toggle", vehicle.id);
  compareToggle.setAttribute("aria-pressed", active);
  compareToggle.classList.toggle("is-active", active);
  compareToggle.querySelector("span").textContent = active ? "In Compare" : "Compare";

  compareToggle.addEventListener("click", () => {
    const set = new Set(getStorage("aann-compare"));
    if (set.has(vehicle.id)) {
      set.delete(vehicle.id);
    } else {
      if (set.size >= 3) {
        alert("You can only compare up to 3 plans at once.");
        return;
      }
      set.add(vehicle.id);
    }
    setStorage("aann-compare", Array.from(set));
    compareToggle.classList.toggle("is-active", set.has(vehicle.id));
    compareToggle.setAttribute("aria-pressed", set.has(vehicle.id));
    compareToggle.querySelector("span").textContent = set.has(vehicle.id) ? "In Compare" : "Compare";
  });
}
