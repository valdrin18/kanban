import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { mandateTypes, statusOptions, teamMembers } from "../../data/board";
import { useBoardStore } from "../../store/useBoardStore";
import type { MandateType, StatusTag, TeamMember } from "../../types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function FilterBar() {
  const filters = useBoardStore((state) => state.filters);
  const setFilters = useBoardStore((state) => state.setFilters);
  const clearFilters = useBoardStore((state) => state.clearFilters);
  const hasActiveFilters =
    filters.search || filters.mandateType !== "all" || filters.teamMember !== "all" || filters.status !== "all";

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-[1.35rem] border border-guhr-border/55 bg-white/90 px-4 shadow-card backdrop-blur transition focus-within:border-guhr-gold/45 focus-within:shadow-card">
          <Search className="h-5 w-5 shrink-0 text-guhr-muted/65" />
          <Input
            className="h-11 border-0 bg-transparent px-0 text-sm shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            placeholder="Search by client, email, mandate, note..."
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
          />
        </div>

      <div className="grid gap-2 sm:grid-cols-3 lg:w-[720px]">
        <FilterSelect>
            <Select
              aria-label="Filter by mandate type"
              className="h-12 appearance-none rounded-[1.1rem] border-guhr-border/55 bg-white/90 px-4 pr-10 text-sm shadow-card backdrop-blur focus:ring-guhr-gold/10"
              value={filters.mandateType}
              onChange={(event) =>
                setFilters({ mandateType: event.target.value as "all" | MandateType })
              }
            >
              <option value="all">All mandate types</option>
              {mandateTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FilterSelect>

        <FilterSelect>
            <Select
              aria-label="Filter by assigned team member"
              className="h-12 appearance-none rounded-[1.1rem] border-guhr-border/55 bg-white/90 px-4 pr-10 text-sm shadow-card backdrop-blur focus:ring-guhr-gold/10"
              value={filters.teamMember}
              onChange={(event) =>
                setFilters({ teamMember: event.target.value as "all" | TeamMember })
              }
            >
              <option value="all">All team members</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </Select>
          </FilterSelect>

        <FilterSelect>
            <Select
              aria-label="Filter by status"
              className="h-12 appearance-none rounded-[1.1rem] border-guhr-border/55 bg-white/90 px-4 pr-10 text-sm shadow-card backdrop-blur focus:ring-guhr-gold/10"
              value={filters.status}
              onChange={(event) => setFilters({ status: event.target.value as "all" | StatusTag })}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </FilterSelect>
        </div>

      <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[1.1rem] px-3 text-sm font-medium text-guhr-muted transition hover:bg-white/75 hover:text-guhr-text disabled:cursor-not-allowed disabled:opacity-45 lg:min-w-24"
        >
        {hasActiveFilters ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
          Clear
      </button>
    </section>
  );
}

interface FilterSelectProps {
  children: React.ReactNode;
}

function FilterSelect({ children }: FilterSelectProps) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-guhr-text/80" />
    </div>
  );
}
