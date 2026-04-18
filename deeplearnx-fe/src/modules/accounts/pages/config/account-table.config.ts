import {
  ACTIVE,
  APPROVED,
  APPROVING,
  LOCKED,
  REJECTED,
} from "@/libs/constants/status.constant";

export const colorCell = (refColor: string[], row: Record<string, unknown>) => {
  const status = row[refColor[0]] as string;
  if (status === ACTIVE) return "#1e8e3e";
  if (status === LOCKED) return "#e37400";
  if (status === APPROVING) return "#1a73e8";
  if (status === REJECTED) return "#d93025";
  if (status === APPROVED) return "#1e8e3e";
  return "unset";
};
