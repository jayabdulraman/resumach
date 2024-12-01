import { Template } from "@/utils/namespaces/template";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Kakuna } from "./kakuna";
import { Rhyhorn } from "./rhyhorn";

export const getTemplate = (template: Template) => {
  switch (template) {
    case "azurill": {
      return Azurill;
    }
    case "bronzor": {
      return Bronzor;
    }
    case "kakuna": {
      return Kakuna;
    }
    case "rhyhorn": {
      return Rhyhorn;
    }
  }
};
