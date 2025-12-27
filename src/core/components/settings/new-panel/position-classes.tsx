import {
  useAddClassesToBlocks,
  useRemoveClassesFromBlocks,
  useSelectedBlock,
  useSelectedBlockIds,
  useSelectedStylingBlocks,
} from "@/core/hooks";
import { getSplitChaiClasses } from "@/core/hooks/get-split-classes";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Input } from "@/ui/shadcn/components/ui/input";
import { first, get } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BorderNoneIcon,
  MoveIcon,
  PinTopIcon,
  LockClosedIcon,
  ShadowIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const POSITION_CLASSES = [
  { value: "static", label: "Static", icon: BorderNoneIcon, description: "Default position" },
  { value: "relative", label: "Relative", icon: MoveIcon, description: "Relative to normal position" },
  { value: "absolute", label: "Absolute", icon: PinTopIcon, description: "Relative to nearest positioned ancestor" },
  { value: "fixed", label: "Fixed", icon: LockClosedIcon, description: "Relative to viewport" },
  { value: "sticky", label: "Sticky", icon: ShadowIcon, description: "Toggles between relative and fixed" },
] as const;

const COMMON_Z_INDEX_VALUES = [
  { value: "z-0", label: "0" },
  { value: "z-10", label: "10" },
  { value: "z-20", label: "20" },
  { value: "z-30", label: "30" },
  { value: "z-40", label: "40" },
  { value: "z-50", label: "50" },
  { value: "z-auto", label: "Auto" },
] as const;

export function PositionClasses() {
  const { t } = useTranslation();
  const [styleBlock] = useSelectedStylingBlocks();
  const block = useSelectedBlock();
  const addClassesToBlocks = useAddClassesToBlocks();
  const removeClassesFromBlocks = useRemoveClassesFromBlocks();
  const [selectedIds] = useSelectedBlockIds();
  const [customZIndex, setCustomZIndex] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show for Box and EmptyBox components
  const isBoxComponent = block?._type === "Box" || block?._type === "EmptyBox";

  if (!isBoxComponent) {
    return null;
  }

  const prop = first(styleBlock)?.prop as string;
  const { classes: classesString } = getSplitChaiClasses(get(block, prop, ""));
  const classes = classesString.split(" ").filter((cls) => cls.trim() !== "");

  // Find current position class
  const currentPosition = POSITION_CLASSES.find((pos) => classes.includes(pos.value))?.value || null;

  // Find current z-index class
  const currentZIndex = classes.find((cls) => cls.startsWith("z-")) || null;

  const handlePositionChange = (newPosition: string) => {
    // Remove any existing position classes
    const positionClassesToRemove = POSITION_CLASSES.map((pos) => pos.value);
    removeClassesFromBlocks(selectedIds, positionClassesToRemove, true);

    // Add the new position class (unless it's static, which is the default)
    if (newPosition !== "static") {
      addClassesToBlocks(selectedIds, [newPosition], true);
    }
  };

  const handleZIndexChange = (newZIndex: string) => {
    // Remove any existing z-index classes
    const zIndexClassesToRemove = classes.filter((cls) => cls.startsWith("z-"));
    if (zIndexClassesToRemove.length > 0) {
      removeClassesFromBlocks(selectedIds, zIndexClassesToRemove, true);
    }

    // Add the new z-index class
    if (newZIndex && newZIndex !== "z-auto") {
      addClassesToBlocks(selectedIds, [newZIndex], true);
    }
  };

  const handleCustomZIndexSubmit = () => {
    if (customZIndex && /^\d+$/.test(customZIndex)) {
      const zIndexClass = `z-[${customZIndex}]`;

      // Remove existing z-index classes
      const zIndexClassesToRemove = classes.filter((cls) => cls.startsWith("z-"));
      if (zIndexClassesToRemove.length > 0) {
        removeClassesFromBlocks(selectedIds, zIndexClassesToRemove, true);
      }

      // Add custom z-index
      addClassesToBlocks(selectedIds, [zIndexClass], true);
      setCustomZIndex("");
    }
  };

  const needsZIndex = currentPosition && ["absolute", "fixed", "relative", "sticky"].includes(currentPosition);

  return (
    <div className="flex w-full flex-col gap-y-3 border-b border-border py-4">
      <div
        className="flex cursor-pointer items-center justify-between text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-sm font-medium">{t("Position")}</span>
        {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-2 gap-1">
            {POSITION_CLASSES.map((position, index) => {
              const isSelected =
                currentPosition === position.value || (currentPosition === null && position.value === "static");

              const IconComponent = position.icon;

              return (
                <Button
                  key={position.value}
                  variant="outline"
                  size="sm"
                  className={`flex h-7 items-center gap-1 px-2 text-xs ${index === 4 ? "col-span-2 justify-center" : ""} ${isSelected ? "bg-gray-200" : ""}`}
                  onClick={() => handlePositionChange(position.value)}>
                  <IconComponent className="h-3 w-3" />
                  <span className="truncate">{position.label}</span>
                </Button>
              );
            })}
          </div>

          {needsZIndex && (
            <div className="mt-2">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {t("Z-Index")} {currentZIndex && <span className="text-foreground">({currentZIndex})</span>}
              </div>

              <div className="mb-2 grid grid-cols-4 gap-1">
                {COMMON_Z_INDEX_VALUES.map((zIndex) => {
                  const isSelected = currentZIndex === zIndex.value;

                  return (
                    <Button
                      key={zIndex.value}
                      variant="outline"
                      size="sm"
                      className={`h-7 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                      onClick={() => handleZIndexChange(zIndex.value)}>
                      {zIndex.label}
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Custom z-index"
                  value={customZIndex}
                  onChange={(e) => setCustomZIndex(e.target.value)}
                  className="h-7 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomZIndexSubmit();
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-7"
                  onClick={handleCustomZIndexSubmit}
                  disabled={!customZIndex || !/^\d+$/.test(customZIndex)}>
                  {t("Apply")}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
