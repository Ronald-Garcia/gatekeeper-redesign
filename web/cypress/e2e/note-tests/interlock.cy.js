/// <reference types="cypress" />

const WEB_URL = "http://localhost:5173";

// User with machine access for LATHE 5000
const userWithAccessCard = "1234567890777777";
// User without machine access
const userWithoutAccessCard = "1234567890444444";


describe("Interlock Page E2E", () => {
  beforeEach(() => {

    cy.visit(`${WEB_URL}`);

  });

  context("User with machine access", () => {
    it("allows the user to select a budget code and start the machine", () => {
      
      cy.get('[data-cy="cardnum-input"]').type(`;${userWithAccessCard};`)
      cy.get('[data-cy="cardnum-input"]').type("\n");
      cy.get('[data-cy="toggle-budget"]')
      .should("exist")
      .and("have.length.greaterThan", 0);
      // ensure start is not disabled
      cy.get('[data-cy="start-button"]').should("be.disabled");

      cy.get('[data-cy="toggle-budget"]').first().click();
      // ensure start is not disabled
      cy.get('[data-cy="start-button"]').should("not.be.disabled");
      //click start
      cy.get('[data-cy="start-button"]').click();

      //verify redirection to timer, aka machine turned on 
      cy.url().should("include", "/timer");

      cy.get('[data-cy="timer"]').contains("00:00:00");

      // should change every second
      cy.get('[data-cy="timer"]').contains("00:00:01");

      cy.get('[data-cy="submit"]').click()

      cy.url().should("not.include", "/timer")
      cy.url().should("not.include", "interlock");

    })
  });

  context("User without machine access", () => {
    it("Does not allow user to log in", () => {
      //Log in as the user as user with no access to LATHE 5000
      cy.get('[data-cy="cardnum-input"]')
        .clear()
        .type(`;${userWithoutAccessCard};{enter}`);

      cy.get('[data-cy="cardnum-input"]').should("have.value", "")
    });
  });
});
