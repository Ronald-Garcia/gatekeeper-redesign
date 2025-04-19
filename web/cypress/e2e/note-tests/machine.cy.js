/// <reference types="cypress" />

const API_DB_URL = "http://localhost:3000";
let admin_card_num = "1234567890777777";


describe('Machine tests', () => {
  // Generate unique test values for each run
  let testMachineRate = 10;
  let testMachineName = "TEST_Machine_" + Math.floor(Math.random() * 1000).toString();

  beforeEach(() => {
    // Before each test, visit the kiosk page.
    cy.visit('http://localhost:5173/kiosk');
    cy.get('[data-cy="kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`);
    cy.get('[data-cy="cardnum-input"]').type("\n");
  });

  it('Add a Machine and have it show up on the dashboard', () => {
    // Ensure that a budget code with the test code doesn't exist by deleting it via the API.
    // (This step follows the same idea as the user tests.)
    cy.request({
      url: `${API_DB_URL}/machines?search=${testMachineName}`,
      failOnStatusCode: false,
    }).then((req) => {
      // If we found a budget code, DELETE THEM. Otherwise, they are fine.
      if (req.status === 200) {
        // Get the specific budget code id, then delete it.
        const foundMachine = req.body.data;
        const machineId = foundMachine.id;
        cy.request({
          method: 'DELETE',
          url: `${API_DB_URL}/machines/${machineId}`,
        });
      }
    });

    cy.intercept('POST', `${API_DB_URL}/machines`).as('createMachine');

    // Navigate to machines page.
    cy.get('[data-cy="view-machines"]').should("be.visible");
    cy.get('[data-cy="view-machines"]').click();

    // Click the "Add Machine" button; assumes the add dialog is triggered by an element
    cy.get('[data-cy="add-machine-button"]').should("be.visible");
    cy.get('[data-cy="add-machine-button"]').contains("Add Machine").click();

    // Fill out the form fields
    cy.get('[data-cy="enter-machine-name"]').type(testMachineName);
    cy.get('[data-cy="enter-hourly-rate"]').type(`${testMachineRate}`);
    cy.get('[data-cy="machine-TEST_MACHINE_TYPE"]').click();

    cy.get('[data-cy="machine-add-confirm"]').click();

    // Click the confirm to add the new machine
    cy.get('[data-cy="machine-add-confirm"]').click();

    // Now, use the search bar to find the added machine and confirm it is visible on the dashboard.
    cy.wait('@createMachine').its('response.body.data.id').then((id) => {
      cy.get('[data-cy="searchbar"]').clear().type(`${testMachineName}{enter}`);
      cy.get(`[data-cy="machine-${id}"]`).contains(testMachineName).should('be.visible');
    });
  });
});

describe('Deleting Budget Code tests', () => {
  let testMachineRate = 10;
  let testMachineName = "TEST_Machine_" + Math.floor(Math.random() * 1000).toString();

  beforeEach(() => {
    // Visit the kiosk page before each test. Sign in as admin.
    cy.visit('http://localhost:5173/kiosk');
    cy.get('[data-cy="kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`);
    cy.get('[data-cy="cardnum-input"]').type("\n");
  });

  it('Deletes a budget code and confirms it is removed from the dashboard', () => {
    //This is more or less a "wait until signed in"
    cy.get('[data-cy="users-component"]').should("be.visible");
    // First, add a budget code via the API so we know it exists
    const newBudget = {
      name: testMachineName,
      hourlyRate: testMachineRate,
      machineTypeId:1,
      active:1
    };

    cy.request({
      method: 'POST',
      url: `${API_DB_URL}/machines`,
      headers: { 'Content-Type': 'application/json' },
      body: newBudget,
    }).then((res) => {
      expect(res.status).to.eq(201);
      const createdBudget = res.body.data;
      const machineId = createdBudget.id;
      // Now, go to the machines and search for code.

      //Navigate to machines page.
      cy.get('[data-cy="view-machines"]').should("be.visible");
      cy.get('[data-cy="view-machines"]').click();

      cy.get('[data-cy="searchbar"]').clear().type(`${testMachineName}{enter}`);



      // Click the dropdown trigger for machine actions
      cy.get(`[data-cy="machine-trigger-${machineId}"]`).click();
      // Click on the deactivate action in the dropdown
      cy.get(`[data-cy="machine-deactivate-${machineId}"]`).click();
      // Confirm deactivation in the delete dialog
      cy.get('[data-cy="delete-machine-confirm"]').click();
      cy.get('[data-cy="clear-search-button"]').click({force: true});

      // Finally, search again to ensure the machine component is no longer visible.
      cy.get('[data-cy="searchbar"]').should("be.visible");
      cy.get('[data-cy="searchbar"]').type(`${testMachineName}{enter}`, {force: true});
      cy.get(`[data-cy="no-machines"]`).should('be.visible');
    });
  });

  it('Activating Deactivated code displays them on active tab and removes them from inactive tab ', () => {

    //This is more or less a "wait until signed in"
    cy.get('[data-cy="users-component"]').should("be.visible");

    // First, add a budget code via the API so we know it exists
    let hourlyRate =10;
    const newBudget = {
      name: testMachineName + 1,
      hourlyRate: hourlyRate,
      machineTypeId:1,
      active:1
    };

    cy.request({
      method: 'POST',
      url: `${API_DB_URL}/machines`,
      headers: { 'Content-Type': 'application/json' },
      body: newBudget,
    }).then((res) => {
      expect(res.status).to.eq(201);
      const createdBudget = res.body.data;
      const machineId = createdBudget.id;
      // Now, go to the machines and search for code.

      //Navigate to machines page.
      cy.get('[data-cy="view-machines"]').should("be.visible");
      cy.get('[data-cy="view-machines"]').click();

      cy.get('[data-cy="searchbar"]').clear().type(`${testMachineName + 1}{enter}`);

      // Click the dropdown trigger for machine actions
      cy.get(`[data-cy="machine-trigger-${machineId}"]`).click();
      // Click on the deactivate action in the dropdown
      cy.get(`[data-cy="machine-deactivate-${machineId}"]`).click();
      // Confirm deactivation in the delete dialog
      cy.get('[data-cy="delete-machine-confirm"]').click();
      cy.get('[data-cy="clear-search-button"]').click({force: true});

      // Finally, search again to ensure the machine component is no longer visible.
      cy.get('[data-cy="searchbar"]').should("be.visible");
      cy.get('[data-cy="searchbar"]').type(`${testMachineName + 1}{enter}`, {force: true});
      cy.get(`[data-cy="no-machines"]`).should('be.visible');

      // change to inactive tab and assert its here
      cy.get('[data-cy="inactive-tab"]').click({ force: true });
      cy.wait(1000);
      cy.get('[data-cy="searchbar"]').clear({ force: true }).type(`${testMachineName + 1}{enter}`, {force: true});
      cy.wait(1000);
      cy.get(`[data-cy="machine-${machineId}"]`).contains(testMachineName + 1).should("be.visible");

      // Open the user options to trigger activation
      cy.wait(1000);
      cy.get(`[data-cy="machine-trigger-${machineId}"]`).click({ force: true });
      cy.get(`[data-cy="machine-activate-${machineId}"]`).click();
      cy.get('[data-cy="machine-activate-confirm"]').click();
      // assert its active again

      // assert on the active tab
      cy.get('[data-cy="active-tab"]').click({ force: true });
      cy.get('[data-cy="searchbar"]').clear({ force: true }).type(`${testMachineName + 1}{enter}`, {force: true});
      cy.wait(1000);
      cy.get(`[data-cy="machine-${machineId}"]`).contains(testMachineName + 1).should("be.visible");
    });
  });
});

describe('UI test', () => {
  it('Test pagination, scrolling to the next page displays appropriate next page.', () => {
    // sign in
    cy.request(`${API_DB_URL}/users/${admin_card_num}`).then(() => {
      // intercept
      cy.intercept('GET', `${API_DB_URL}/machines*`).as('getMachines')

      // kiosk machines
      cy.visit('http://localhost:5173/kiosk');
      cy.get('[data-cy="kiosk-button"]').click();
      cy.get('[data-cy="cardnum-input"]')
        .type(`;${admin_card_num};{enter}`);
      cy.get('[data-cy="view-machines"]').last().click();

      // initial load page 1
      cy.wait('@getMachines').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="pagination-current"]').should('contain.text', '1');

       // click Next for page 2
      cy.get('[data-cy="pagination-next"]').last().click({ force: true });
      cy.wait('@getMachines').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="pagination-current"]').should('contain.text', '2');
    });
  });
});
