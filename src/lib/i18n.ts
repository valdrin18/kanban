import type { BoardColumn, StatusOption } from "../types";
import type { Language } from "../store/useLanguageStore";

type TranslationKey =
  | "app.loading"
  | "app.databaseIssue"
  | "app.genericBoardError"
  | "app.supabaseConfigError"
  | "app.retry"
  | "metrics.newInquiries"
  | "metrics.waitingDocuments"
  | "metrics.overdueFollowUps"
  | "metrics.signedThisMonth"
  | "filters.searchPlaceholder"
  | "filters.allMandateTypes"
  | "filters.allTeamMembers"
  | "filters.allStatuses"
  | "filters.mandateTypeLabel"
  | "filters.teamMemberLabel"
  | "filters.statusLabel"
  | "filters.clear"
  | "board.zoomOut"
  | "board.zoomIn"
  | "board.resetZoom"
  | "column.addClient"
  | "column.empty"
  | "card.today"
  | "card.daysInStage"
  | "card.followUp"
  | "card.drag"
  | "drawer.close"
  | "drawer.save"
  | "drawer.saving"
  | "drawer.priority"
  | "drawer.followUpRecommended"
  | "drawer.clientName"
  | "drawer.email"
  | "drawer.phone"
  | "drawer.mandate"
  | "drawer.assigned"
  | "drawer.dateAdded"
  | "drawer.leadSource"
  | "drawer.currentStage"
  | "drawer.notes"
  | "drawer.notesPlaceholder"
  | "drawer.followUpGenerator"
  | "drawer.followUpDescription"
  | "drawer.generateFollowUp"
  | "drawer.generating"
  | "drawer.draftEmail"
  | "drawer.aiGenerated"
  | "drawer.copy"
  | "drawer.copied"
  | "drawer.subject"
  | "drawer.activityTimeline"
  | "drawer.aiFallbackError"
  | "add.addClientTo"
  | "add.close"
  | "add.namePlaceholder"
  | "add.emailPlaceholder"
  | "add.phonePlaceholder"
  | "add.cancel"
  | "add.addClient"
  | "add.adding"
  | "checklist.title"
  | "checklist.completed"
  | "checklist.remove"
  | "checklist.placeholder"
  | "checklist.add";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "app.loading": "Loading Supabase board data...",
    "app.databaseIssue": "Database connection issue",
    "app.genericBoardError": "Something went wrong while saving the board.",
    "app.supabaseConfigError": "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment file.",
    "app.retry": "Retry",
    "metrics.newInquiries": "New inquiries",
    "metrics.waitingDocuments": "Waiting for documents",
    "metrics.overdueFollowUps": "Overdue follow-ups",
    "metrics.signedThisMonth": "Signed this month",
    "filters.searchPlaceholder": "Search by client, email, mandate, note...",
    "filters.allMandateTypes": "All mandate types",
    "filters.allTeamMembers": "All team members",
    "filters.allStatuses": "All statuses",
    "filters.mandateTypeLabel": "Filter by mandate type",
    "filters.teamMemberLabel": "Filter by assigned team member",
    "filters.statusLabel": "Filter by status",
    "filters.clear": "Clear",
    "board.zoomOut": "Zoom out",
    "board.zoomIn": "Zoom in",
    "board.resetZoom": "Reset zoom",
    "column.addClient": "Add client",
    "column.empty": "Drop a client here or add a new onboarding card.",
    "card.today": "Today",
    "card.daysInStage": "d in stage",
    "card.followUp": "Follow-up",
    "card.drag": "Drag",
    "drawer.close": "Close drawer",
    "drawer.save": "Save",
    "drawer.saving": "Saving...",
    "drawer.priority": "priority",
    "drawer.followUpRecommended": "Follow-up recommended",
    "drawer.clientName": "Client name",
    "drawer.email": "Email",
    "drawer.phone": "Phone",
    "drawer.mandate": "Mandate",
    "drawer.assigned": "Assigned",
    "drawer.dateAdded": "Date added",
    "drawer.leadSource": "Lead source",
    "drawer.currentStage": "Current stage",
    "drawer.notes": "Notes / next steps",
    "drawer.notesPlaceholder": "Internal notes and the next useful action.",
    "drawer.followUpGenerator": "Follow-up generator",
    "drawer.followUpDescription": "Uses OpenAI to analyze stage, notes, missing checklist items and next step.",
    "drawer.generateFollowUp": "Generate Follow-Up",
    "drawer.generating": "Generating...",
    "drawer.draftEmail": "Draft email",
    "drawer.aiGenerated": "AI-generated",
    "drawer.copy": "Copy",
    "drawer.copied": "Copied",
    "drawer.subject": "Subject:",
    "drawer.activityTimeline": "Activity timeline",
    "drawer.aiFallbackError": "Could not generate the follow-up email. Please check the AI configuration.",
    "add.addClientTo": "Add client to",
    "add.close": "Close add client",
    "add.namePlaceholder": "Example GmbH",
    "add.emailPlaceholder": "client@example.de",
    "add.phonePlaceholder": "+49 30 ...",
    "add.cancel": "Cancel",
    "add.addClient": "Add client",
    "add.adding": "Adding...",
    "checklist.title": "Tax onboarding checklist",
    "checklist.completed": "completed",
    "checklist.remove": "Remove",
    "checklist.placeholder": "Add checklist item",
    "checklist.add": "Add",
  },
  de: {
    "app.loading": "Supabase-Boarddaten werden geladen...",
    "app.databaseIssue": "Problem mit der Datenbankverbindung",
    "app.genericBoardError": "Beim Speichern des Boards ist ein Fehler aufgetreten.",
    "app.supabaseConfigError": "Supabase ist nicht konfiguriert. Fügen Sie VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY zur Umgebungsdatei hinzu.",
    "app.retry": "Erneut versuchen",
    "metrics.newInquiries": "Neue Anfragen",
    "metrics.waitingDocuments": "Warten auf Unterlagen",
    "metrics.overdueFollowUps": "Überfällige Follow-ups",
    "metrics.signedThisMonth": "Diesen Monat aktiv",
    "filters.searchPlaceholder": "Nach Mandant, E-Mail, Mandat, Notiz suchen...",
    "filters.allMandateTypes": "Alle Mandatsarten",
    "filters.allTeamMembers": "Alle Teammitglieder",
    "filters.allStatuses": "Alle Status",
    "filters.mandateTypeLabel": "Nach Mandatsart filtern",
    "filters.teamMemberLabel": "Nach zuständigem Teammitglied filtern",
    "filters.statusLabel": "Nach Status filtern",
    "filters.clear": "Zurücksetzen",
    "board.zoomOut": "Herauszoomen",
    "board.zoomIn": "Hineinzoomen",
    "board.resetZoom": "Zoom zurücksetzen",
    "column.addClient": "Mandant hinzufügen",
    "column.empty": "Mandant hier ablegen oder neue Onboarding-Karte hinzufügen.",
    "card.today": "Heute",
    "card.daysInStage": "Tage in Phase",
    "card.followUp": "Follow-up",
    "card.drag": "Ziehen",
    "drawer.close": "Detailansicht schließen",
    "drawer.save": "Speichern",
    "drawer.saving": "Speichert...",
    "drawer.priority": "Priorität",
    "drawer.followUpRecommended": "Follow-up empfohlen",
    "drawer.clientName": "Mandantenname",
    "drawer.email": "E-Mail",
    "drawer.phone": "Telefon",
    "drawer.mandate": "Mandat",
    "drawer.assigned": "Zuständig",
    "drawer.dateAdded": "Angelegt am",
    "drawer.leadSource": "Lead-Quelle",
    "drawer.currentStage": "Aktuelle Phase",
    "drawer.notes": "Notizen / nächste Schritte",
    "drawer.notesPlaceholder": "Interne Notizen und der nächste sinnvolle Schritt.",
    "drawer.followUpGenerator": "Follow-up-Generator",
    "drawer.followUpDescription": "Analysiert mit OpenAI Phase, Notizen, fehlende Checklistenpunkte und nächsten Schritt.",
    "drawer.generateFollowUp": "Follow-up generieren",
    "drawer.generating": "Generiert...",
    "drawer.draftEmail": "E-Mail-Entwurf",
    "drawer.aiGenerated": "KI-generiert",
    "drawer.copy": "Kopieren",
    "drawer.copied": "Kopiert",
    "drawer.subject": "Betreff:",
    "drawer.activityTimeline": "Aktivitätsverlauf",
    "drawer.aiFallbackError": "Die Follow-up-E-Mail konnte nicht generiert werden. Bitte prüfen Sie die KI-Konfiguration.",
    "add.addClientTo": "Mandant hinzufügen zu",
    "add.close": "Mandant-hinzufügen schließen",
    "add.namePlaceholder": "Beispiel GmbH",
    "add.emailPlaceholder": "mandant@example.de",
    "add.phonePlaceholder": "+49 30 ...",
    "add.cancel": "Abbrechen",
    "add.addClient": "Mandant hinzufügen",
    "add.adding": "Wird hinzugefügt...",
    "checklist.title": "Steuerliche Onboarding-Checkliste",
    "checklist.completed": "erledigt",
    "checklist.remove": "Entfernen",
    "checklist.placeholder": "Checklistenpunkt hinzufügen",
    "checklist.add": "Hinzufügen",
  },
};

