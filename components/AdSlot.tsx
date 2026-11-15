import { ADS_ENABLED } from "@/config/site";

interface AdSlotProps {
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
}

export default function AdSlot({ format = "responsive", className = "" }: AdSlotProps) {
  // NV-10: If ADS_ENABLED is false, render NOTHING (no empty space or outline)
  if (!ADS_ENABLED) {
    return null;
  }

  // When enabled by owner after AdSense approval
  return (
    <div
      className={`my-8 mx-auto flex flex-col items-center justify-center bg-travel-muted/50 border border-travel-border rounded-xl p-2 text-center overflow-hidden ${
        format === "horizontal"
          ? "max-w-[728px] min-h-[90px]"
          : format === "rectangle"
          ? "max-w-[300px] min-h-[250px]"
          : "w-full min-h-[100px]"
      } ${className}`}
    >
      <span className="text-[10px] uppercase tracking-wider text-travel-subtext/60 mb-1">
        Advertisement
      </span>
      {/* AdSense ins tag will be inserted here */}
      <div className="w-full h-full flex items-center justify-center text-xs text-travel-subtext/40">
        Ad Space
      </div>
    </div>
  );
}
