import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  machine_login: `${BASE_URL}/machine`, // Login with machine
  start_page: `${BASE_URL}`,
  users: `${BASE_URL}/users`,
  budgetCodes: `${BASE_URL}/users`,
});
