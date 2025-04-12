/// <reference types="cypress" />

const WEB_URL = "http://localhost:5173";
const adminCard = "1234567890777777"; // Has access
const userCard = "1234567890777777"; // Used to submit issue
const machineName = "LATHE 5000";     // Make sure this exists in your DB

describe("Machine Issue End-to-End", () => {
  it("User reports an issue and admin resolves it", () => {
    // === STEP 1: User logs in through interlock and reports issue === //
    cy.visit(`${WEB_URL}`);
    cy.get('[data-cy="interlock-button"]').click();

    // Log in user with access
    cy.get('[data-cy="cardnum-input"]').type(`;${userCard};\n`);
    cy.get('[data-cy="toggle-budget"]').first().click();

    // Click report issue
    cy.get('[data-cy="report-issue-button"]').click();

    // Wait for QR form modal to appear
    cy.get('[data-cy="report-form-modal"]').should("be.visible");

    // Instead of scanning QR, visit the URL manually (simulate scanning)
    cy.url().then(() => {
      cy.visit(`${WEB_URL}/form/2034/1759`); // Use actual user/machine IDs if dynamic
    });

    // Fill out issue description and submit
    cy.get('[data-cy="maintenance-textarea"]').type("The machine is making weird noises.");
    cy.get('[data-cy="submit-maintenance-report"]').click();

    // Assert we're redirected and form is cleared
    cy.contains("Thank you for reporting!").should("exist");

    // === STEP 2: Admin logs in via kiosk to view and resolve === //
    cy.visit(`${WEB_URL}/kiosk`);
    cy.get('[data-cy="cardnum-input"]').type(`;${adminCard};\n`);
    cy.get('[data-cy="admin-dashboard"]').should("exist");

    // Should see the reported machine issue
    cy.contains(machineName).should("exist");
    cy.contains("The machine is making weird noises.").should("exist");
    cy.contains("Resolve").click();

    // Assert it's now resolved (e.g., disappears or shows 'Yes')
    cy.contains("Resolved").next().should("contain", "Yes");
  });
});
