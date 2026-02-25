import RadarChart from "@/components/radar-chart";
import { getFlyingMachineById } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";

function getMachineFields(raw: any): any {
  if (!raw || typeof raw !== "object") return {};
  return raw.attributes && typeof raw.attributes === "object" ? { ...raw, ...raw.attributes } : raw;
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

export default async function Page({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await params;
  let machine: any;
  try {
    machine = await getFlyingMachineById(id);
  } catch (error) {
    console.error("/flying-machines/[id] load error:", error);
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold">Hiba</h1>
        <p className="mt-2 text-sm text-zinc-700">
          Nem sikerült betölteni a repülőgépet. Ellenőrizd Vercel-en a <b>STRAPI_API_URL</b> és <b>STRAPI_API_TOKEN</b> változókat, illetve hogy a Strapi elérhető-e kívülről.
        </p>
      </div>
    );
  }

  if (!machine) notFound();

  const fields = getMachineFields(machine);

  const baseUrl = getStrapiBaseUrl();
  const rawImageUrl = extractMediaUrl(fields.Image);
  const imageSrc = rawImageUrl
    ? rawImageUrl.startsWith("http")
      ? rawImageUrl
      : baseUrl
        ? baseUrl + rawImageUrl
        : rawImageUrl
    : undefined;

  return(
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-center">{fields.Name}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-3 text-sm font-semibold">Image</div>
          {imageSrc ? (
            <div className="flex items-center justify-center">
              <Image
                src={imageSrc}
                height={260}
                width={260}
                unoptimized
                alt={fields.Name}
              />
            </div>
          ) : (
            <div className="text-sm text-zinc-600">No image</div>
          )}
        </div>

        <RadarChart attrs={fields} />
      </div>
    </div>
  )

}