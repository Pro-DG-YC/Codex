import {
  loadJSON,
  formatCurrency,
  formatNumber,
  uniqueValues,
  debounce,
  getQueryParams,
  setQueryParams,
  daysSince,
  getStorage,
  setStorage
} from "./utils.js";
import { updateSavedButtons } from "./site.js";

const state = {
  vehicles: [],
  filtered: [],
  filters: {
    make: "",
    model: "",
    bodyStyle: "",
    transmission: "",
    drivetrain: "",
    fuelType: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    minMileage: "",
    maxMileage: "",
    colorExterior: "",
    colorInterior: "",
    certified: false,
    oneOwner: false,
    features: [],
    search: ""
  },
  sort: "newest",
  page: 1,
  perPage: 9,
  compare: new Set(getStorage("aann-compare"))
};

const filtersForm = document.querySelector("#inventoryFilters");
const resultsContainer = document.querySelector("[data-inventory-list]");
const summaryCount = document.querySelector("[data-results-count]");
const loadMoreBtn = document.querySelector("[data-load-more]");
const compareDrawer = document.querySelector("[data-compare-drawer]");
const compareContent = document.querySelector("[data-compare-content]");
const clearCompareBtn = document.querySelector("[data-compare-clear]");

const applyFilters = () => {
  const {
    make,
    model,
    bodyStyle,
    transmission,
    drivetrain,
    fuelType,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    colorExterior,
    colorInterior,
    certified,
    oneOwner,
    features,
    search
  } = state.filters;

  const activeFeatures = new Set(features);
  const filtered = state.vehicles.filter((vehicle) => {
    if (make && vehicle.make !== make) return false;
    if (model && vehicle.model !== model) return false;
    if (bodyStyle && vehicle.bodyStyle !== bodyStyle) return false;
    if (transmission && vehicle.transmission !== transmission) return false;
    if (drivetrain && vehicle.drivetrain !== drivetrain) return false;
    if (fuelType && vehicle.fuelType !== fuelType) return false;
    if (colorExterior && vehicle.exteriorColor !== colorExterior) return false;
    if (colorInterior && vehicle.interiorColor !== colorInterior) return false;
    if (certified && !vehicle.certified) return false;
    if (oneOwner && !vehicle.oneOwner) return false;
    if (minYear && Number(vehicle.year) < Number(minYear)) return false;
    if (maxYear && Number(vehicle.year) > Number(maxYear)) return false;
    if (minPrice && Number(vehicle.price) < Number(minPrice)) return false;
    if (maxPrice && Number(vehicle.price) > Number(maxPrice)) return false;
    if (minMileage && Number(vehicle.mileage) < Number(minMileage)) return false;
    if (maxMileage && Number(vehicle.mileage) > Number(maxMileage)) return false;
    if (search) {
      const text = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.bodyStyle}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    if (activeFeatures.size) {
      if (!vehicle.features || !vehicle.features.some((feature) => activeFeatures.has(feature))) {
        return false;
      }
    }
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    switch (state.sort) {
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "year-desc":
        return Number(b.year) - Number(a.year);
      case "mileage-asc":
        return Number(a.mileage) - Number(b.mileage);
      case "newest":
      default:
        return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
    }
  });

  state.filtered = sorted;
  state.page = 1;
  renderResults();
  renderCompareDrawer();
};

const renderResults = () => {
  if (!resultsContainer) return;
  const startIndex = 0;
  const endIndex = state.page * state.perPage;
  const visibleVehicles = state.filtered.slice(startIndex, endIndex);

  resultsContainer.innerHTML = visibleVehicles
    .map((vehicle) => createVehicleCard(vehicle))
    .join("");

  if (summaryCount) {
    summaryCount.textContent = `${state.filtered.length} plan${state.filtered.length === 1 ? "" : "s"} available`;
  }

  if (loadMoreBtn) {
    if (endIndex >= state.filtered.length) {
      loadMoreBtn.classList.add("modal-hidden");
    } else {
      loadMoreBtn.classList.remove("modal-hidden");
      loadMoreBtn.querySelector("span").textContent = `Show more (${state.filtered.length - endIndex} remaining)`;
    }
  }

  updateSavedButtons();
};

