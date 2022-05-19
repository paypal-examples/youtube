/**
 * Our root app file is split into two different
 * key components
 */

import "./buttons.js";
import { setupCardFields } from "./cards.js";

// setup card fields or hide the form if we can't
setupCardFields().catch(() => {
  document.getElementById("card-form").style = "display: none";
});