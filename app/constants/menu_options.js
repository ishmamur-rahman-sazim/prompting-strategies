import {
  ZERO_SHOT_TEMPLATES,
  FEW_SHOT_TEMPLATES,
  PROMPT_CHAINING_TEMPLATES,
} from "./index.js";

export const MENU_OPTIONS = {
    ZERO_SHOT: "Zero Shot",
    FEW_SHOT: "Few Shot",
    PROMPT_CHAINING: "Prompt Chaining",
    EXIT: "Exit"
};

export const BACK_OPTION = {
    name: "Go back",
    description: "Return to the strategy selection menu.",
};

export const STRATEGY_TEMPLATES = {
  [MENU_OPTIONS.ZERO_SHOT]: ZERO_SHOT_TEMPLATES,
  [MENU_OPTIONS.FEW_SHOT]: FEW_SHOT_TEMPLATES,
  [MENU_OPTIONS.PROMPT_CHAINING]: PROMPT_CHAINING_TEMPLATES,
};