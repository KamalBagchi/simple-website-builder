import { useBuilderProp, useRightPanel, useSavePage } from "@/core/hooks";
import { Button } from "@/ui/shadcn/components/ui/button";
import { EyeOpenIcon, MixerHorizontalIcon, CheckIcon } from "@radix-ui/react-icons";

export default function RightTop() {
  const [panel, setRightPanel] = useRightPanel();
  const { savePage, saveState } = useSavePage();
  const onPreview = useBuilderProp("onPreview", () => {});
  return (
    <div className="bg-paper flex items-center gap-2 rounded-lg p-2">
      <Button
        variant={panel === "theme" ? "secondary" : "ghost"}
        size="sm"
        className="gap-2"
        onClick={() => setRightPanel(panel !== "theme" ? "theme" : "block")}>
        <MixerHorizontalIcon className="h-4 w-4" />
        Theme
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={() => onPreview()}>
        <EyeOpenIcon className="h-4 w-4" />
        Preview
      </Button>
      <Button variant="default" size="sm" className="gap-2" onClick={() => savePage(false)}>
        <CheckIcon className="h-4 w-4" />
        {saveState === "UNSAVED" ? "Draft" : "Saved"}
      </Button>
    </div>
  );
}
