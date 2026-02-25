import Footer from "@/components/footer";
import Header from "@/components/header";
import { getHeroText } from "@/lib/api";

export default async function Home() {

  const heroText = await getHeroText();





  return (
    <div>
      <Header />
      <main>
        <div className="h-128 p-5 bg-[url(/images/hero.png)] bg-cover bg-center flex justify-end items-end">
          <div className="bg-black/50 text-white p-5backdrop-brightness-50 text-3xl max-w-80">
            <h1>{heroText?.data?.Title}</h1>
            <p>{heroText?.data?.Content}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 p-5 max-w-screen lg-auto">
          <div className="bg-slate-100 p-5 flex-col gap-5">
            <h2>feature</h2>
            <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae ut aperiam neque unde sint enim. Repellendus harum accusamus voluptatibus eligendi obcaecati laborum mollitia, maiores, fugiat temporibus alias incidunt enim quibusdam?</div>
          </div>
          <div className="bg-slate-100 p-5 flex-col gap-5">
            <h2>feature</h2>
            <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae ut aperiam neque unde sint enim. Repellendus harum accusamus voluptatibus eligendi obcaecati laborum mollitia, maiores, fugiat temporibus alias incidunt enim quibusdam?</div>
          </div>
          <div className="bg-slate-100 p-5 flex-col gap-5">
            <h2>feature</h2>
            <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae ut aperiam neque unde sint enim. Repellendus harum accusamus voluptatibus eligendi obcaecati laborum mollitia, maiores, fugiat temporibus alias incidunt enim quibusdam?</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
