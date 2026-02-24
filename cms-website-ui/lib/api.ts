import { FlyingMachinesQuery } from "./types";

const API_URL = process.env.STRAPI_API_URL;

const HEADERS = {
  Authorization: "bearer " + process.env.STRAPI_API_TOKEN,
  "Content-Type": "application/json",
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function commaList(value?: string | string[]) {
  const raw = first(value);
  return raw ? raw.split(",").filter(Boolean) : [];
}

const FILTER_KEYS = ["Attack", "Defense", "Speed", "Agility", "Capacity"] as const;

function normalizeSort(value?: string | string[]) {
  const raw = first(value);
  if (!raw) return undefined;

  const [field, order] = raw.split(":");
  if (!field || !order) return undefined;
  if (!(FILTER_KEYS as readonly string[]).includes(field)) return undefined;
  if (order !== "asc" && order !== "desc") return undefined;
  return `${field}:${order}`;
}

export async function getHeroText() {
  const res = await fetch(API_URL + "/hero-text", {
    headers: HEADERS,
  });

  const json = await res.json();
  return json;
}

export async function getFlyingMachines(searchParams: FlyingMachinesQuery = {}) {
  if (!API_URL) throw new Error("Missing STRAPI_API_URL");

  const url = new URL(API_URL + "/flying-machines");
  url.searchParams.set("populate", "Image");
  url.searchParams.set("populate[0]", "weapons");

  const page = parseInt(first(searchParams.page) ?? "1", 10) || 1;
  const pageSize = parseInt(first(searchParams.pageSize) ?? "20", 10) || 20;

  for (const key of FILTER_KEYS) {
    const value = first(searchParams[key]);
    if (value && value !== "-1") {
      url.searchParams.set(`filters[${key}][$gte]`, value);
    }
  }

  const weaponDocumentIds = commaList(searchParams.weapons);
  weaponDocumentIds.forEach((documentId, index) => {
    url.searchParams.set(`filters[weapons][documentId][$in][${index}]`, documentId);
  });

  const sort = normalizeSort(searchParams.sort);
  if (sort) {
    url.searchParams.set("sort", sort);
  }

  url.searchParams.set("pagination[page]", String(page));
  url.searchParams.set("pagination[pageSize]", String(pageSize));

  const res = await fetch(url, { headers: HEADERS, cache: "no-store" });
  return await res.json();
}

export async function getWeapons() {
  const res = await fetch(API_URL + "/weapons", { headers: HEADERS });
  return await res.json();
}

export async function createContactMessage(data: {
  Name: string;
  Email: string;
  Message: string
}) {
  try {
    const res = await fetch(API_URL + "/contact-messages", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.error(json);
      throw new Error("Failed to create contact message: " + json);
    }

  } catch (error) {

    console.error("Error:", error);
    throw error;
  }
}

export async function getFlyingMachineById(id: string) {
  if (!API_URL) throw new Error("Missing STRAPI_API_URL");

  const singleUrl = new URL(API_URL + "/flying-machines/" + id);
  singleUrl.searchParams.set("populate", "Image");
  singleUrl.searchParams.set("populate[0]", "weapons");

  const res = await fetch(singleUrl, { headers: HEADERS, cache: "no-store" });
  const json = await res.json();

  if (res.ok && json?.data) return json.data;

  const fallbackUrl = new URL(API_URL + "/flying-machines");
  fallbackUrl.searchParams.set("filters[documentId][$eq]", id);
  fallbackUrl.searchParams.set("populate", "Image");
  fallbackUrl.searchParams.set("populate[0]", "weapons");
  fallbackUrl.searchParams.set("pagination[page]", "1");
  fallbackUrl.searchParams.set("pagination[pageSize]", "1");

  const fallbackRes = await fetch(fallbackUrl, { headers: HEADERS, cache: "no-store" });
  const fallbackJson = await fallbackRes.json();

  if (!fallbackRes.ok) throw new Error("Failed to fetch flying machine: " + id);

  const item = fallbackJson?.data?.[0];

  if (item) return item;

  const numericId = Number(id);
  if (Number.isFinite(numericId)) {
    const idFallbackUrl = new URL(API_URL + "/flying-machines");
    idFallbackUrl.searchParams.set("filters[id][$eq]", String(numericId));
    idFallbackUrl.searchParams.set("populate", "Image");
    idFallbackUrl.searchParams.set("populate[0]", "weapons");
    idFallbackUrl.searchParams.set("pagination[page]", "1");
    idFallbackUrl.searchParams.set("pagination[pageSize]", "1");

    const idFallbackRes = await fetch(idFallbackUrl, { headers: HEADERS, cache: "no-store" });
    const idFallbackJson = await idFallbackRes.json();

    if (!idFallbackRes.ok) throw new Error("Failed to fetch flying machine: " + id);

    const idItem = idFallbackJson?.data?.[0];
    if (idItem) return idItem;
  }

  return null;
}