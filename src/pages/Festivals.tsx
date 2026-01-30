import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FestivalCard } from "@/components/FestivalCard";
import { festivalsApi } from "@/lib/api";
import type { FestivalFilters, FestivalListItem, PaginatedResponse } from "@/types";
import { Loader2, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Festivals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<FestivalListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FestivalFilters>({
    country: searchParams.get("country") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    q: searchParams.get("q") || "",
    sortBy: (searchParams.get("sortBy") as FestivalFilters["sortBy"]) || "startDateAsc",
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: 10,
  });

  const fetchFestivals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await festivalsApi.getAll(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load festivals");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const updateFilters = (newFilters: Partial<FestivalFilters>) => {
    const updated = { ...filters, ...newFilters, page: newFilters.page ?? 1 };
    setFilters(updated);

    const params = new URLSearchParams();
    if (updated.country) params.set("country", updated.country);
    if (updated.startDate) params.set("startDate", updated.startDate);
    if (updated.endDate) params.set("endDate", updated.endDate);
    if (updated.q) params.set("q", updated.q);
    if (updated.sortBy) params.set("sortBy", updated.sortBy);
    if (updated.page && updated.page > 1) params.set("page", String(updated.page));
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({});
  };

  const totalPages = data ? Math.ceil(data.totalCount / (data.pageSize || 10)) : 0;

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Bachata Festivals</h1>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search festivals..."
                value={filters.q}
                onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="Any country"
              value={filters.country}
              onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">From</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">To</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                updateFilters({ sortBy: value as FestivalFilters["sortBy"] })
              }
            >
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDateAsc">Date (Earliest)</SelectItem>
                <SelectItem value="startDateDesc">Date (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button type="submit">Apply Filters</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              updateFilters({
                country: "",
                startDate: "",
                endDate: "",
                q: "",
                sortBy: "startDateAsc",
              })
            }
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchFestivals}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : !data?.items.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg text-muted-foreground">No festivals found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {data.items.length} of {data.totalCount} festivals
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === totalPages}
                onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Festivals;
