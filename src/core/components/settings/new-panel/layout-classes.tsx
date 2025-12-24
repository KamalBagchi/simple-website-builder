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
  BoxIcon,
  LayoutIcon,
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  AlignTopIcon,
  AlignBottomIcon,
  AlignLeftIcon,
  AlignRightIcon,
  SpaceBetweenHorizontallyIcon,
  SpaceBetweenVerticallyIcon,
  RowsIcon,
  ColumnsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const DISPLAY_TYPES = [
  { value: "block", label: "Block", icon: BoxIcon },
  { value: "flex", label: "Flex", icon: LayoutIcon },
] as const;

const FLEX_DIRECTION = [
  { value: "flex-row", label: "Row", icon: RowsIcon },
  { value: "flex-col", label: "Column", icon: ColumnsIcon },
] as const;

const JUSTIFY_CONTENT = [
  { value: "justify-start", label: "Start", icon: AlignLeftIcon },
  { value: "justify-center", label: "Center", icon: AlignCenterHorizontallyIcon },
  { value: "justify-end", label: "End", icon: AlignRightIcon },
  { value: "justify-between", label: "Between", icon: SpaceBetweenHorizontallyIcon },
  { value: "justify-around", label: "Around", icon: SpaceBetweenHorizontallyIcon },
  { value: "justify-evenly", label: "Evenly", icon: SpaceBetweenHorizontallyIcon },
] as const;

const ALIGN_ITEMS = [
  { value: "items-start", label: "Start", icon: AlignTopIcon },
  { value: "items-center", label: "Center", icon: AlignCenterVerticallyIcon },
  { value: "items-end", label: "End", icon: AlignBottomIcon },
  { value: "items-stretch", label: "Stretch", icon: SpaceBetweenVerticallyIcon },
] as const;

const FLEX_WRAP = [
  { value: "flex-nowrap", label: "No Wrap" },
  { value: "flex-wrap", label: "Wrap" },
  { value: "flex-wrap-reverse", label: "Reverse" },
] as const;

const GAP_VALUES = [
  { value: "", label: "None" },
  { value: "gap-1", label: "1" },
  { value: "gap-2", label: "2" },
  { value: "gap-3", label: "3" },
  { value: "gap-4", label: "4" },
  { value: "gap-6", label: "6" },
  { value: "gap-8", label: "8" },
] as const;

