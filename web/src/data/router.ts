import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  machine_login: `${BASE_URL}/machine`, // Login with machine
  start_page: `${BASE_URL}`,
  dashboard: `${BASE_URL}/dashboard`,
});
