/// <reference types="cypress" />

const WEB_URL = "http://localhost:5173";

// User with machine access for LATHE 5000
const userWithAccessCard = "0123456789111111";
// User without machine access
const userWithoutAccessCard = "0123456789222222";

describe("Interlock Page E2E", () => {
  beforeEach(() => {

    cy.visit(`${WEB_URL}`);
  });

  context("User with machine access", () => {
    it("allows the user to select a budget code and start the machine", () => {

      cy.get('[data-cy="cardnum-input"]')
        .clear()
        .type(`;${userWithAccessCard};{enter}`)
        .then(() => {
          cy.url().should("include", "/interlock");
          
          // Ensure that budget code exist
          cy.get('[data-cy="toggle-budget"]')
          .should("exist")
          .and("have.length.greaterThan", 0);

          //First available budget code.
          cy.get('[data-cy="toggle-budget"]').first().click();
          // ensure start is not disabled
          cy.get('[data-cy="start-button"]').should("not.be.disabled");

          //click start
          cy.get('[data-cy="start-button"]').click();

          //verify redirection to timer, aka machine turned on 
          cy.url().should("include", "/timer");

          cy.get('[data-cy="timer"]').should("have.value", "00:00:00");

          setTimeout(() => {
            cy.get('[data-cy="timer"]').should("have.value", "00:00:01");
          }, 1000);

          cy.get('[data-cy="submit"]').click()

          cy.url().should("not.include", "/timer");
        });

    });
  });

  context("User without machine access", () => {
    it("displays no budget codes and disables the Start button", () => {
      //Log in as the user as user with no access to LATHE 5000
      cy.get('[data-cy="cardnum-input"]')
        .clear()
        .type(`;${userWithoutAccessCard};{enter}`);

      //redirect to the interlock
      cy.url().should("include", "/interlock");
      
      // Verify that no budget code toggles are rendered.
      cy.get('[data-cy="toggle-budget"]').should("not.exist");

      // The Start button should be disabled.
      cy.get('[data-cy="start-button"]').should("be.disabled");
    });
  });
});
