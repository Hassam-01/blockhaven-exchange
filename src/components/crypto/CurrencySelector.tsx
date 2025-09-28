import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ExchangeCurrency } from "@/lib/changenow-api-v2";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  currencies: ExchangeCurrency[];
  selectedCurrency: ExchangeCurrency | null;
  placeholder?: string;
  className?: string;
}

export default function CurrencySelector({
  value,
  onValueChange,
  currencies,
  selectedCurrency,
  placeholder = "Select currency",
  className = "w-full",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return currencies;
    const q = search.toLowerCase();
    return currencies.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q)
    );
  }, [currencies, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex items-center justify-between border-2 rounded-md px-3 py-2 text-sm ${className}`}
        style={{
          borderColor: selectedCurrency?.color || "hsl(var(--border))",
        }}
      >
        {selectedCurrency ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span
                className="text-lg font-bold shrink-0"
                style={{ color: selectedCurrency.color }}
              >
                {/* {selectedCurrency.logo} */}
                <img
                  src={selectedCurrency?.logo}
                  alt={`${selectedCurrency.name} logo`}
                  className="w-6 h-6 rounded-full shrink-0 object-cover" />
              </span>
              <span className="font-medium truncate">
                {selectedCurrency.name}
              </span>
            </div>
            <span className="ml-2 text-xs uppercase text-muted-foreground">
              {selectedCurrency.ticker}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] p-0 shadow-lg rounded-md"
        side="bottom"
        align="start"
      >
        {/* Search box */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="pl-10 pr-4 h-9"
            />
          </div>
        </div>

        {/* List */}
        <Command className="max-h-[320px] overflow-y-auto">
          <CommandGroup>
            {filtered.length === 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No currencies found
              </div>
            )}
            {filtered.map(c => (
              <CommandItem
                key={c.ticker}
                onSelect={() => {
                  onValueChange(c.ticker);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center justify-between px-3 py-3 border-b last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="text-lg font-bold shrink-0"
                    style={{ color: c.color }}
                  >
                    <img
                      src={c?.logo}
                      alt={`${c.name} logo`}
                      className="w-6 h-6 rounded-full shrink-0 object-cover" />                  </span>
                  <span className="font-medium text-sm truncate">
                    {c.name}
                  </span>
                </div>
                <span className="text-xs uppercase text-muted-foreground ml-2">
                  {c.ticker}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
