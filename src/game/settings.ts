import { createContext, useContext } from "react";

export type GameSettings = {
  mobileControls: boolean; // força D-pad na tela mesmo em desktop
  zoom: number;            // 1..2.5
  clickToInteract: boolean;
  showTimer: boolean;
};

export const DEFAULT_SETTINGS: GameSettings = {
  mobileControls: false,
  zoom: 1,
  clickToInteract: true,
  showTimer: true,
};

export type SettingsCtx = {
  settings: GameSettings;
  update: (patch: Partial<GameSettings>) => void;
};

export const SettingsContext = createContext<SettingsCtx>({
  settings: DEFAULT_SETTINGS,
  update: () => {},
});

export const useSettings = () => useContext(SettingsContext);