const columnTranslations: Record<string, { en: [string, string]; de: [string, string] }> = {
  "new-inquiry": {
    en: ["New Inquiry", "First contact received, not yet qualified."],
    de: ["Neue Anfrage", "Erstkontakt eingegangen, noch nicht qualifiziert."],
  },
  "consultation-scheduled": {
    en: ["Initial Consultation Scheduled", "Meeting booked, awaiting first call."],
    de: ["Erstgespräch terminiert", "Termin gebucht, Erstgespräch steht noch aus."],
  },
  "qualified-fit": {
    en: ["Qualified / Mandate Fit", "Mandate type confirmed and client appears to be a good fit."],
    de: ["Qualifiziert / Mandatsfit", "Mandatsart bestätigt und Mandant passt voraussichtlich gut."],
  },
  "documents-requested": {
    en: ["Vollmacht & Documents Requested", "Power of attorney, master data, and tax documents requested."],
    de: ["Vollmacht & Unterlagen angefordert", "Vollmacht, Stammdaten und Steuerunterlagen angefordert."],
  },
  "documents-review": {
    en: ["Documents Received / Review", "Documents are in and internal review is in progress."],
    de: ["Unterlagen erhalten / Prüfung", "Unterlagen liegen vor und werden intern geprüft."],
  },
  "contract-sent": {
    en: ["Mandatsvertrag Sent", "Engagement letter or contract has been sent."],
    de: ["Mandatsvertrag versendet", "Mandatsvertrag wurde an den Mandanten versendet."],
  },
  "signed-active": {
    en: ["Signed & Active", "Client fully onboarded and handed over to the team."],
    de: ["Unterschrieben & aktiv", "Mandant vollständig onboarded und an das Team übergeben."],
  },
  paused: {
    en: ["On Hold / Paused", "Onboarding stalled, delayed, or paused."],
    de: ["Pausiert / zurückgestellt", "Onboarding ist blockiert, verzögert oder pausiert."],
  },
};

