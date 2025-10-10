/* Utility helpers for American Auto Network LLC */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(value));
};

export const formatNumber = (value) => {
  if (value === undefined || value === null) return "--";
  return new Intl.NumberFormat("en-US").format(Number(value));
};

export const debounce = (fn, delay = 250) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), delay);
  };
};

export const getQueryParams = () => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
};

export const setQueryParams = (updates) => {
  const params = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", newRelativePathQuery);
};

export const daysSince = (dateString) => {
  if (!dateString) return Infinity;
  const then = new Date(dateString);
  if (Number.isNaN(then.getTime())) return Infinity;
  const diff = Date.now() - then.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const loadJSON = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
};

export const uniqueValues = (vehicles, key) => {
  return Array.from(new Set(vehicles.map((v) => v[key]).filter(Boolean))).sort();
};

export const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn("Storage unavailable", error);
    return [];
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Unable to save to storage", error);
  }
};

export const toTitleCase = (text = "") =>
  text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const csvToJSON = (csvText) => {
  const [headerLine, ...rows] = csvText.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());
  const vehicles = rows
    .map((row) => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, "").trim()))
    .filter((cells) => cells.some((value) => value !== ""))
    .map((cells) => {
      const entry = {};
      headers.forEach((header, index) => {
        const value = cells[index] ?? "";
        entry[header] = value;
      });
      return entry;
    });
  return { vehicles };
};

export const validateForm = (form) => {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;
  requiredFields.forEach((field) => {
    if (!field.value || (field.type === "checkbox" && !field.checked)) {
      field.setAttribute("aria-invalid", "true");
      isValid = false;
    } else {
      field.removeAttribute("aria-invalid");
    }
  });
  return isValid;
};

export const toggleSavedVehicle = (vehicleId) => {
  const saved = new Set(getStorage("aann-saved"));
  if (saved.has(vehicleId)) {
    saved.delete(vehicleId);
  } else {
    saved.add(vehicleId);
  }
  setStorage("aann-saved", Array.from(saved));
  return saved;
};

export const isSaved = (vehicleId) => new Set(getStorage("aann-saved")).has(vehicleId);

export const formatPhoneLink = (phone) => phone.replace(/[^0-9+]/g, "");
