import { useMemo } from "react";
import { useBoardStore } from "../store/useBoardStore";

export function useFilteredClients() {
  const clients = useBoardStore((state) => state.clients);
  const filters = useBoardStore((state) => state.filters);

  return useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return clients.filter((client) => {
      const searchMatches =
        query.length === 0 ||
        [
          client.name,
          client.email,
          client.phone,
          client.notes,
          client.nextStep,
          client.mandateTypes.join(" "),
          client.assignedTo,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const mandateMatches =
        filters.mandateType === "all" || client.mandateTypes.includes(filters.mandateType);
      const memberMatches =
        filters.teamMember === "all" || client.assignedTo === filters.teamMember;
      const statusMatches = filters.status === "all" || client.status === filters.status;

      return searchMatches && mandateMatches && memberMatches && statusMatches;
    });
  }, [clients, filters]);
}
