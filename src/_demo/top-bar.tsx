import RightTop from "@/_demo/right-top";
import { useTopPanelComponent } from "@/core/extensions/top-panel";

export default function Topbar() {
  const TopPanel = useTopPanelComponent();

  return (
    <div className="flex w-full items-center justify-between border-b border-border bg-paper px-2">
      {/* Left section */}
      <div className="flex flex-1 items-center" />

      {/* Center section - Registered Top Panel */}
      <div className="flex items-center justify-center">
        <TopPanel />
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <RightTop />
      </div>
    </div>
  );
}