const statusTranslations: Record<string, { en: string; de: string }> = {
  "new-lead": { en: "New lead", de: "Neue Anfrage" },
  "consultation-booked": { en: "Consultation booked", de: "Termin gebucht" },
  qualified: { en: "Qualified", de: "Qualifiziert" },
  "waiting-documents": { en: "Waiting documents", de: "Warten auf Unterlagen" },
  "missing-documents": { en: "Missing documents", de: "Fehlende Unterlagen" },
  "internal-review": { en: "Internal review", de: "Interne Prüfung" },
  "awaiting-signature": { en: "Awaiting signature", de: "Warten auf Unterschrift" },
  active: { en: "Active", de: "Aktiv" },
  paused: { en: "Paused", de: "Pausiert" },
};

const priorityTranslations: Record<string, { en: string; de: string }> = {
  Low: { en: "Low", de: "Niedrig" },
  Normal: { en: "Normal", de: "Normal" },
  High: { en: "High", de: "Hoch" },
};

const leadSourceTranslations: Record<string, { en: string; de: string }> = {
  "Website inquiry": { en: "Website inquiry", de: "Website-Anfrage" },
  "Google Search": { en: "Google Search", de: "Google-Suche" },
  LinkedIn: { en: "LinkedIn", de: "LinkedIn" },
  "Referral from existing client": { en: "Referral from existing client", de: "Empfehlung durch Bestandsmandant" },
  "Partner recommendation": { en: "Partner recommendation", de: "Partnerempfehlung" },
  "Instagram profile": { en: "Instagram profile", de: "Instagram-Profil" },
  "Local business network": { en: "Local business network", de: "Lokales Unternehmernetzwerk" },
  "Tax newsletter": { en: "Tax newsletter", de: "Steuer-Newsletter" },
  "Existing network": { en: "Existing network", de: "Bestehendes Netzwerk" },
  "Manual entry": { en: "Manual entry", de: "Manuelle Eingabe" },
};

