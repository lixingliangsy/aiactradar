import { KB } from "./agent/kb";
import type { SupportConfig } from "./support-kit/types";

export const SUPPORT: SupportConfig = {
  productSlug: "aiactradar",
  productName: "AIActRadar",
  feedbackEmail: process.env.FEEDBACK_TO_EMAIL || "lixingliangsy@163.com",
  kb: KB,
  chatHost: process.env.APP_URL || "https://aiactradar.lxsaihub.com",
  brandColor: "#0F766E",
  complianceDisclaimer: "This assistant provides decision support only; it is not legal or professional advice. For EU AI Act dates, the EUR-Lex text is authoritative.",
};
