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
    <div className="grid grid-cols-12 ">
      <div className="col-span-3 bg-gray-100 p-5 flex flex-col">
        <h2 className="font-bold">Attributes</h2>
        <ScoreFilter attr="Attack" />
        <ScoreFilter attr="Defense" />
        <ScoreFilter attr="Speed" />
        <ScoreFilter attr="Agility" />
        <ScoreFilter attr="Capacity" />
        <WeaponFilter weapons={weaponsList} />
        <SortByAttribute />
      </div>
      <div className="col-span-9 ">
        <div className="p-5 grid grid-cols-3 gap-5">
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
            <div key={fields.documentId || fields.id} className="bg-zinc-100 flex flex-col gap-5 items-center py-5">
              <Link href={`/flying-machines/${fields.documentId || fields.id}`}>
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    height={156}
                    width={156}
                    unoptimized
                    alt={fields.Name}
                  />
                ) : (
                  <div className="h-[156px] w-[156px] bg-zinc-200" />
                )}
              </Link>
              <div>{fields.Name}</div>
              <div className="grid grid-cols-3 gap-5">
                <div>🗡️{fields.Attack}</div>
                <div>🛡️{fields.Defense}</div>
                <div>🚀{fields.Speed}</div>
              </div>
              <div>
                <ul>
                  <li className="flex gap-2 font-bold items-center">
                    {machineWeapons.map((weapon: Weapon) => (
                      <div key={weapon.documentId || weapon.id} className="text-sm">
                        {weapon.Name}
                      </div>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
            );
          })}
        </div>
        <div className="p-5">
          {flyingMachines?.meta?.pagination ? (
            <Pagination pagination={flyingMachines.meta.pagination} />
          ) : null}
        </div>
      </div>
    </div>
  );
}