const mandateTranslations: Record<string, { en: string; de: string }> = {
  Einkommensteuer: { en: "Income tax", de: "Einkommensteuer" },
  GmbH: { en: "GmbH", de: "GmbH" },
  Freelancer: { en: "Freelancer", de: "Freiberufler" },
  Steuerberaterwechsel: { en: "Tax advisor change", de: "Steuerberaterwechsel" },
  Finanzbuchhaltung: { en: "Financial accounting", de: "Finanzbuchhaltung" },
  Lohnbuchhaltung: { en: "Payroll accounting", de: "Lohnbuchhaltung" },
  Jahresabschluss: { en: "Annual financial statements", de: "Jahresabschluss" },
  Heilberufe: { en: "Healthcare professions", de: "Heilberufe" },
  Rechtsanwälte: { en: "Lawyers", de: "Rechtsanwälte" },
  Architekten: { en: "Architects", de: "Architekten" },
  "IT-Beratung": { en: "IT consulting", de: "IT-Beratung" },
  "Influencer / Creator": { en: "Influencer / Creator", de: "Influencer / Creator" },
  Praxisgründung: { en: "Practice founding", de: "Praxisgründung" },
};

const recommendedActionTranslations: Record<string, { en: string; de: string }> = {
  "new-inquiry": {
    en: "Qualify inquiry and schedule consultation.",
    de: "Anfrage qualifizieren und Erstgespräch terminieren.",
  },
  "consultation-scheduled": {
    en: "Prepare consultation notes.",
    de: "Gesprächsnotizen vorbereiten.",
  },
  "qualified-fit": {
    en: "Request master data and onboarding documents.",
    de: "Stammdaten und Onboarding-Unterlagen anfordern.",
  },
  "documents-requested": {
    en: "Check missing documents and send reminder.",
    de: "Fehlende Unterlagen prüfen und Erinnerung senden.",
  },
  "documents-review": {
    en: "Review completeness and assign internal owner.",
    de: "Vollständigkeit prüfen und interne Zuständigkeit festlegen.",
  },
  "contract-sent": {
    en: "Follow up if not signed within 3 days.",
    de: "Nachfassen, falls nicht innerhalb von 3 Tagen unterschrieben.",
  },
  "signed-active": {
    en: "Hand over to responsible team.",
    de: "An zuständiges Team übergeben.",
  },
  paused: {
    en: "Clarify blocker or archive if inactive.",
    de: "Blocker klären oder bei Inaktivität archivieren.",
  },
};

