"use client";
import React, { useState, useCallback, Suspense } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500),
    [router, pathname]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.flush();
  };

  return (
    <Suspense>
      <form onSubmit={handleSubmit} className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search ....."
          className="pl-10 pr-4 py-2 w-64 rounded-full"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </form>
      <div className="sm:hidden px-4 py-2">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search ....."
            className="pl-10 pr-4 py-2 w-full rounded-full"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </Suspense>
  );
}

// Debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T & { flush: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      func();
    }
  };

  return debounced as T & { flush: () => void };
}
