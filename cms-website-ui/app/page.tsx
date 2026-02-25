import Footer from "@/components/footer";
import Header from "@/components/header";
import { getHeroText } from "@/lib/api";
import Image from "next/image";

export default async function Home() {
  const heroText = await getHeroText();

  return (
    <div>
      <Header />
      <main>
        <section className="relative isolate min-h-screen overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/hero2.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className=" object-start"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 flex min-h-screen items-start justify-start p-6 sm:p-10">
            <div className="max-w-md rounded-md bg-black/50 p-5 text-white backdrop-blur-sm">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                {heroText?.data?.Title}
              </h1>
              <p className="mt-3 text-base text-zinc-100 sm:text-lg">
                {heroText?.data?.Content}
              </p>
            </div>
          </div>

          <a
            href="#fun-facts"
            className="smooth-scroll absolute bottom-22 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/15"
          >
            To the fun fact section
          </a>
        </section>

        <section
          id="fun-facts"
          className="mx-auto grid max-w-screen-lg scroll-mt-6 grid-cols-1 gap-5 p-5 md:grid-cols-3"
        >
          <div className="rounded-md bg-slate-100 p-6">
            <h2 className="text-lg font-semibold">Fun fact #1 – Why does an airplane fly?</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              Because of the wing’s shape and angle of attack, the airflow above and below the wing behaves differently,
              creating a pressure difference and therefore lift. Simply put: an airplane doesn’t “float” — it constantly
              works with the air around it.
            </p>
          </div>
          <div className="rounded-md bg-slate-100 p-6">
            <h2 className="text-lg font-semibold">Fun fact #2 – Turbulence is usually harmless</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              Turbulence is essentially the air “rippling” and swirling. It can feel uncomfortable, but modern airliners
              are built to handle typical turbulence safely. The most important thing: keep your seatbelt fastened.
            </p>
          </div>
          <div className="rounded-md bg-slate-100 p-6">
            <h2 className="text-lg font-semibold">Fun fact #3 – The cabin is pressurized</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              At high altitude the air is much thinner, so aircraft cabins are pressurized to keep passengers comfortable
              and safe. That’s also why your ears can “pop” during takeoff and landing.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
