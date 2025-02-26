import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  machine_login: `${BASE_URL}`, // Login with machine
  deck: `${BASE_URL}users/:deckId`, // Deck page with a list of cards
  login: `${BASE_URL}login`,
  register: `${BASE_URL}register`,
});
