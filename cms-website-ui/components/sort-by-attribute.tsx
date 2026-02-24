"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortByAttribute() {
const attrs = ["Attack", "Defense", "Agility", "Speed", "Capacity"];

const searchParams = useSearchParams();
const pathName = usePathname();
const {replace} = useRouter();

const attrSelected = searchParams.get("sort") || "";

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathName}?${params.toString()}`);


}

return (
    <div>
        <label>Sort</label>
        <select onChange={handleChange} value={attrSelected}>
            <option value="">Default</option>
            {attrs.map((attr) => (
            <option value={attr + ":desc"} key={attr + ":desc"}>
                {attr} High to Low
            </option>
            ))}
            {attrs.map((attr) => (
            <option value={attr + ":asc"} key={attr + ":asc"}>
                {attr} Low to High
            </option>
            ))}
        </select>
    </div>
);

}