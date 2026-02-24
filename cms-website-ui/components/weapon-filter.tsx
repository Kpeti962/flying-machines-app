"use client";

import { Weapon } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";

export default function WeaponFilter({ weapons }: { weapons: Weapon[] }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    const weaponsSelected = (searchParams.get("weapons")?.split(",").filter(Boolean)) || [];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const checked = e.target.checked;
        const params = new URLSearchParams(searchParams);
        const str = params.get("weapons") || "";
        const set = new Set(str ? str.split(",").filter(Boolean) : []);
        if (checked) {
            set.add(value);
        } else {
            set.delete(value);
        }

        const arr = Array.from(set);
        if (arr.length === 0) {
            params.delete("weapons");
        } else {
            params.set("weapons", arr.join(","));
        }

        params.set("page", "1");

        const qs = params.toString();
        replace(qs ? `${pathName}?${qs}` : pathName);
    }

    return (
        <div>
            <label className="font-bold">Weapons</label>
            {weapons.map((weapon) => (
                <div key={weapon.documentId} className="flex my-5 justify-center">
                    <input
                        id={weapon.documentId}
                        type="checkbox"
                        value={weapon.documentId}
                        checked={weaponsSelected.includes(weapon.documentId)}
                        onChange={handleChange} />
                    <label htmlFor={weapon.documentId}>{weapon.Name}</label>
                </div>
            ))}
        </div>
    )
};