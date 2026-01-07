import ChaiBuilderCanvas from "@/core/components/canvas/canvas-area";
import BlockPropsEditor from "@/core/components/settings/block-settings";
import BlockStyleEditor from "@/core/components/settings/block-styling";
import AddBlocksPanel from "@/core/components/sidepanels/panels/add-blocks/add-blocks";
import ImportHTML from "@/core/components/sidepanels/panels/add-blocks/import-html";
import UILibrariesPanel from "@/core/components/sidepanels/panels/add-blocks/libraries-panel";
import Outline from "@/core/components/sidepanels/panels/outline/list-tree";
import ThemeConfigPanel from "@/core/components/sidepanels/panels/theme-configuration/ThemeConfigPanel";
import i18n from "@/core/locales/load";
import { registerFeatureFlags } from "@/core/utils/feature-flag";
import type { ChaiBlock } from "@/types/chai-block";
import type { ChaiBuilderEditorProps } from "@/types/index";

if (typeof window === "undefined") {
  throw new Error("@chaibuilder/sdk is only supported in the browser. Avoid using it in the server side.");
}

// Register feature flags
registerFeatureFlags();

// components
export { AIUserPrompt as ChaiAskAiUserPrompt } from "@/core/components/ask-ai-panel";
export { Breakpoints as ChaiScreenSizes } from "@/core/components/canvas/topbar/canvas-breakpoints";
export { DarkMode as ChaiDarkModeSwitcher } from "@/core/components/canvas/topbar/dark-mode";
export { UndoRedo as ChaiUndoRedo } from "@/core/components/canvas/topbar/undo-redo";
export { ChaiBuilderEditor } from "@/core/components/chaibuilder-editor";
export { AddBlocksDialog as ChaiAddBlocksDialog } from "@/core/components/layout/add-blocks-dialog";
export { BlockAttributesEditor as ChaiBlockAttributesEditor } from "@/core/components/settings/new-panel/block-attributes-editor";
export { DefaultChaiBlocks as ChaiDefaultBlocks } from "@/core/components/sidepanels/panels/add-blocks/default-blocks";
export {
  AddBlocksPanel as ChaiAddBlocksPanel,
  BlockPropsEditor as ChaiBlockPropsEditor,
  BlockStyleEditor as ChaiBlockStyleEditor,
  ChaiBuilderCanvas,
  ImportHTML as ChaiImportHTML,
  Outline as ChaiOutline,
  ThemeConfigPanel as ChaiThemeConfigPanel,
  UILibrariesPanel as ChaiUILibrariesPanel,
};

// i18n
export { i18n };

// helper functions
export { generateUUID as generateBlockId, cn as mergeClasses } from "@/core/functions/common-functions";
export { getBlocksFromHTML as convertHTMLToChaiBlocks, getBlocksFromHTML } from "@/core/import-html/html-to-json";

// types
export type { ChaiBlock, ChaiBuilderEditorProps };

// registration apis
export { registerChaiAddBlockTab } from "@/core/extensions/add-block-tabs";
export {
  registerBlockSettingField,
  registerBlockSettingTemplate,
  registerBlockSettingWidget,
} from "@/core/extensions/blocks-settings";
export { registerChaiPreImportHTMLHook } from "@/core/extensions/import-html-pre-hook";
export { registerChaiLibrary } from "@/core/extensions/libraries";
export { registerChaiMediaManager } from "@/core/extensions/media-manager";
export { registerChaiSaveToLibrary } from "@/core/extensions/save-to-library";
export { registerChaiSidebarPanel } from "@/core/extensions/sidebar-panels";
export { registerChaiTopBar } from "@/core/extensions/top-bar";
export { registerChaiTopPanel, useTopPanelComponent } from "@/core/extensions/top-panel";
export {
  IfChaiFeatureFlag,
  registerChaiFeatureFlag,
  registerChaiFeatureFlags,
  useChaiFeatureFlag,
  useChaiFeatureFlags,
  useToggleChaiFeatureFlag,
} from "@/core/flags/register-chai-flag";
export type { ChaiLibrary, ChaiLibraryBlock } from "@/types/chaibuilder-editor-props";

// hooks
export { useMediaManagerComponent } from "@/core/extensions/media-manager";
export type { ChaiSidebarPanel } from "@/core/extensions/sidebar-panels";
export * from "@/core/hooks";

// constants
export { PERMISSIONS } from "@/core/constants/PERMISSIONS";
export type { ChaiThemeValues } from "@/types/chaibuilder-editor-props";