const knownTextTranslations: Record<string, { en: string; de: string }> = {
  "Prepare onboarding context and confirm next step.": {
    en: "Prepare onboarding context and confirm next step.",
    de: "Onboarding-Kontext vorbereiten und nächsten Schritt bestätigen.",
  },
  "Review onboarding context and prepare next step.": {
    en: "Review onboarding context and prepare next step.",
    de: "Onboarding-Kontext prüfen und nächsten Schritt vorbereiten.",
  },
  "Send reminder for missing Vollmacht and DATEV export.": {
    en: "Send reminder for missing Vollmacht and DATEV export.",
    de: "Erinnerung wegen fehlender Vollmacht und DATEV-Export senden.",
  },
  "Prepare questions about income structure and current tax setup.": {
    en: "Prepare questions about income structure and current tax setup.",
    de: "Fragen zur Einkommensstruktur und aktuellen steuerlichen Einrichtung vorbereiten.",
  },
  "Qualify mandate type and revenue situation.": {
    en: "Qualify mandate type and revenue situation.",
    de: "Mandatsart und Umsatzsituation qualifizieren.",
  },
  "Follow up on engagement letter.": {
    en: "Follow up on engagement letter.",
    de: "Zum Mandatsvertrag nachfassen.",
  },
  "Review documents and identify open items.": {
    en: "Review documents and identify open items.",
    de: "Unterlagen prüfen und offene Punkte identifizieren.",
  },
  "Request Stammdaten and previous advisor details.": {
    en: "Request Stammdaten and previous advisor details.",
    de: "Stammdaten und Angaben zum bisherigen Berater anfordern.",
  },
  "Clarify whether client wants to continue onboarding.": {
    en: "Clarify whether client wants to continue onboarding.",
    de: "Klären, ob der Mandant das Onboarding fortsetzen möchte.",
  },
  "Request employee count and payroll history.": {
    en: "Request employee count and payroll history.",
    de: "Mitarbeiterzahl und Lohnabrechnungshistorie anfordern.",
  },
  "Hand over to responsible team.": {
    en: "Hand over to responsible team.",
    de: "An das zuständige Team übergeben.",
  },
  "Client wants monthly bookkeeping to start before the next VAT pre-registration.": {
    en: "Client wants monthly bookkeeping to start before the next VAT pre-registration.",
    de: "Mandant möchte die monatliche Buchhaltung vor der nächsten Umsatzsteuervoranmeldung starten.",
  },
  "Freelance software consultant with mixed German and EU clients.": {
    en: "Freelance software consultant with mixed German and EU clients.",
    de: "Freiberufliche Softwareberaterin mit deutschen und EU-Kunden.",
  },
  "Creator collective with sponsorship and platform revenue.": {
    en: "Creator collective with sponsorship and platform revenue.",
    de: "Creator-Kollektiv mit Sponsoring- und Plattformumsätzen.",
  },
  "Legal partnership needs clarity around trust account handling and monthly reporting.": {
    en: "Legal partnership needs clarity around trust account handling and monthly reporting.",
    de: "Anwaltssozietät benötigt Klärung zu Fremdgeldkonten und monatlichem Reporting.",
  },
  "Practice opening planned for next quarter; investment plan and registration documents arrived.": {
    en: "Practice opening planned for next quarter; investment plan and registration documents arrived.",
    de: "Praxiseröffnung für das nächste Quartal geplant; Investitionsplan und Anmeldedokumente liegen vor.",
  },
  "Client is switching advisors and has open VAT deadlines.": {
    en: "Client is switching advisors and has open VAT deadlines.",
    de: "Mandant wechselt den Steuerberater und hat offene USt-Fristen.",
  },
  "Client paused onboarding during internal partner decision.": {
    en: "Client paused onboarding during internal partner decision.",
    de: "Mandant hat das Onboarding während einer internen Partnerentscheidung pausiert.",
  },
  "Growing team with 18 employees and two Werkstudenten.": {
    en: "Growing team with 18 employees and two Werkstudenten.",
    de: "Wachsendes Team mit 18 Mitarbeitenden und zwei Werkstudenten.",
  },
  "Onboarding completed. Team handover completed with bookkeeping owner.": {
    en: "Onboarding completed. Team handover completed with bookkeeping owner.",
    de: "Onboarding abgeschlossen. Übergabe an die zuständige Buchhaltung abgeschlossen.",
  },
  "Client card created": { en: "Client card created", de: "Mandantenkarte erstellt" },
  "Client details updated": { en: "Client details updated", de: "Mandantendetails aktualisiert" },
  "Stage updated": { en: "Stage updated", de: "Phase aktualisiert" },
  "Checklist item completed": { en: "Checklist item completed", de: "Checklistenpunkt erledigt" },
  "Checklist item reopened": { en: "Checklist item reopened", de: "Checklistenpunkt wieder geöffnet" },
  "Documents requested": { en: "Documents requested", de: "Unterlagen angefordert" },
  "Inquiry qualified": { en: "Inquiry qualified", de: "Anfrage qualifiziert" },
  "Consultation scheduled": { en: "Consultation scheduled", de: "Erstgespräch terminiert" },
  "New inquiry received": { en: "New inquiry received", de: "Neue Anfrage eingegangen" },
  "Mandatsvertrag sent": { en: "Mandatsvertrag sent", de: "Mandatsvertrag versendet" },
  "Internal review completed": { en: "Internal review completed", de: "Interne Prüfung abgeschlossen" },
  "Documents moved to review": { en: "Documents moved to review", de: "Unterlagen in Prüfung verschoben" },
  "Onboarding documents requested": { en: "Onboarding documents requested", de: "Onboarding-Unterlagen angefordert" },
  "Mandate fit confirmed": { en: "Mandate fit confirmed", de: "Mandatsfit bestätigt" },
  "Onboarding paused": { en: "Onboarding paused", de: "Onboarding pausiert" },
  "Initial consultation completed": { en: "Initial consultation completed", de: "Erstgespräch abgeschlossen" },
  "Inquiry received": { en: "Inquiry received", de: "Anfrage eingegangen" },
  "Signed & active": { en: "Signed & active", de: "Unterschrieben & aktiv" },
  "Document review completed": { en: "Document review completed", de: "Unterlagenprüfung abgeschlossen" },
  "Vollmacht, DATEV export and bank statements requested.": {
    en: "Vollmacht, DATEV export and bank statements requested.",
    de: "Vollmacht, DATEV-Export und Kontoauszüge angefordert.",
  },
  "Mandate fit confirmed after founder call.": {
    en: "Mandate fit confirmed after founder call.",
    de: "Mandatsfit nach Gründer-Call bestätigt.",
  },
  "Introductory call booked for this week.": {
    en: "Introductory call booked for this week.",
    de: "Einführungsgespräch für diese Woche gebucht.",
  },
  "Lead came in through the website contact form.": {
    en: "Lead came in through the website contact form.",
    de: "Lead kam über das Kontaktformular der Website.",
  },
  "Team requested support for creator revenue and VAT topics.": {
    en: "Team requested support for creator revenue and VAT topics.",
    de: "Team bat um Unterstützung bei Creator-Umsätzen und USt-Themen.",
  },
  "Engagement letter sent to managing partner for signature.": {
    en: "Engagement letter sent to managing partner for signature.",
    de: "Mandatsvertrag zur Unterschrift an den Partner gesendet.",
  },
  "Open questions around trust accounts clarified.": {
    en: "Open questions around trust accounts clarified.",
    de: "Offene Fragen zu Fremdgeldkonten geklärt.",
  },
  "Initial package received through secure upload.": {
    en: "Initial package received through secure upload.",
    de: "Erstes Unterlagenpaket über sicheren Upload erhalten.",
  },
  "Requested founding timeline and practice documents.": {
    en: "Requested founding timeline and practice documents.",
    de: "Gründungszeitplan und Praxisunterlagen angefordert.",
  },
  "Missing Stammdaten and previous advisor contact details.": {
    en: "Missing Stammdaten and previous advisor contact details.",
    de: "Stammdaten und Kontaktangaben des bisherigen Beraters fehlen.",
  },
  "Advisor switch accepted after deadline check.": {
    en: "Advisor switch accepted after deadline check.",
    de: "Beraterwechsel nach Fristenprüfung angenommen.",
  },
  "Client asked to pause until partners approve the advisory budget.": {
    en: "Client asked to pause until partners approve the advisory budget.",
    de: "Mandant bat um Pause, bis die Partner das Beratungsbudget freigeben.",
  },
  "Potential Jahresabschluss mandate discussed.": {
    en: "Potential Jahresabschluss mandate discussed.",
    de: "Mögliches Jahresabschlussmandat besprochen.",
  },
  "Payroll scope appears suitable for Guhr onboarding.": {
    en: "Payroll scope appears suitable for Guhr onboarding.",
    de: "Lohnumfang wirkt passend für das Guhr-Onboarding.",
  },
  "Newsletter reply asking about payroll support.": {
    en: "Newsletter reply asking about payroll support.",
    de: "Newsletter-Antwort mit Anfrage zur Lohnunterstützung.",
  },
  "Mandatsvertrag signed and handover completed.": {
    en: "Mandatsvertrag signed and handover completed.",
    de: "Mandatsvertrag unterschrieben und Übergabe abgeschlossen.",
  },
  "Initial bookkeeping package approved.": {
    en: "Initial bookkeeping package approved.",
    de: "Erstes Buchhaltungspaket freigegeben.",
  },
};

