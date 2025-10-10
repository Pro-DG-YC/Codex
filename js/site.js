import { loadJSON, formatPhoneLink, getStorage, setStorage, toggleSavedVehicle, isSaved } from "./utils.js";

const siteState = {
  site: null,
  ready: false,
  listeners: []
};

export const onSiteReady = (callback) => {
  if (siteState.ready) {
    callback(siteState.site);
  } else {
    siteState.listeners.push(callback);
  }
};

const dispatchReady = () => {
  siteState.ready = true;
  siteState.listeners.forEach((callback) => callback(siteState.site));
  siteState.listeners = [];
};

const initNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("header nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    const expanded = nav.classList.contains("is-open");
    toggle.setAttribute("aria-expanded", expanded);
  });
};

const populateSiteInfo = (site) => {
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = site.dealerName;
  });
  document.querySelectorAll("[data-site-phone]").forEach((el) => {
    el.textContent = site.phone;
    el.setAttribute("href", `tel:${formatPhoneLink(site.phone)}`);
  });
  document.querySelectorAll("[data-site-email]").forEach((el) => {
    el.textContent = site.email;
    el.setAttribute("href", `mailto:${site.email}`);
  });
  document.querySelectorAll("[data-site-address]").forEach((el) => {
    el.textContent = site.address;
  });
  document.querySelectorAll("[data-map-embed]").forEach((el) => {
    if (site.mapEmbedUrl && site.mapEmbedUrl !== "#") {
      el.innerHTML = `<iframe title="Map showing ${site.dealerName}" loading="lazy" src="${site.mapEmbedUrl}" width="100%" height="320" style="border:0" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    } else {
      el.innerHTML = `<div class="placeholder-image" role="img" aria-label="Map placeholder">[[ADD MAP EMBED URL IN data/site.json]]</div>`;
    }
  });

  const hoursTable = document.querySelector("[data-hours]");
  if (hoursTable) {
    hoursTable.innerHTML = Object.entries(site.hours)
      .map(
        ([day, hours]) => `
          <tr>
            <th scope="row">${day}</th>
            <td>${hours}</td>
          </tr>`
      )
      .join("");
  }

  document.querySelectorAll("[data-social]").forEach((container) => {
    container.innerHTML = Object.entries(site.social)
      .map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`)
      .join("");
  });

  const yearPlaceholder = document.querySelector("[data-year]");
  if (yearPlaceholder) {
    yearPlaceholder.textContent = new Date().getFullYear();
  }
};

const initSavedVehiclesMenu = () => {
  const savedListContainer = document.querySelector("[data-saved-list]");
  const savedCount = document.querySelector("[data-saved-count]");
  const saved = new Set(getStorage("aann-saved"));
  if (savedCount) savedCount.textContent = saved.size;
  if (!savedListContainer) return;

  if (!saved.size) {
    savedListContainer.innerHTML = "<p>You haven't saved any plans yet. Tap the heart icon on a plan card to add it here.</p>";
    return;
  }

  loadJSON("./data/inventory.json")
    .then((data) => {
      const vehicles = data.vehicles.filter((vehicle) => saved.has(vehicle.id));
      savedListContainer.innerHTML = vehicles
        .map(
          (vehicle) => `
            <article>
              <h4>${vehicle.make} ${vehicle.model}</h4>
              <p>${vehicle.trim || ""}</p>
              <p><a href="/vehicle.html?slug=${vehicle.slug}">View plan details</a></p>
            </article>`
        )
        .join("");
    })
    .catch(() => {
      savedListContainer.innerHTML = "<p>Unable to load saved plans right now.</p>";
    });
};

export const updateSavedButtons = () => {
  document.querySelectorAll("[data-save-vehicle]").forEach((button) => {
    const id = button.getAttribute("data-save-vehicle");
    if (isSaved(id)) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      button.querySelector("span").textContent = "Saved";
    } else {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
      button.querySelector("span").textContent = "Save";
    }
  });
};

const handleSavedClicks = () => {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save-vehicle]");
    if (!button) return;
    const id = button.getAttribute("data-save-vehicle");
    const saved = toggleSavedVehicle(id);
    const savedCount = document.querySelector("[data-saved-count]");
    if (savedCount) savedCount.textContent = saved.size;
    updateSavedButtons();
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  handleSavedClicks();

  try {
    const site = await loadJSON("./data/site.json");
    siteState.site = site;
    populateSiteInfo(site);
    initSavedVehiclesMenu();
    dispatchReady();
  } catch (error) {
    console.error(error);
    document.querySelectorAll("[data-site-name]").forEach((el) => {
      el.textContent = "[[ADD BUSINESS NAME IN data/site.json]]";
    });
  }
});
