import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ExchangeCurrency } from "@/lib/blockhaven-exchange-api";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  currencies: ExchangeCurrency[];
  selectedCurrency: ExchangeCurrency | null;
  placeholder?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CurrencySelector({
  value,
  onValueChange,
  currencies,
  selectedCurrency,
  placeholder = "Select currency",
  className = "w-full",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const filtered = useMemo(() => {
    if (!search.trim()) {
      // Filter out currencies with null/undefined network
      return currencies.filter(
        (c) =>
          c.network !== null &&
          c.network !== undefined &&
          c.network.trim() !== ""
      );
    }
    const q = search.toLowerCase();
    return currencies.filter(
      (c) =>
        c.network !== null &&
        c.network !== undefined &&
        c.network.trim() !== "" &&
        (c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q))
    );
  }, [currencies, search]);

  // Add currency count info
  const currencyStats = useMemo(() => {
    const total = currencies.length;
    const featured = currencies.filter((c) => c.featured).length;
    const stable = currencies.filter((c) => c.isStable).length;
    return { total, featured, stable };
  }, [currencies]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex items-center justify-between border-2 rounded-md px-3 py-2 text-sm bg-background text-foreground ${className}`}
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
                {/* Only show image if logo exists, and no alt if missing */}
                {selectedCurrency?.logo && (
                  <img
                    src={selectedCurrency.logo}
                    alt=""
                    className="w-6 h-6 rounded-full shrink-0 object-cover"
                  />
                )}
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
        className="w-[340px] p-0 shadow-lg rounded-md border border-border/50"
        side="bottom"
        align="start"
      >
        {/* Header with stats */}
        <div className="px-4 py-2 border-b bg-muted/30">
          <div className="text-xs text-muted-foreground">
            {filtered.length} of {currencyStats.total} currencies •{" "}
            {currencyStats.featured} featured • {30} stable
          </div>
        </div>

        {/* Search box */}
        <div className="p-3 border-b bg-muted/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="pl-10 pr-4 h-9 border-0 bg-background"
            />
          </div>
        </div>

        {/* List with enhanced scrolling */}
        <Command className="max-h-[420px] overflow-hidden">
          <CommandGroup className="overflow-y-auto max-h-[420px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <div className="text-base mb-2">No currencies found</div>
                <div className="text-xs">Try adjusting your search terms</div>
              </div>
            )}
            {filtered?.map((c, index) => (
              <CommandItem
                key={`${c.ticker}-${c.network}`}
                onSelect={() => {
                  onValueChange(c.ticker);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    {/* Only show image if logo exists, and no alt if missing */}
                    {c?.logo && (
                      <img
                        src={c.logo}
                        alt=""
                        className="w-8 h-8 rounded-full shrink-0 object-cover border border-border/20"
                        loading="lazy"
                      />
                    )}
                    {c.featured && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-background"></div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {c.name}
                      </span>
                      {c.isStable && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded font-medium">
                          STABLE
                        </span>
                      )}
                    </div>
                    {c.network && c.network !== "mainnet" && (
                      <span className="text-xs text-muted-foreground truncate">
                        {c.network}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs uppercase text-muted-foreground ml-2 font-mono">
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
