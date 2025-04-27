/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
const test_user_num = "5555555555555555";
const test_user_name = "hruiehgured";
const test_machineType = "TestMachine1";
var userId = "";
let machineTypeId;

const makeFreshUserThenLogin = () => {
  cy.request({
    url: `${API_DB_URL}/users`,
    method: "POST",
    body: {
      name: test_user_name,
      cardNum: `${test_user_num}`,
      JHED: "billfre1",
      isAdmin: 0,
      graduationYear: 2060
    }
  }).then(() => {
    login();
  });
}

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

  // Create a new machine type for the trainings.
  cy.request({
    url: `${API_DB_URL}/machine-types`,
    method: "POST",
    failOnStatusCode: false,
    body: {
      name: test_machineType,
    }
  }).then((res) => {
    if (res.status === 409) {
      // If machine type already exists, get its id.
      cy.request({
        url: `${API_DB_URL}/machine-types?search=${test_machineType}`,
        method: "GET",
        failOnStatusCode: false,
      }).then((getRes) => {
        if (getRes.body.data && getRes.body.data.length > 0) {
          machineTypeId = getRes.body.data[0].id;
        }
      });
    } else {
      machineTypeId = res.body.data.id;
    }
  });
}

describe('training user relation tests', () => {
  beforeEach(() => {
    // get admin credentials
    cy.request(`${API_DB_URL}/users/${admin_num}`);
    // Make a fresh test user with no trainings.
    cy.request({
      url: `${API_DB_URL}/users/${test_user_num}`,
      failOnStatusCode: false,
    }).then((req) => {
      // If we found a user, DELETE THEM.
      // This is to resign in as an admin
      cy.request(`${API_DB_URL}/users/${admin_num}`).then(() => {
        if (req.status === 200) {
          // Get the specific user id to delete them.
          const foundUser = req.body.data;
          userId = foundUser.id;
          cy.request({
            method: 'DELETE',
            url: `${API_DB_URL}/users/${userId}`,
          }).then(() => {
            // After deletion, create fresh guy.
            makeFreshUserThenLogin();
          });
        } else {
          // No deletion, create a fresh guy and login.
          makeFreshUserThenLogin();
        }
      });
    });
  });

  it('Add a training to a user', () => {
    // Clear any existing trainings for a fresh start.
  
      // Simple test. Just click actions -> trainings -> first training on the list.
      cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
      cy.get(`[data-cy = user-training-${test_user_num.substring(0,15)} ]`).click();
      cy.get(`[data-cy = toggle-training-${test_machineType} ]`)
        .click({ force: true })
        .should('have.attr', 'data-state', 'on')
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
    cy.request({
      url: `${API_DB_URL}/trainings/${userId}`,
      method: "PATCH",
      body: { machine_types: [machineTypeId] }
    }).then(() => {
      // Check training button is on.
      cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
      cy.get(`[data-cy = user-training-${test_user_num.substring(0,15)} ]`).click();
      cy.get(`[data-cy = toggle-training-${test_machineType} ]`).should("have.attr", "data-state", "on");
      // Turn the training off.
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
});
