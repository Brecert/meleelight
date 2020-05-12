// setCharAttributes
import { 
  CHARIDS,
  charAttributes
} from "main/characters";

export const globalAttributes = {
	canAirdodge: true
};

export function setGlobalAttributes(val){
  for (const id in CHARIDS) {
    for (const attr in val) {
      charAttributes[CHARIDS[id]][attr] = val[attr];
    };
  };
};

setGlobalAttributes(globalAttributes);