const checklistLabelTranslations: Record<string, { en: string; de: string }> = {
  "Stammdaten received": { en: "Master data received", de: "Stammdaten erhalten" },
  "Steuer-ID / tax number received": { en: "Tax ID / tax number received", de: "Steuer-ID / Steuernummer erhalten" },
  "Relevant tax documents received": { en: "Relevant tax documents received", de: "Relevante Steuerunterlagen erhalten" },
  "Vollmacht signed": { en: "Power of attorney signed", de: "Vollmacht unterschrieben" },
  "Mandatsvertrag signed": { en: "Engagement letter signed", de: "Mandatsvertrag unterschrieben" },
  "Handelsregisterauszug received": { en: "Commercial register extract received", de: "Handelsregisterauszug erhalten" },
  "Gesellschaftsvertrag received": { en: "Articles of association received", de: "Gesellschaftsvertrag erhalten" },
  "Previous Jahresabschluss received": { en: "Previous annual financial statements received", de: "Vorheriger Jahresabschluss erhalten" },
  "Bank statements received": { en: "Bank statements received", de: "Kontoauszüge erhalten" },
  "DATEV export requested": { en: "DATEV export requested", de: "DATEV-Export angefordert" },
  "Steuer-ID received": { en: "Tax ID received", de: "Steuer-ID erhalten" },
  "Basic income overview received": { en: "Basic income overview received", de: "Einnahmenübersicht erhalten" },
  "Invoices / receipts received": { en: "Invoices / receipts received", de: "Rechnungen / Belege erhalten" },
  "Previous tax assessment received": { en: "Previous tax assessment received", de: "Vorheriger Steuerbescheid erhalten" },
  "Previous advisor contacted": { en: "Previous advisor contacted", de: "Bisherigen Berater kontaktiert" },
  "Open deadlines reviewed": { en: "Open deadlines reviewed", de: "Offene Fristen geprüft" },
  "Accounting scope confirmed": { en: "Accounting scope confirmed", de: "Buchhaltungsumfang bestätigt" },
  "Bank access clarified": { en: "Bank access clarified", de: "Bankzugang geklärt" },
  "Document upload process explained": { en: "Document upload process explained", de: "Belegupload-Prozess erklärt" },
  "DATEV Unternehmen online invited": { en: "DATEV Unternehmen online invited", de: "DATEV Unternehmen online eingeladen" },
  "Employee count received": { en: "Employee count received", de: "Mitarbeiterzahl erhalten" },
  "Payroll start date confirmed": { en: "Payroll start date confirmed", de: "Startdatum der Lohnabrechnung bestätigt" },
  "ELStAM access clarified": { en: "ELStAM access clarified", de: "ELStAM-Zugang geklärt" },
  "Social security registrations reviewed": { en: "Social security registrations reviewed", de: "Sozialversicherungsmeldungen geprüft" },
  "Payroll history received": { en: "Payroll history received", de: "Lohnhistorie erhalten" },
  "Trial balance received": { en: "Trial balance received", de: "Summen- und Saldenliste erhalten" },
  "Open items list received": { en: "Open items list received", de: "OPOS-Liste erhalten" },
  "Fixed asset schedule received": { en: "Fixed asset schedule received", de: "Anlagenspiegel erhalten" },
  "Practice registration details received": { en: "Practice registration details received", de: "Praxis-Anmeldedaten erhalten" },
  "Revenue split clarified": { en: "Revenue split clarified", de: "Umsatzaufteilung geklärt" },
  "Insurance documents received": { en: "Insurance documents received", de: "Versicherungsunterlagen erhalten" },
  "Registration documents received": { en: "Registration documents received", de: "Anmeldedokumente erhalten" },
  "Investment plan received": { en: "Investment plan received", de: "Investitionsplan erhalten" },
  "Professional registration confirmed": { en: "Professional registration confirmed", de: "Berufsrechtliche Registrierung bestätigt" },
  "Trust account handling clarified": { en: "Trust account handling clarified", de: "Fremdgeldkonto-Behandlung geklärt" },
  "Revenue model reviewed": { en: "Revenue model reviewed", de: "Umsatzmodell geprüft" },
  "Project revenue overview received": { en: "Project revenue overview received", de: "Projektumsatzübersicht erhalten" },
  "Open project list received": { en: "Open project list received", de: "Liste offener Projekte erhalten" },
  "Service scope confirmed": { en: "Service scope confirmed", de: "Leistungsumfang bestätigt" },
  "Revenue structure reviewed": { en: "Revenue structure reviewed", de: "Umsatzstruktur geprüft" },
  "VAT setup clarified": { en: "VAT setup clarified", de: "Umsatzsteuer-Setup geklärt" },
  "Platform revenue overview received": { en: "Platform revenue overview received", de: "Plattformumsatz-Übersicht erhalten" },
  "Sponsorship contracts requested": { en: "Sponsorship contracts requested", de: "Sponsoring-Verträge angefordert" },
  "Expense categories reviewed": { en: "Expense categories reviewed", de: "Ausgabenkategorien geprüft" },
  "VAT treatment clarified": { en: "VAT treatment clarified", de: "Umsatzsteuerliche Behandlung geklärt" },
  "Founding timeline confirmed": { en: "Founding timeline confirmed", de: "Gründungszeitplan bestätigt" },
  "Bank account setup clarified": { en: "Bank account setup clarified", de: "Bankkonto-Setup geklärt" },
};

