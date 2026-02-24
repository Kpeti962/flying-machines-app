"use client";

import { StrapiPagination } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function Pagination({ pagination }: { pagination: StrapiPagination }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handlePrev() {
    const params = new URLSearchParams(searchParams);
    let page = parseInt(params.get("page") ?? "1");
    if (page > 1) {
      page--;
    }
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  function handleNext() {
    const params = new URLSearchParams(searchParams);
    let page = parseInt(params.get("page") ?? "1");
    page++;
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  function handlePerPage(e: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", e.target.value);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }



  return (
    <div className="flex gap-5">
      <button
        onClick={handlePrev}
        disabled={pagination.page === 1}
        className={pagination.page === 1 ? "text-gray-500" : "text-blue-600"}
      >
        Prev
      </button>
      <div>
        Page: {pagination.page} / {pagination.pageCount}
      </div>
      <div>
        <label>Per Page</label>
        <select onChange={handlePerPage} value={searchParams.get("pageSize") || pagination.pageSize?.toString() || "20"}>
          <option value="20">20</option>
          <option value="10">10</option>
        </select>
      </div>
      <button
        onClick={handleNext}
        disabled={pagination.page >= pagination.pageCount}
        className={
          pagination.page >= pagination.pageCount
            ? "text-gray-500"
            : "text-blue-600"
        }
      >
        Next
      </button>
    </div>
  );
}