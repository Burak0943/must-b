/**
 * planConstants.ts
 *
 * Core plan helpers and metadata definitions for the Must-b Platform.
 */

export const PLAN_META = {
  Free:  { label: "Free",  ring: "#484F58" },
  Core:  { label: "Core",  ring: "#3B82F6" },
  Pro:   { label: "Pro",   ring: "#6366F1" },
  Elite: { label: "Elite", ring: "#8B5CF6" },
  Root:  { label: "Root",  ring: "#8B5CF6" },
} as const;

export function normalizePlan(raw?: string | null): "Free" | "Core" | "Elite" | "Root" | "Pro" {
  const p = (raw ?? "Free").toLowerCase();
  if (p === "root")  return "Root";
  if (p === "elite") return "Elite";
  if (p === "core")  return "Core";
  if (p === "pro")   return "Pro";
  return "Free";
}
