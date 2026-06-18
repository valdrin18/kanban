import { Search, SlidersHorizontal, X } from "lucide-react";
import { mandateTypes, statusOptions, teamMembers } from "../../data/board";
import { useBoardStore } from "../../store/useBoardStore";
import type { MandateType, StatusTag, TeamMember } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function FilterBar() {
  const filters = useBoardStore((state) => state.filters);
  const setFilters = useBoardStore((state) => state.setFilters);
  const clearFilters = useBoardStore((state) => state.clearFilters);
  const hasActiveFilters =
    filters.search || filters.mandateType !== "all" || filters.teamMember !== "all" || filters.status !== "all";

  return (
    <section className="rounded-[1.75rem] border border-guhr-border bg-white/76 p-3 shadow-card backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-guhr-border bg-white/80 px-3 focus-within:border-guhr-gold/70 focus-within:ring-4 focus-within:ring-guhr-gold/15">
          <Search className="h-4 w-4 shrink-0 text-guhr-muted" />
          <Input
            className="border-0 bg-transparent px-0 shadow-none focus:ring-0"
            placeholder="Search by client, email, mandate, note..."
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[620px]">
          <Select
            aria-label="Filter by mandate type"
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

          <Select
            aria-label="Filter by assigned team member"
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

          <Select
            aria-label="Filter by status"
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
        </div>

        <Button
          variant={hasActiveFilters ? "secondary" : "ghost"}
          size="sm"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="lg:ml-1"
        >
          {hasActiveFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
          Clear
        </Button>
      </div>
    </section>
  );
}
