import { countryList } from "../app/address/data/countries.js";

export function yearFrom(year) {
  return year && !Number.isNaN(new Date(year).getTime())
    ? new Date(year).toISOString().split("T")[0]
    : null;
}

export function getCountry(countryCode) {
  return countryList.find((country) => country.value === countryCode);
}

export function trimOnlyWhitespaceStrings(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (typeof v === "string" && v.trim() === "") {
        return [k, ""];
      }
      return [k, v];
    })
  );
}
