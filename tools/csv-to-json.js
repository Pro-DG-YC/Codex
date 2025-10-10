/*
 * CSV to JSON converter for American Auto Network LLC access plan catalog.
 * Usage in browser console:
 *   fetch('/data/inventory.csv').then(r => r.text()).then(csv => console.log(convertInventory(csv)))
 * Usage in Node:
 *   node tools/csv-to-json.js data/inventory.csv > data/inventory.json
 */

const fs = typeof window === "undefined" ? require("fs") : null;

function parseCsv(csvText) {
  const [headerLine, ...rows] = csvText.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());
  const vehicles = rows
    .map((row) => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, "").trim()))
    .filter((cells) => cells.some((value) => value !== ""))
    .map((cells) => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = cells[index] ?? "";
      });
      entry.year = Number(entry.year);
      entry.price = Number(entry.price);
      entry.msrp = Number(entry.msrp);
      entry.mileage = Number(entry.mileage);
      entry.mpgCity = Number(entry.mpgCity);
      entry.mpgHighway = Number(entry.mpgHighway);
      entry.certified = entry.certified === "true";
      entry.oneOwner = entry.oneOwner === "true";
      entry.features = entry.features ? entry.features.split("|").map((item) => item.trim()).filter(Boolean) : [];
      entry.imageUrls = entry.imageUrls ? entry.imageUrls.split(";").map((item) => item.trim()).filter(Boolean) : [];
    return entry;
    });
  return { vehicles };
}

function convertInventory(csvText) {
  return JSON.stringify(parseCsv(csvText), null, 2);
}

if (fs) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node tools/csv-to-json.js <path-to-inventory.csv>");
    process.exit(1);
  }
  const csv = fs.readFileSync(inputPath, "utf8");
  process.stdout.write(convertInventory(csv));
} else {
  window.convertInventory = convertInventory;
}

export { parseCsv, convertInventory };
