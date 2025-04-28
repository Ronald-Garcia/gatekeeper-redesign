/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
const test_user_num = "5555555555555555";
const test_user_name = "hruiehgured";
const test_machineType = "TestMachine1";
var userId = 807;
let machineTypeId = 15;

const login = () => {
  //Before each test, go to our locally running app and sign in.
  cy.visit(`${WEB_URL}`);
  cy.get('[data-cy= "kiosk-button"]').click();
  cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`);
  cy.get('[data-cy="cardnum-input"]').should("have.value", `;${admin_num};`);
  cy.get('[data-cy="cardnum-input"]').type("\n");
  //Search for the fresh user we just made and ensure they are there and unique.
  cy.get('[data-cy = "searchbar"]').type(`${test_user_name}\n`);
  cy.get(`[data-cy = users-component]`).should("have.length", 1);
  cy.get(`[data-cy = ${test_user_num.substring(0,16)}]`).should("be.visible");
}

describe('training user relation tests', () => {
  beforeEach(() => {
    // get admin credentials
    cy.request(`${API_DB_URL}/users/${admin_num}`);
    // Make a fresh test user with no trainings.
    cy.visit(`${WEB_URL}`);
    cy.get('[data-cy= "kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`);
    cy.get('[data-cy="cardnum-input"]').should("have.value", `;${admin_num};`);
    cy.get('[data-cy="cardnum-input"]').type("\n");
  });

  it('Add a training to a user', () => {
    // Clear any existing trainings for a fresh start.
  
    cy.get('[data-cy="searchbar"]').clear().type(`${test_user_name}{enter}`);    
      // Simple test. Just click actions -> trainings -> first training on the list.
      cy.wait(1000);
      cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
      cy.wait(1000);
      cy.get(`[data-cy = user-training-${test_user_num.substring(0,15)} ]`).click();
      cy.wait(1000);
      cy.get(`[data-cy = toggle-training-${test_machineType} ]`)
        .click({ force: true });
      
      cy.wait(1000);
      
      cy.get(`[data-cy = toggle-training-${test_machineType}]`).should('have.attr', 'data-state', 'on')
        .then(() => {
          // Check training button is on.
          cy.get(`[data-cy = toggle-training-${test_machineType} ]`).should("have.attr", "data-state", "on");
          cy.get(`[data-cy = training-save ]`).click();
          cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
          cy.get(`[data-cy = user-training-${test_user_num.substring(0,15)} ]`).click();
          cy.get(`[data-cy = toggle-training-${test_machineType} ]`).should("have.attr", "data-state", "on");
        });
    
  });

  it('Turn off a training from a user', () => {
    // Pre-populate training on user.
    // Check training button is on.
    cy.get('[data-cy="searchbar"]').clear().type(`${test_user_name}{enter}`);    

    cy.wait(1000);
    cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
    cy.wait(1000);
    cy.get(`[data-cy = user-training-${test_user_num.substring(0,15)} ]`).click();
      cy.get(`[data-cy = toggle-training-${test_machineType} ]`).should("have.attr", "data-state", "on");
      // Turn the training off.
      cy.wait(1000);
      cy.get(`[data-cy=toggle-training-${test_machineType}]`)
        .click({ force: true })
        .should('have.attr', 'data-state', 'off');
      // Save the changes after toggling off.
      cy.get(`[data-cy=training-save]`).click();
      // Open the user again and then assert that it's off for the training on it.
      cy.get(`[data-cy=user-trigger-${test_user_num.substring(0,15)}]`).click({ force: true });
      cy.get(`[data-cy=user-training-${test_user_num.substring(0,15)}]`).click();
      cy.get(`[data-cy=toggle-training-${test_machineType}]`).should("have.attr", "data-state", "off");
  });
});
