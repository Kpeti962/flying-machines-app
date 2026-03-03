import Pagination from "@/components/pagination";
import ScoreFilter from "@/components/score-filter";
import SortByAttribute from "@/components/sort-by-attribute";
import WeaponFilter from "@/components/weapon-filter";
import { getFlyingMachines, getWeapons } from "@/lib/api";
import { FlyingMachinesQuery, Machine, Weapon } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function getMachineFields(raw: any): any {
  if (!raw || typeof raw !== "object") return {};
  return raw.attributes && typeof raw.attributes === "object" ? { ...raw, ...raw.attributes } : raw;
}

function normalizeWeapons(rawWeapons: any): Weapon[] {
  if (!rawWeapons) return [];
  if (Array.isArray(rawWeapons)) return rawWeapons as Weapon[];

  // Strapi relation shapes: { data: [...] } or { data: { ... } }
  const data = rawWeapons?.data;
  if (Array.isArray(data)) {
    return data.map((w: any) => {
      const fields = getMachineFields(w);
      return {
        id: fields.id,
        documentId: fields.documentId,
        Name: fields.Name,
      } as Weapon;
    });
  }
  if (data && typeof data === "object") {
    const fields = getMachineFields(data);
    return [
      {
        id: fields.id,
        documentId: fields.documentId,
        Name: fields.Name,
      } as Weapon,
    ];
  }

  return [];
}

function getStrapiBaseUrl() {
  const explicit = process.env.STRAPI_BASE_URL;
  if (explicit) return explicit;

  const apiUrl = process.env.STRAPI_API_URL;
  if (!apiUrl) return undefined;
  try {
    return new URL(apiUrl).origin;
  } catch {
    return undefined;
  }
}

function extractMediaUrl(image: any): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return (
    image.url ||
    image?.data?.url ||
    image?.attributes?.url ||
    image?.data?.attributes?.url
  );
}



type PageProps = {
  searchParams:
  | FlyingMachinesQuery
  | Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolved = (await searchParams) as any;
  let flyingMachines: any;
  let weapons: any;

  try {
    flyingMachines = await getFlyingMachines(resolved);
    weapons = await getWeapons();
  } catch (error) {
    console.error("/flying-machines load error:", error);
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Flying machines</h1>
        <p className="mt-2 text-sm text-zinc-700">
          Nem sikerült betölteni az adatokat. Vercel-en ellenőrizd a környezeti változókat: <b>STRAPI_API_URL</b> és (ha kell) <b>STRAPI_API_TOKEN</b>.
        </p>
      </div>
    );
  }

  const machines: Machine[] = Array.isArray(flyingMachines?.data) ? flyingMachines.data : [];
  const weaponsList: Weapon[] = Array.isArray(weapons?.data) ? weapons.data : [];
  const baseUrl = getStrapiBaseUrl();



  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6">
      <aside className="order-1 flex flex-col gap-4 rounded-lg bg-gray-100 p-4 md:col-span-3">
        <h2 className="text-base font-semibold text-zinc-900">Filters</h2>
        <div className="space-y-3">
          <ScoreFilter attr="Attack" />
          <ScoreFilter attr="Defense" />
          <ScoreFilter attr="Speed" />
          <ScoreFilter attr="Agility" />
          <ScoreFilter attr="Capacity" />
        </div>
        <div className="mt-4">
          <WeaponFilter weapons={weaponsList} />
        </div>
        <div className="mt-4">
          <SortByAttribute />
        </div>
      </aside>
      <section className="order-2 md:col-span-9">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">Flying machines</h1>
          {flyingMachines?.meta?.pagination?.total ? (
            <p className="text-sm text-zinc-600">
              {flyingMachines.meta.pagination.total} result
              {flyingMachines.meta.pagination.total === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine: any) => {
            const fields = getMachineFields(machine);
            const machineWeapons = normalizeWeapons(fields.weapons);
            const rawImageUrl = extractMediaUrl(fields.Image);
            const imageSrc = rawImageUrl
              ? rawImageUrl.startsWith("http")
                ? rawImageUrl
                : baseUrl
                  ? baseUrl + rawImageUrl
                  : rawImageUrl
              : undefined;

            return (
            <div
              key={fields.documentId || fields.id}
              className="flex flex-col items-stretch gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 shadow-sm"
            >
              <Link
                href={`/flying-machines/${fields.documentId || fields.id}`}
                className="flex flex-col items-center"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    height={156}
                    width={156}
                    unoptimized
                    alt={fields.Name}
                    className="h-[156px] w-[156px] rounded-md object-cover"
                  />
                ) : (
                  <div className="h-[156px] w-[156px] rounded-md bg-zinc-200" />
                )}
              </Link>
              <div className="flex flex-1 flex-col items-center gap-3 text-center">
                <div className="text-base font-semibold text-zinc-900">
                  {fields.Name}
                </div>
                <div className="grid w-full grid-cols-3 gap-2 text-sm text-zinc-800">
                  <div className="flex flex-col items-center rounded bg-white/70 px-2 py-1">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Attack</span>
                    <span>🗡️ {fields.Attack}</span>
                  </div>
                  <div className="flex flex-col items-center rounded bg-white/70 px-2 py-1">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Defense</span>
                    <span>🛡️ {fields.Defense}</span>
                  </div>
                  <div className="flex flex-col items-center rounded bg-white/70 px-2 py-1">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Speed</span>
                    <span>🚀 {fields.Speed}</span>
                  </div>
                </div>
                {machineWeapons.length > 0 ? (
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-zinc-800">
                    {machineWeapons.map((weapon: Weapon) => (
                      <span
                        key={weapon.documentId || weapon.id}
                        className="rounded-full bg-zinc-200 px-2 py-1"
                      >
                        {weapon.Name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          {flyingMachines?.meta?.pagination ? (
            <Pagination pagination={flyingMachines.meta.pagination} />
          ) : null}
        </div>
      </section>
    </div>
  );
}