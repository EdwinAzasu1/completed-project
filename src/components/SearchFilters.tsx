import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onPriceRangeChange?: (min: string, max: string) => void;
}

export default function SearchFilters({ onSearch, onPriceRangeChange }: SearchFiltersProps) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    onPriceRangeChange?.(value, maxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    onPriceRangeChange?.(minPrice, value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by hostel name, description, or owner..."
          className="pl-10"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price (GH₵)</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price (GH₵)</Label>
          <Input
            type="number"
            min="0"
            placeholder="No limit"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />
        </div>
      </div>
      
      <Button variant="outline" className="w-full md:w-auto">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        More Filters
      </Button>
    </div>
  );
}