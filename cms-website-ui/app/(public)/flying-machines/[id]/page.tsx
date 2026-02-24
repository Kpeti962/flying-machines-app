import RadarChart from "@/components/radar-chart";
import { getFlyingMachineById } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";

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
  const machine = await getFlyingMachineById(id);

  if (!machine) notFound();

  const baseUrl = getStrapiBaseUrl();
  const rawImageUrl = extractMediaUrl(machine.Image);
  const imageSrc = rawImageUrl
    ? rawImageUrl.startsWith("http")
      ? rawImageUrl
      : baseUrl
        ? baseUrl + rawImageUrl
        : rawImageUrl
    : undefined;

  return(
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-center">{machine.Name}</h1>

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
                alt={machine.Name}
              />
            </div>
          ) : (
            <div className="text-sm text-zinc-600">No image</div>
          )}
        </div>

        <RadarChart attrs={machine} />
      </div>
    </div>
  )

}