const createVehicleCard = (vehicle) => {
  const newArrival = daysSince(vehicle.dateListed) <= 14;
  const savedActive = state.compare.has(vehicle.id);
  const featureBadges = vehicle.features.slice(0, 3).map((feature) => `<span class="tag">${feature}</span>`).join("");

  return `
    <article class="vehicle-card" data-vehicle-id="${vehicle.id}">
      <img src="${vehicle.imageUrls?.[0] || './assets/vehicles/placeholder-1.svg'}" loading="lazy" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}" srcset="${vehicle.imageUrls?.[0] || './assets/vehicles/placeholder-1.svg'} 1x" />
      <div class="content">
        <div class="badges">
          ${newArrival ? '<span class="badge accent">New Arrival</span>' : ""}
          ${vehicle.certified ? '<span class="badge">Certified</span>' : ""}
          ${vehicle.oneOwner ? '<span class="badge">One Owner</span>' : ""}
        </div>
        <h3>${vehicle.make} ${vehicle.model}</h3>
        <p>${vehicle.trim || ""}</p>
        <p><strong>${formatCurrency(vehicle.price)}</strong> · ${formatNumber(vehicle.mileage)} day processing window</p>
        <p>${vehicle.bodyStyle} · ${vehicle.transmission}</p>
        <div class="tag-list">${featureBadges}</div>
        <div class="grid" style="margin-top:auto; gap:0.75rem">
          <a class="btn-primary" href="/vehicle.html?slug=${vehicle.slug}">View Plan Details</a>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
            <button class="saved-toggle" type="button" data-save-vehicle="${vehicle.id}" aria-pressed="false">
              <span>${"Save"}</span>
            </button>
            <button class="saved-toggle ${savedActive ? "is-active" : ""}" type="button" data-compare-toggle="${vehicle.id}" aria-pressed="${savedActive}">
              <span>${savedActive ? "In Compare" : "Compare"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>`;
};

const populateFilters = (vehicles) => {
  if (!filtersForm) return;
  const makeSelect = filtersForm.querySelector("[name=make]");
  const modelSelect = filtersForm.querySelector("[name=model]");
  const bodySelect = filtersForm.querySelector("[name=bodyStyle]");
  const transmissionSelect = filtersForm.querySelector("[name=transmission]");
  const drivetrainSelect = filtersForm.querySelector("[name=drivetrain]");
  const fuelSelect = filtersForm.querySelector("[name=fuelType]");
  const exteriorSelect = filtersForm.querySelector("[name=colorExterior]");
  const interiorSelect = filtersForm.querySelector("[name=colorInterior]");
  const featuresContainer = filtersForm.querySelector("[data-feature-list]");

  const populateSelect = (select, values) => {
    if (!select) return;
    select.innerHTML += values.map((value) => `<option value="${value}">${value}</option>`).join("");
  };

  populateSelect(makeSelect, uniqueValues(vehicles, "make"));
  populateSelect(modelSelect, uniqueValues(vehicles, "model"));
  populateSelect(bodySelect, uniqueValues(vehicles, "bodyStyle"));
  populateSelect(transmissionSelect, uniqueValues(vehicles, "transmission"));
  populateSelect(drivetrainSelect, uniqueValues(vehicles, "drivetrain"));
  populateSelect(fuelSelect, uniqueValues(vehicles, "fuelType"));
  populateSelect(exteriorSelect, uniqueValues(vehicles, "exteriorColor"));
  populateSelect(interiorSelect, uniqueValues(vehicles, "interiorColor"));

  const featureValues = Array.from(
    new Set(vehicles.flatMap((vehicle) => vehicle.features || []))
  ).sort();
  if (featuresContainer) {
    featuresContainer.innerHTML = featureValues
      .map(
        (feature) => `
          <label>
            <input type="checkbox" name="features" value="${feature}" />
            <span>${feature}</span>
          </label>`
      )
      .join("");
  }
};

const syncFiltersFromQuery = () => {
  const params = getQueryParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key === "features") {
      state.filters.features = value.split("|").filter(Boolean);
    } else if (key === "certified" || key === "oneOwner") {
      state.filters[key] = value === "true";
    } else if (key === "sort") {
      state.sort = value;
    } else if (key === "page") {
      state.page = Number(value) || 1;
    } else if (key in state.filters) {
      state.filters[key] = value;
    }
  });
};

const syncQueryFromFilters = () => {
  const params = { ...state.filters, sort: state.sort };
  params.features = state.filters.features.join("|");
  params.certified = state.filters.certified ? "true" : "";
  params.oneOwner = state.filters.oneOwner ? "true" : "";
  params.page = state.page;
  setQueryParams(params);
};

