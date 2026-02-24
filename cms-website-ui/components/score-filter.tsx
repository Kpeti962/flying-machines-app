'use client';   
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function ScoreFilter({ attr }: { attr: string }) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();


    const scoreSelected = searchParams.get(attr);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (value === "-1") {
            params.delete(attr);
            const qs = params.toString();
            replace(qs ? `${pathname}?${qs}` : pathname);
        } else {
            params.set(attr, value);
            replace(`${pathname}?${params.toString()}`);
        }
    }

    return (
        <div className="flex justify-center items-center gap-5">
            <label>
                {attr}
            </label>
            <select className="p-2" name="" id="" onChange={handleChange} value={scoreSelected ? parseInt(scoreSelected) : undefined}>

                <option id="" value={-1}>0</option>
                <option id="" value={1}>1</option>
                <option id="" value={2}>2</option>
                <option id="" value={3}>3</option>
                <option id="" value={4}>4</option>
                <option id="" value={5}>5</option>
            </select>
        </div>
    )
}