const textToCanonical = new Map<string, string>();
const checklistTextToCanonical = new Map<string, string>();

Object.entries(knownTextTranslations).forEach(([canonical, values]) => {
  textToCanonical.set(canonical, canonical);
  textToCanonical.set(values.en, canonical);
  textToCanonical.set(values.de, canonical);
});

Object.entries(checklistLabelTranslations).forEach(([canonical, values]) => {
  checklistTextToCanonical.set(canonical, canonical);
  checklistTextToCanonical.set(values.en, canonical);
  checklistTextToCanonical.set(values.de, canonical);
});

export function t(language: Language, key: TranslationKey) {
  return translations[language][key] ?? translations.en[key];
}

export function translateColumn(column: BoardColumn, language: Language) {
  const translated = columnTranslations[column.id]?.[language];
  return {
    ...column,
    title: translated?.[0] ?? column.title,
    description: translated?.[1] ?? column.description,
  };
}

export function translateColumnTitle(columnId: string, fallback: string, language: Language) {
  return columnTranslations[columnId]?.[language][0] ?? fallback;
}

export function translateStatusLabel(status: StatusOption, language: Language) {
  return {
    ...status,
    label: statusTranslations[status.value]?.[language] ?? status.label,
  };
}

export function translatePriority(priority: string, language: Language) {
  return priorityTranslations[priority]?.[language] ?? priority;
}

