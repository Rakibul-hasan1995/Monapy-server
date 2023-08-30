import { action, Action } from "easy-peasy";

import { useStoreActions, useStoreState } from "./store";


export interface StyleModel {
  mode: string;
  sidebarOpen: boolean;
  changeMode: Action<StyleModel, any>;
  handleSidebar: Action<StyleModel, any>;
}

const styleModel: StyleModel = {
  mode: 'Light',
  sidebarOpen: true,
  changeMode: action((state) => {
    state.mode = state.mode == 'Light' ? 'Dark' : 'Light'
  }),
  handleSidebar: action((state) => {
    state.sidebarOpen = !state.sidebarOpen
  }),
};

export default styleModel

export const useThemeActions = () => {
  const actions = useStoreActions((action: { theme: any; }) => action.theme);
  const changeMode = actions?.changeMode
  const handleSidebar = actions?.handleSidebar
  return { changeMode, handleSidebar }
};

export const useThemeState = () => {
  const state = useStoreState((state: { theme: any; }) => state.theme)
  const mode = state?.mode
  const sidebarOpen = state?.sidebarOpen
  return { mode, sidebarOpen }
};
