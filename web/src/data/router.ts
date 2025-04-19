import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  machine_login: `${BASE_URL}machine`, // Login with machine
  start_page: `${BASE_URL}`,
  interlock: `${BASE_URL}interlock`,
  users: `${BASE_URL}users`,
  budgetCodes: `${BASE_URL}budgets`,
  machines: `${BASE_URL}machines`,
  kiosk: `${BASE_URL}kiosk`,
  interlockLogin: `${BASE_URL}interlock-login`,
  financial_statements: `${BASE_URL}statements`,
  timer: `${BASE_URL}timer`,
  machineIssues: `${BASE_URL}issues`,
  reportForm: `${BASE_URL}form/:userId/:machineId`,
  errorPage: `${BASE_URL}/404`,

});


