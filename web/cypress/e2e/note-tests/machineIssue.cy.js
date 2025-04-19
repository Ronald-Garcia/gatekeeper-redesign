/// <reference types="cypress" />

describe("Machine Issue Reporting (Full Lifecycle)", () => {
  const WEB_URL = "http://localhost:5173";
  const cardNum = "1234567890777777";
  const issueDescription = "Power not working on startup";

  it("submits issue via QR and verifies it in the kiosk dashboard", () => {
    // Step 1: Go to Interlock
    cy.visit(WEB_URL);
    cy.get('[data-cy="interlock-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${cardNum};\n`);

    // Step 2: Open the Report Issue modal
    cy.get('[data-cy="report-issue-button"]').click({ force: true });
    cy.contains("Scan the QR code").should("exist");

    // Step 3: Extract form URL, open form page, submit
    cy.get("p")
      .contains("http")
      .invoke("text")
      .then((formUrl) => {
        cy.visit(formUrl);

        cy.get('input[placeholder="Describe the issue..."]').type(issueDescription);
        cy.contains("Submit Report").click();
        cy.contains("Submitted ✅").should("exist");

        // Step 4: Go to kiosk
        cy.visit(WEB_URL);
        cy.get('[data-cy="kiosk-button"]').click();
        cy.get('[data-cy="cardnum-input"]').type(`;${cardNum};\n`);

        // Step 5: Navigate to Machine Issues tab
        cy.get('[data-cy="admin-dashboard"]').should("exist");
        cy.contains("Machine Issues").click();

        // Step 6: Find issue and check it
        cy.contains(issueDescription, { timeout: 10000 }).should("exist");
        cy.contains(issueDescription)
          .parents("[data-cy^=machine-issue-]")
          .as("issueCard");

        cy.get("@issueCard").within(() => {
          cy.get('[data-cy^="machine-issue-description-"]').should("contain", issueDescription);
          cy.contains("Reported by").should("exist");

          // Step 7: Click 'Mark Resolved'
          cy.get('[data-cy^="machine-issue-resolve-"]').click();

          // Step 8: Wait and check for resolved icon
          cy.contains("Resolving...").should("exist");
          cy.contains("Mark Resolved").should("not.exist");

          // Step 9: Confirm green resolved dot
          cy.get("svg.text-green-500").should("exist");
        });
      });
  });
});
