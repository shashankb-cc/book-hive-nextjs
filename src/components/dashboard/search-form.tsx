"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathName = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathName}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("search")?.toString()}
        className="pl-8 w-full sm:w-[200px]"
      />
    </div>
  );
}
