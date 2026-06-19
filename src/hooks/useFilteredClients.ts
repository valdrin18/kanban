import { useMemo } from "react";
import { translateKnownText, translateMandateType } from "../lib/i18n";
import { useLanguageStore } from "../store/useLanguageStore";
import { useBoardStore } from "../store/useBoardStore";

export function useFilteredClients() {
  const language = useLanguageStore((state) => state.language);
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
          translateKnownText(client.notes, language),
          client.nextStep,
          translateKnownText(client.nextStep, language),
          client.mandateTypes.join(" "),
          client.mandateTypes.map((type) => translateMandateType(type, language)).join(" "),
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
  }, [clients, filters, language]);
}