const handleFilterChange = () => {
  if (!filtersForm) return;
  filtersForm.addEventListener("input", debounce((event) => {
    const { name, value, type, checked } = event.target;
    if (!(name in state.filters) && name !== "features" && name !== "sort") return;

    if (name === "features") {
      const selected = new Set(state.filters.features);
      if (checked) {
        selected.add(value);
      } else {
        selected.delete(value);
      }
      state.filters.features = Array.from(selected);
    } else if (type === "checkbox") {
      state.filters[name] = checked;
    } else if (name === "sort") {
      state.sort = value;
    } else {
      state.filters[name] = value;
    }

    syncQueryFromFilters();
    applyFilters();
  }, 200));

  filtersForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
};

const handleLoadMore = () => {
  if (!loadMoreBtn) return;
  loadMoreBtn.addEventListener("click", () => {
    state.page += 1;
    renderResults();
    syncQueryFromFilters();
  });
};

const handleCompareClicks = () => {
  document.body.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-compare-toggle]");
    if (!toggle) return;
    const id = toggle.getAttribute("data-compare-toggle");
    if (state.compare.has(id)) {
      state.compare.delete(id);
    } else {
      if (state.compare.size >= 3) {
        alert("You can only compare up to 3 plans at a time.");
        return;
      }
      state.compare.add(id);
    }
    setStorage("aann-compare", Array.from(state.compare));
    renderResults();
    renderCompareDrawer();
  });
};

const renderCompareDrawer = () => {
  if (!compareDrawer || !compareContent) return;
  if (!state.compare.size) {
    compareDrawer.classList.remove("is-open");
    compareContent.innerHTML = "";
    return;
  }

  compareDrawer.classList.add("is-open");
  const vehicles = state.filtered.filter((vehicle) => state.compare.has(vehicle.id));

  if (!vehicles.length) {
    loadJSON("./data/inventory.json").then((data) => {
      const dataVehicles = data.vehicles.filter((vehicle) => state.compare.has(vehicle.id));
      compareContent.innerHTML = createCompareTable(dataVehicles);
    });
    return;
  }

  compareContent.innerHTML = createCompareTable(vehicles);
};

const createCompareTable = (vehicles) => {
  if (!vehicles.length) {
    return "<p>Add up to 3 plans to compare specs side-by-side.</p>";
  }
  const headers = ["Plan", "Price", "Processing Window", "Delivery", "Support", "Documentation", "Channel"];
  return `
    <div class="compare-grid">
      ${vehicles
        .map(
          (vehicle) => `
            <article>
              <h4>${vehicle.make} ${vehicle.model}</h4>
              <p>${formatCurrency(vehicle.price)}</p>
              <p>${formatNumber(vehicle.mileage)} day processing</p>
              <p>${vehicle.bodyStyle}</p>
              <p>${vehicle.drivetrain}</p>
              <p>${vehicle.engine}</p>
              <p>${vehicle.fuelType}</p>
              <p><a href="/vehicle.html?slug=${vehicle.slug}">Open plan details</a></p>
            </article>`
        )
        .join("")}
    </div>`;
};

const initClearCompare = () => {
  if (!clearCompareBtn) return;
  clearCompareBtn.addEventListener("click", () => {
    state.compare.clear();
    setStorage("aann-compare", []);
    renderResults();
    renderCompareDrawer();
  });
};

const init = async () => {
  try {
    const data = await loadJSON("./data/inventory.json");
    state.vehicles = data.vehicles;
    populateFilters(state.vehicles);
    syncFiltersFromQuery();

    // Update form UI after syncing filters
    Object.entries(state.filters).forEach(([key, value]) => {
      const field = filtersForm?.elements[key];
      if (!field) return;
      if (field instanceof RadioNodeList) {
        Array.from(field).forEach((input) => {
          if (input.type === "checkbox") {
            input.checked = Boolean(value);
          }
        });
      } else if (field.type === "checkbox") {
        field.checked = Boolean(value);
      } else {
        field.value = value;
      }
    });

    if (filtersForm) {
      const featureInputs = filtersForm.querySelectorAll("input[name='features']");
      featureInputs.forEach((input) => {
        input.checked = state.filters.features.includes(input.value);
      });
      const sortSelect = filtersForm.querySelector("select[name='sort']");
      if (sortSelect) sortSelect.value = state.sort;
    }

    applyFilters();
    handleFilterChange();
    handleLoadMore();
    handleCompareClicks();
    initClearCompare();
  } catch (error) {
    console.error(error);
    if (resultsContainer) {
      resultsContainer.innerHTML = "<p>Unable to load access plans. Please check data/inventory.json.</p>";
    }
  }
};

init();
