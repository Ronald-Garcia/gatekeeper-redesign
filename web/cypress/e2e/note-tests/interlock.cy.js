/// <reference types="cypress" />

const WEB_URL = "http://localhost:5173";

// Admin with machine access for LATHE 5000
const userWithAccessCard = "1234567890777777";
// Admin without machine access
const userWithoutAccessCard = "1234567890444444";

// Users should not have access

// Admins without training cannot turn on active machine

// Admins with training cannot turn on inactive machine

// Admins with training can turn on active machines

// Admins without training cannot turn on inactive machine

describe("Interlock Page E2E", () => {
  beforeEach(() => {

    cy.visit(`${WEB_URL}`);

  });

  context("User with machine access", () => {
    it("allows the user to select a budget code and start the machine", () => {

      // homepage should be check for interlock button
      cy.get('[data-cy="interlock-button"]')
      .should("exist")

      // click interlock button
      cy.get('[data-cy="interlock-button"]').click();

      // type in username
      cy.get('[data-cy="cardnum-input"]').type(`;${userWithAccessCard};`)
      cy.get('[data-cy="cardnum-input"]').type("\n");

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

      cy.url().should("include", "/interlock-login")

    })
  });

  context("User without machine access", () => {
    it("Does not allow user to log in", () => {

      // homepage should be check for interlock button
      cy.get('[data-cy="interlock-button"]')
      .should("exist")

      // click interlock button
      cy.get('[data-cy="interlock-button"]').click();

      // type in username (without access)
      cy.get('[data-cy="cardnum-input"]').type(`;${userWithoutAccessCard};`)
      cy.get('[data-cy="cardnum-input"]').type("\n");

      //Log in as the user as user with no access to LATHE 5000
      // cy.get('[data-cy="cardnum-input"]')
      //   .clear()
      //   .type(`;${userWithoutAccessCard};{enter}`);

      cy.get('[data-cy="cardnum-input"]').should("have.value", "")
    });
  });

  context("User with machine access turns on active machine", () => {
    it("allows the user to log into an active machine and begin use", () => {

      // user should be in the correct route
      // cy.url().should("include", "/interlock")

      // homepage should be check for interlock button
      cy.get('[data-cy="interlock-button"]')
      .should("exist")

      // click interlock button
      cy.get('[data-cy="interlock-button"]').click();

      // type in username
      cy.get('[data-cy="cardnum-input"]').type(`;${userWithAccessCard};`)
      cy.get('[data-cy="cardnum-input"]').type("\n");

      cy.get('[data-cy="toggle-budget"]')
      .should("exist")
      .and("have.length.greaterThan", 0);

      // ensure start is disabled
      cy.get('[data-cy="start-button"]').should("be.disabled");

      cy.get('[data-cy="toggle-budget"]').first().click();

      // ensure start is not disabled
      cy.get('[data-cy="start-button"]').should("not.be.disabled");

      //click start
      cy.get('[data-cy="start-button"]').click();

      //verify redirection to timer, aka machine turned on 
      cy.url().should("include", "/timer");
    })
  });

  context("User without machine access", () => {
    it("Does not allow user to log in", () => {
      // homepage should be check for interlock button
      cy.get('[data-cy="interlock-button"]')
      .should("exist")

      // click interlock button
      cy.get('[data-cy="interlock-button"]').click();

      //Log in as the user as user with no access to LATHE 5000
      cy.get('[data-cy="cardnum-input"]')
        .clear()
        .type(`;${userWithoutAccessCard};{enter}`);

      cy.get('[data-cy="cardnum-input"]').should("have.value", "")
    });
  });

  context("User with machine access does not turn on inactive machine", () => {
    it("prevents user from logging into an inactive machine", () => {
      
      // homepage should be check for interlock button
      cy.get('[data-cy="interlock-button"]')
      .should("exist")

      // click interlock button
      cy.get('[data-cy="interlock-button"]').click();

      // user tries to log into an inactive machine
      cy.get('[data-cy="cardnum-input"]').type(`;${userWithAccessCard};`)
      cy.get('[data-cy="cardnum-input"]').type("\n");

      // user should be blocked from logging in; user stays on the log in page and an error message should pop up
      cy.url().should("include", "/interlock-login")

    })
  });
});

