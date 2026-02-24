import Pagination from "@/components/pagination";
import ScoreFilter from "@/components/score-filter";
import SortByAttribute from "@/components/sort-by-attribute";
import WeaponFilter from "@/components/weapon-filter";
import { getFlyingMachines, getWeapons } from "@/lib/api";
import { FlyingMachinesQuery, Machine, Weapon } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";



type PageProps = {
  searchParams:
  | FlyingMachinesQuery
  | Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolved = (await searchParams) as any;
  const flyingMachines = await getFlyingMachines(resolved);
  const weapons = await getWeapons();



  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-3 bg-gray-100 p-5 flex flex-col">
        <h2 className="font-bold">Attributes</h2>
        <ScoreFilter attr="Attack" />
        <ScoreFilter attr="Defense" />
        <ScoreFilter attr="Speed" />
        <ScoreFilter attr="Agility" />
        <ScoreFilter attr="Capacity" />
        <WeaponFilter weapons={weapons.data} />
        <SortByAttribute />
      </div>
      <div className="col-span-9 ">
        <div className="p-5 grid grid-cols-3 gap-5">
          {flyingMachines.data.map((machine: Machine) => (
            <div key={machine.documentId || machine.id} className="bg-zinc-100 flex flex-col gap-5 items-center py-5">
              <Link href={`/flying-machines/${machine.documentId || machine.id}`}>
                <Image
                  src={process.env.STRAPI_BASE_URL + machine.Image?.url}
                  height={156}
                  width={156}
                  unoptimized
                  alt={machine.Name}
                />
              </Link>
              <div>{machine.Name}</div>
              <div className="grid grid-cols-3 gap-5">
                <div>🗡️{machine.Attack}</div>
                <div>🛡️{machine.Defense}</div>
                <div>🚀{machine.Speed}</div>
              </div>
              <div>
                <ul>
                  <li className="flex gap-2 font-bold items-center">
                    {machine.weapons?.map((weapon: Weapon) => (
                      <div key={weapon.id} className="text-sm">
                        {weapon.Name}
                      </div>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5">
          <Pagination pagination={flyingMachines.meta.pagination} />
        </div>
      </div>
    </div>
  );
}