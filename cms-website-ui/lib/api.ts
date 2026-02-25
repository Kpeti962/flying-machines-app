import { FlyingMachinesQuery } from "./types";

function getApiUrl(): string {
  const raw = process.env.STRAPI_API_URL;
  if (!raw) {
    throw new Error(
      "Missing STRAPI_API_URL. On Vercel set it in Project → Settings → Environment Variables (e.g. https://<your-strapi-host>/api).",
    );
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = process.env.STRAPI_API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchJson(url: URL, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
    const details =
      typeof body === "string" ? body : body ? JSON.stringify(body) : "";
    throw new Error(`Strapi request failed (${res.status} ${res.statusText}): ${url.toString()}${details ? `\n${details}` : ""}`);
  }

  return isJson ? await res.json() : await res.text();
}

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
  try {
    const apiUrl = getApiUrl();
    const url = new URL(apiUrl + "/hero-text");
    return await fetchJson(url, { cache: "no-store" });
  } catch (error) {
    console.error("getHeroText error:", error);
    return null;
  }
}

export async function getFlyingMachines(searchParams: FlyingMachinesQuery = {}) {
  const apiUrl = getApiUrl();

  const url = new URL(apiUrl + "/flying-machines");
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

  return await fetchJson(url, { cache: "no-store" });
}

export async function getWeapons() {
  try {
    const apiUrl = getApiUrl();
    const url = new URL(apiUrl + "/weapons");
    return await fetchJson(url, { cache: "no-store" });
  } catch (error) {
    console.error("getWeapons error:", error);
    return { data: [] };
  }
}

export async function createContactMessage(data: {
  Name: string;
  Email: string;
  Message: string
}) {
  const apiUrl = getApiUrl();
  const url = new URL(apiUrl + "/contact-messages");
  await fetchJson(url, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export async function getFlyingMachineById(id: string) {
  const apiUrl = getApiUrl();

  const singleUrl = new URL(apiUrl + "/flying-machines/" + id);
  singleUrl.searchParams.set("populate", "Image");
  singleUrl.searchParams.set("populate[0]", "weapons");

  try {
    const json = await fetchJson(singleUrl, { cache: "no-store" });
    if (json?.data) return json.data;
  } catch (error) {
    // fall back to documentId lookup below
    console.warn("getFlyingMachineById direct fetch failed:", error);
  }

  const fallbackUrl = new URL(apiUrl + "/flying-machines");
  fallbackUrl.searchParams.set("filters[documentId][$eq]", id);
  fallbackUrl.searchParams.set("populate", "Image");
  fallbackUrl.searchParams.set("populate[0]", "weapons");
  fallbackUrl.searchParams.set("pagination[page]", "1");
  fallbackUrl.searchParams.set("pagination[pageSize]", "1");

  const fallbackJson = await fetchJson(fallbackUrl, { cache: "no-store" });
  const item = fallbackJson?.data?.[0];

  if (item) return item;

  const numericId = Number(id);
  if (Number.isFinite(numericId)) {
    const idFallbackUrl = new URL(apiUrl + "/flying-machines");
    idFallbackUrl.searchParams.set("filters[id][$eq]", String(numericId));
    idFallbackUrl.searchParams.set("populate", "Image");
    idFallbackUrl.searchParams.set("populate[0]", "weapons");
    idFallbackUrl.searchParams.set("pagination[page]", "1");
    idFallbackUrl.searchParams.set("pagination[pageSize]", "1");

    const idFallbackJson = await fetchJson(idFallbackUrl, { cache: "no-store" });
    const idItem = idFallbackJson?.data?.[0];
    if (idItem) return idItem;
  }

  return null;
}