export function translateLeadSource(source: string, language: Language) {
  return leadSourceTranslations[source]?.[language] ?? source;
}

export function translateMandateType(type: string, language: Language) {
  return mandateTranslations[type]?.[language] ?? type;
}

export function translateRecommendedAction(stage: string, language: Language) {
  return recommendedActionTranslations[stage]?.[language] ?? "";
}

export function translateKnownText(text: string | undefined, language: Language) {
  if (!text) return "";

  const canonical = textToCanonical.get(text) ?? text;
  let translated = knownTextTranslations[canonical]?.[language] ?? text;
  Object.entries(columnTranslations).forEach(([columnId, values]) => {
    translated = translated.split(values.en[0]).join(values[language][0]);
    translated = translated.split(columnId).join(values[language][0]);
  });

  if (language === "de") {
    translated = translated
      .replace(/^Added directly to (.+)\.$/, "Direkt zu $1 hinzugefügt.")
      .replace(/^Stage changed to (.+)\.$/, "Phase geändert zu $1.")
      .replace(/^Moved from (.+) to (.+)\.$/, "Verschoben von $1 nach $2.");
  }

  return translated;
}

export function canonicalKnownText(text: string) {
  return textToCanonical.get(text) ?? text;
}

export function translateChecklistLabel(label: string, language: Language) {
  const canonical = checklistTextToCanonical.get(label) ?? label;
  return checklistLabelTranslations[canonical]?.[language] ?? label;
}

export function canonicalChecklistLabel(label: string) {
  return checklistTextToCanonical.get(label) ?? label;
}

export function localeForLanguage(language: Language) {
  return language === "de" ? "de-DE" : "en-GB";
}

export function outputLanguageName(language: Language) {
  return language === "de" ? "German" : "English";
}
