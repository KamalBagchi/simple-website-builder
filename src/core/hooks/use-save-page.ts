import { useBuilderProp } from "@/core/hooks/use-builder-prop";
import { useGetPageData } from "@/core/hooks/use-get-page-data";
import { usePermissions } from "@/core/hooks/use-permissions";
import { useTheme } from "@/core/hooks/use-theme";
import { useThrottledCallback } from "@react-hookz/web";
import { getRegisteredChaiBlock } from "@chaibuilder/runtime";
import { atom, useAtom } from "jotai";
import { has, isEmpty, noop } from "lodash-es";
import { useLanguages } from "@/core/hooks/use-languages";
import { useIsPageLoaded } from "@/core/hooks/use-is-page-loaded";
import { getHTMLFromBlocks } from "../export-html/json-to-html";
import { domToPng } from "modern-screenshot";
export const builderSaveStateAtom = atom<"SAVED" | "SAVING" | "UNSAVED">("SAVED"); // SAVING
builderSaveStateAtom.debugLabel = "builderSaveStateAtom";

// Convert loaded images to base64 to bypass CORS
const convertImagesToBase64 = async (body: HTMLElement): Promise<Map<HTMLImageElement, string>> => {
  const originalSrcs = new Map<HTMLImageElement, string>();
  const images = body.querySelectorAll("img");

  for (const img of Array.from(images)) {
    if (!img.src || img.src.startsWith("data:")) continue;
    if (!img.complete || img.naturalWidth === 0) continue;

    try {
      // Create a canvas and draw the already-loaded image
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/png");
        originalSrcs.set(img, img.src);
        img.src = base64;
      }
    } catch {
      // If CORS blocks canvas export, skip this image
      console.warn("Could not convert image to base64:", img.src);
    }
  }

  return originalSrcs;
};

const restoreImageSrcs = (originalSrcs: Map<HTMLImageElement, string>): void => {
  originalSrcs.forEach((src, img) => {
    img.src = src;
  });
};

const captureCanvasScreenshot = async (): Promise<string | undefined> => {
  // Get the iframe and capture its body content
  const iframe = document.getElementById("canvas-iframe") as HTMLIFrameElement | null;
  if (!iframe?.contentDocument?.body) return undefined;

  try {
    const body = iframe.contentDocument.body;

    // Convert images to base64 first to bypass CORS
    const originalSrcs = await convertImagesToBase64(body);

    // Wait for src changes to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the iframe's body content using modern-screenshot
    const dataUrl = await domToPng(body, {
      backgroundColor: "#ffffff",
    });

    // Restore original image sources
    restoreImageSrcs(originalSrcs);

    return dataUrl;
  } catch (error) {
    console.warn("Failed to capture canvas screenshot:", error);
    return undefined;
  }
};

export const checkMissingTranslations = (blocks: any[], lang: string): boolean => {
  if (!lang) return false;

  return blocks.some((block) => {
    if (!block?._type || block._type === "PartialBlock") {
      return false;
    }

    try {
      const blockDef = getRegisteredChaiBlock(block._type);
      if (!blockDef) return false;

      const i18nProps = has(blockDef, "i18nProps") ? blockDef.i18nProps : [];

      return i18nProps.some((prop: string) => {
        const translatedProp = `${prop}-${lang}`;
        return !block[translatedProp] || isEmpty(block[translatedProp]);
      });
    } catch (error) {
      console.warn(`Failed to get block definition for type: ${block._type}`, error);
      return false;
    }
  });
};

export const useSavePage = () => {
  const [saveState, setSaveState] = useAtom(builderSaveStateAtom);
  const onSave = useBuilderProp("onSave", async (_args) => {});
  const onSaveStateChange = useBuilderProp("onSaveStateChange", noop);
  const onImageUpload = useBuilderProp("onImageUpload", async (_args) => {});
  const getPageData = useGetPageData();
  const [theme] = useTheme();
  const { hasPermission } = usePermissions();
  const { selectedLang, fallbackLang } = useLanguages();
  const [isPageLoaded] = useIsPageLoaded();

  const needTranslations = () => {
    const pageData = getPageData();
    return !selectedLang || selectedLang === fallbackLang
      ? false
      : checkMissingTranslations(pageData.blocks || [], selectedLang);
  };

  const savePage = useThrottledCallback(
    async (autoSave: boolean = false) => {
      // if (!hasPermission("save_page") || !isPageLoaded) {
      // console.log("4 No permission to save");
      // console.log("has permission", hasPermission("save_page"))
      // console.log("is page loaded", isPageLoaded)
      // return;
      // }
      setSaveState("SAVING");
      onSaveStateChange("SAVING");
      const pageData = getPageData();

      const domElements = await getHTMLFromBlocks(pageData.blocks, theme);
      const screenshot = await captureCanvasScreenshot();

      await onSave({
        autoSave,
        blocks: pageData.blocks,
        theme,
        needTranslations: needTranslations(),
        domElements,
        screenshot,
      });
      setTimeout(() => {
        setSaveState("SAVED");
        onSaveStateChange("SAVED");
      }, 100);
      return true;
    },
    [getPageData, setSaveState, theme, onSave, onSaveStateChange, isPageLoaded],
    3000, // save only every 5 seconds
  );

  const savePageAsync = async () => {
    if (!hasPermission("save_page") || !isPageLoaded) {
      return;
    }
    setSaveState("SAVING");
    onSaveStateChange("SAVING");
    const pageData = getPageData();
    const screenshot = await captureCanvasScreenshot();

    await onSave({
      autoSave: true,
      blocks: pageData.blocks,
      theme,
      needTranslations: needTranslations(),
      screenshot,
    });
    setTimeout(() => {
      setSaveState("SAVED");
      onSaveStateChange("SAVED");
    }, 100);
    return true;
  };

  const uploadImage = async (file: File) => {
    const url = await onImageUpload(file);
    return url;
  };

  return { savePage, savePageAsync, saveState, setSaveState, needTranslations, uploadImage };
};
