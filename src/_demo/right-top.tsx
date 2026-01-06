import { useBuilderProp, useRightPanel, useSavePage } from "@/core/hooks";
import { Button } from "@/ui/shadcn/components/ui/button";
import { EyeOpenIcon, MixerHorizontalIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";

export default function RightTop() {
  const [panel, setRightPanel] = useRightPanel();
  const { savePage, saveState } = useSavePage();
  const onPreview = useBuilderProp("onPreview", () => {});
  const isSaving = saveState === "SAVING";

  return (
    <div className="flex items-center gap-2 rounded-lg bg-paper p-2">
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
      <Button variant="default" size="sm" className="gap-2" onClick={() => savePage(false)} disabled={isSaving}>
        {isSaving ? <ReloadIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
        {isSaving ? "Saving..." : saveState === "UNSAVED" ? "Draft" : "Saved"}
      </Button>
    </div>
  );
}