export function LayoutClasses() {
  const { t } = useTranslation();
  const [styleBlock] = useSelectedStylingBlocks();
  const block = useSelectedBlock();
  const addClassesToBlocks = useAddClassesToBlocks();
  const removeClassesFromBlocks = useRemoveClassesFromBlocks();
  const [selectedIds] = useSelectedBlockIds();
  const [customGap, setCustomGap] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show for Box and EmptyBox components
  const isBoxComponent = block?._type === "Box" || block?._type === "EmptyBox";

  if (!isBoxComponent) {
    return null;
  }

  const prop = first(styleBlock)?.prop as string;
  const { classes: classesString } = getSplitChaiClasses(get(block, prop, ""));
  const classes = classesString.split(" ").filter((cls) => cls.trim() !== "");

  // Find current display type
  const currentDisplay = DISPLAY_TYPES.find((display) => classes.includes(display.value))?.value || "block";
  const isFlex = currentDisplay === "flex";

  // Find current flex properties
  const currentFlexDirection = FLEX_DIRECTION.find((dir) => classes.includes(dir.value))?.value || "flex-row";
  const currentJustifyContent = JUSTIFY_CONTENT.find((justify) => classes.includes(justify.value))?.value || null;
  const currentAlignItems = ALIGN_ITEMS.find((align) => classes.includes(align.value))?.value || null;
  const currentFlexWrap = FLEX_WRAP.find((wrap) => classes.includes(wrap.value))?.value || "flex-nowrap";
  const currentGap = GAP_VALUES.find((gap) => gap.value && classes.includes(gap.value))?.value || "";
  const customGapClass =
    classes.find((cls) => cls.startsWith("gap-") && !GAP_VALUES.some((gap) => gap.value === cls)) || "";

  const handleDisplayChange = (newDisplay: string) => {
    // Remove existing display classes
    const displayClassesToRemove = DISPLAY_TYPES.map((display) => display.value);
    removeClassesFromBlocks(selectedIds, displayClassesToRemove, true);

    // Add new display class (block is default so we only add flex)
    if (newDisplay === "flex") {
      addClassesToBlocks(selectedIds, [newDisplay], true);
    }
  };

  const handleFlexPropertyChange = (
    newValue: string,
    options: readonly { value: string; label: string; icon?: any }[],
  ) => {
    // Remove existing classes from this category
    const classesToRemove = options.map((option) => option.value).filter((value) => value);

    // Also remove custom gap classes if we're dealing with gap values
    if (options === GAP_VALUES) {
      const existingCustomGaps = classes.filter(
        (cls) => cls.startsWith("gap-") && !GAP_VALUES.some((gap) => gap.value === cls),
      );
      removeClassesFromBlocks(selectedIds, [...classesToRemove, ...existingCustomGaps], true);
    } else {
      removeClassesFromBlocks(selectedIds, classesToRemove, true);
    }

    // Add new class if it's not the default/none value
    if (newValue && newValue !== "") {
      addClassesToBlocks(selectedIds, [newValue], true);
    }
  };

  const handleCustomGapSubmit = () => {
    if (customGap && /^\d+$/.test(customGap)) {
      const gapClass = `gap-${customGap}`;

      // Remove existing gap classes
      const gapClassesToRemove = GAP_VALUES.map((gap) => gap.value).filter((value) => value);
      const existingCustomGaps = classes.filter(
        (cls) => cls.startsWith("gap-") && !GAP_VALUES.some((gap) => gap.value === cls),
      );
      removeClassesFromBlocks(selectedIds, [...gapClassesToRemove, ...existingCustomGaps], true);

      // Add custom gap
      addClassesToBlocks(selectedIds, [gapClass], true);
      setCustomGap("");
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-3 border-b border-border py-4">
      <div
        className="flex cursor-pointer items-center justify-between text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-sm font-medium">{t("Layout")}</span>
        {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
      </div>

      {isExpanded && (
        <>
          {/* Display Type */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">{t("Display")}</div>
            <div className="grid grid-cols-2 gap-1">
              {DISPLAY_TYPES.map((display) => {
                const isSelected = currentDisplay === display.value;
                const IconComponent = display.icon;

                return (
                  <Button
                    key={display.value}
                    variant="outline"
                    size="sm"
                    className={`flex h-7 items-center gap-1 px-2 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                    onClick={() => handleDisplayChange(display.value)}>
                    <IconComponent className="h-3 w-3" />
                    <span className="truncate">{display.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Flex Options - only show when display is flex */}
          {isFlex && (
            <>
              {/* Flex Direction */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t("Direction")}</div>
                <div className="grid grid-cols-2 gap-1">
                  {FLEX_DIRECTION.map((direction) => {
                    const isSelected = currentFlexDirection === direction.value;
                    const IconComponent = direction.icon;

                    return (
                      <Button
                        key={direction.value}
                        variant="outline"
                        size="sm"
                        className={`flex h-7 items-center gap-1 px-2 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                        onClick={() => handleFlexPropertyChange(direction.value, FLEX_DIRECTION)}>
                        <IconComponent className="h-3 w-3" />
                        <span className="truncate">{direction.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Justify Content */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t("Justify")}</div>
                <div className="grid grid-cols-3 gap-1">
                  {JUSTIFY_CONTENT.map((justify) => {
                    const isSelected = currentJustifyContent === justify.value;
                    const IconComponent = justify.icon;

                    return (
                      <Button
                        key={justify.value}
                        variant="outline"
                        size="sm"
                        className={`flex h-7 items-center gap-1 px-1 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                        onClick={() => handleFlexPropertyChange(justify.value, JUSTIFY_CONTENT)}>
                        <IconComponent className="h-3 w-3" />
                        <span className="truncate text-[10px]">{justify.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Align Items */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t("Align")}</div>
                <div className="grid grid-cols-2 gap-1">
                  {ALIGN_ITEMS.map((align) => {
                    const isSelected = currentAlignItems === align.value;
                    const IconComponent = align.icon;

                    return (
                      <Button
                        key={align.value}
                        variant="outline"
                        size="sm"
                        className={`flex h-7 items-center gap-1 px-2 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                        onClick={() => handleFlexPropertyChange(align.value, ALIGN_ITEMS)}>
                        <IconComponent className="h-3 w-3" />
                        <span className="truncate">{align.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Flex Wrap */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t("Wrap")}</div>
                <div className="grid grid-cols-3 gap-1">
                  {FLEX_WRAP.map((wrap) => {
                    const isSelected = currentFlexWrap === wrap.value;

                    return (
                      <Button
                        key={wrap.value}
                        variant="outline"
                        size="sm"
                        className={`h-7 px-1 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                        onClick={() => handleFlexPropertyChange(wrap.value, FLEX_WRAP)}>
                        <span className="truncate text-[10px]">{wrap.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Gap */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t("Gap")}</div>
                <div className="grid grid-cols-4 gap-1">
                  {GAP_VALUES.map((gap) => {
                    const isSelected = currentGap === gap.value && !customGapClass;

                    return (
                      <Button
                        key={gap.value || "none"}
                        variant="outline"
                        size="sm"
                        className={`h-7 text-xs ${isSelected ? "bg-gray-200" : ""}`}
                        onClick={() => handleFlexPropertyChange(gap.value, GAP_VALUES)}>
                        {gap.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Custom Gap Input */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Gap (10, 12, 14...)"
                    value={customGap}
                    onChange={(e) => setCustomGap(e.target.value)}
                    className="h-7 text-xs"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCustomGapSubmit();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-7"
                    onClick={handleCustomGapSubmit}
                    disabled={!customGap || !/^\d+$/.test(customGap)}>
                    {t("Apply")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
