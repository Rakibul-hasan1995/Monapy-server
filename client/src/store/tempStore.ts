import { action, Action } from "easy-peasy";

import { useStoreActions, useStoreState } from "./store";


export interface TempModel {
  value: Record<string, string>;
  save: Action<TempModel, Record<string, string>>;
  delete: Action<TempModel, string>;
}

const tempModel: TempModel = {
  value: {},
  save: action((state, payload) => {
    state.value = payload
  }),
  delete: action((state, key) => {
    delete state.value[key]
  }),
};

export default tempModel

export const useTempActions = () => {
  const actions = useStoreActions((action) => action.temp);
  const save = actions?.save
  const deleteTemp = actions.delete
  return { save, deleteTemp }
};

export const useTempState = () => {
  const value = useStoreState((state) => state.temp.value)
  return { value }
};
