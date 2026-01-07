import { useMemo } from "react";

const DefaultTopPanel = () => {
  return null;
};

const TOP_PANEL: { component: React.ComponentType } = {
  component: DefaultTopPanel,
};

export const registerChaiTopPanel = (component: React.ComponentType) => {
  TOP_PANEL.component = component;
};

export const useTopPanelComponent = () => {
  return useMemo(() => TOP_PANEL.component, []);
};
