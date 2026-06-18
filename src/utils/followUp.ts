import { getColumnTitle } from "../data/board";
import type { ClientCard } from "../types";

const stageSubjects: Record<ClientCard["currentStage"], string> = {
  "new-inquiry": "Ihre Anfrage bei Guhr Steuerberatung",
  "consultation-scheduled": "Vorbereitung unseres Erstgesprächs",
  "qualified-fit": "Nächste Schritte für Ihr Mandat",
  "documents-requested": "Fehlende Unterlagen für Ihr Mandat",
  "documents-review": "Rückmeldung zu Ihren Unterlagen",
  "contract-sent": "Erinnerung: Mandatsvertrag zur Unterschrift",
  "signed-active": "Willkommen im laufenden Mandat",
  paused: "Kurze Rückfrage zu Ihrem Onboarding",
};

function salutation(name: string) {
  if (name.includes("GmbH") || name.includes("&") || name.includes("Studio")) {
    const company = name.replace(" GmbH", "").trim();
    return `Guten Tag liebes ${company}-Team,`;
  }

  const parts = name.split(" ").filter(Boolean);
  const lastName = parts[parts.length - 1] ?? name;
  const title = name.startsWith("Dr.") ? "Frau Dr." : "Frau";
  return `Guten Tag ${title} ${lastName},`;
}

function missingChecklistItems(card: ClientCard) {
  return card.checklist.filter((item) => !item.completed).map((item) => item.label);
}

function readableList(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} sowie ${items[items.length - 1]}`;
}

export function generateFollowUp(card: ClientCard) {
  const missing = missingChecklistItems(card);
  const subject = stageSubjects[card.currentStage];
  const mandate = card.mandateTypes.join(" / ");
  const missingText = missing.slice(0, 4);
  const currentStage = getColumnTitle(card.currentStage);

  const missingParagraph =
    missingText.length > 0
      ? `Für die weitere Bearbeitung Ihres Mandats im Bereich ${mandate} benötigen wir noch ${readableList(missingText)}.`
      : `Vielen Dank, die wichtigsten Unterlagen für Ihr Mandat im Bereich ${mandate} liegen uns bereits vor.`;

  const stageParagraphs: Record<ClientCard["currentStage"], string> = {
    "new-inquiry":
      "vielen Dank für Ihre Anfrage. Wir würden Ihr Anliegen gerne kurz qualifizieren und anschließend einen passenden Termin für ein Erstgespräch vorschlagen.",
    "consultation-scheduled":
      "vielen Dank für die Terminbestätigung. Zur optimalen Vorbereitung unseres Gesprächs prüfen wir vorab Ihre aktuelle steuerliche Ausgangssituation.",
    "qualified-fit":
      "vielen Dank für das angenehme Gespräch. Ihr Anliegen passt gut zu unserem digitalen Beratungsprozess, daher bereiten wir nun die nächsten Onboarding-Schritte vor.",
    "documents-requested":
      "vielen Dank für die bisherige Rückmeldung. Damit wir die interne Prüfung abschließen können, fehlen uns noch einzelne Unterlagen.",
    "documents-review":
      "vielen Dank für die übermittelten Unterlagen. Wir prüfen diese derzeit intern und melden uns, falls noch offene Punkte bestehen.",
    "contract-sent":
      "wir wollten uns kurz erkundigen, ob Sie den Mandatsvertrag bereits prüfen konnten. Sobald uns die unterschriebene Fassung vorliegt, können wir das Mandat aktivieren.",
    "signed-active":
      "herzlich willkommen im laufenden Mandat. Wir haben die Übergabe an das zuständige Team vorbereitet und melden uns mit den nächsten operativen Schritten.",
    paused:
      "wir wollten vorsichtig nachfragen, ob Sie das Onboarding fortsetzen möchten oder ob es aktuell noch einen offenen Punkt gibt, den wir klären können.",
  };

  return `Subject: ${subject}

${salutation(card.name)}

${stageParagraphs[card.currentStage]}

${missingParagraph}

Aktueller Status bei uns: ${currentStage}.

Nächster Schritt: ${card.nextStep}

Mit freundlichen Grüßen
Ihr Guhr-Team`;
}
