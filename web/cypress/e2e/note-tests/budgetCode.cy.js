/// <reference types="cypress" />

const API_DB_URL = "http://localhost:3000";
let admin_card_num = "1234567890777777";


describe('Add Budget Code tests', () => {
  // Generate unique test values for each run
  let testBudgetCode = "TEST" + Math.floor(Math.random() * 100000).toString();
  let testBudgetName = "TEST_BUDGET_" + Math.floor(Math.random() * 1000).toString();

  beforeEach(() => {
    // Before each test, visit the kiosk page.
    cy.visit('http://localhost:5173/kiosk');
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  });

  it('Add a budget code and have it show up on the dashboard', () => {
    // Ensure that a budget code with the test code doesn't exist by deleting it via the API.
    // (This step follows the same idea as the user tests.)
    cy.request({
      url: `${API_DB_URL}/budgetcodes?search=${testBudgetName}`,
      failOnStatusCode: false,
    }).then((req) => {
      // If we found a budget code, DELETE THEM. Otherwise, they are fine.
      if (req.status === 200) {
        // Get the specific budget code id, then delete it.
        const foundBudget = req.body.data;
        console.log("foundBudget");
        console.log(foundBudget.id);
        const budgetId = foundBudget.id;
        console.log(`/budgetcodes/${budgetId}`);
        cy.request({
          method: 'DELETE',
          url: `${API_DB_URL}/budgetcodes/${budgetId}`,
        });
      }
    });

    //Navigate to budget codes page.
    cy.get('[data-cy="view-budget-codes"]').should("be.visible");
    cy.get('[data-cy="view-budget-codes"]').click();

    // Click the "Add Budget Code" button; assumes the add dialog is triggered by an element
    cy.get('[data-cy="budget-code-add-dialog"]').should("be.visible");
    cy.get('[data-cy="budget-code-add-dialog"] button')
      .contains("Add Budget Code")
      .click();

    // Fill out the form fields
    cy.get('[data-cy="enter-budget-name"]').type(testBudgetName);
    cy.get('[data-cy="enter-budget-code"]').type(testBudgetCode);

    // Click the confirm (Save Changes) button to add the new budget code
    cy.get('[data-cy="budget-code-add-confirm"]').click();

    // Now, use the search bar to find the added budget code and confirm it is visible on the dashboard.
    cy.get('[data-cy="searchbar"]').clear().type(`${testBudgetName}{enter}`);
    cy.get(`[data-cy="budget-code-${testBudgetCode}"]`).contains(testBudgetName).should("be.visible");
  });
});


describe('Deleting Budget Code tests', () => {
  let testBudgetCode = "TEST" + Math.floor(Math.random() * 100000).toString();
  let testBudgetName = "TEST_BUDGET_" + Math.floor(Math.random() * 1000).toString();

  beforeEach(() => {
    // Visit the kiosk page before each test. Sign in as admin.
    cy.visit('http://localhost:5173/kiosk');
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  });

  it('Deletes a budget code and confirms it is removed from the dashboard', () => {
    //This is more or less a "wait until signed in"
    cy.get('[data-cy="users-component"]').should("be.visible")
    // First, add a budget code via the API so we know it exists
    const newBudget = {
      name: testBudgetName,
      code: testBudgetCode,
    };

    cy.request({
      method: 'POST',
      url: `${API_DB_URL}/budget-codes`,
      headers: { 'Content-Type': 'application/json' },
      body: newBudget,
    }).then((res) => {
      expect(res.status).to.eq(201);
      const createdBudget = res.body.data;
      const budgetId = createdBudget.id
      // Now, go to the budgetcodes and search for code.

      //Navigate to budget codes page.
      cy.get('[data-cy="view-budget-codes"]').should("be.visible");
      cy.get('[data-cy="view-budget-codes"]').click();

      cy.get('[data-cy="searchbar"]').clear().type(`${testBudgetName}{enter}`);

      // On the 

      // Click the dropdown trigger for budget code actions
      cy.get(`[data-cy="budget-code-trigger-${budgetId}"]`).click();
      // Click on the delete action in the dropdown
      cy.get(`[data-cy="budget-code-delete-${budgetId}"]`).click();
      // Confirm deletion in the delete dialog
      cy.get('[data-cy="budget-code-delete-confirm"]').click();
      cy.get('[data-cy="clear-search-button"]').click( {force: true});

      // Finally, search again to ensure the budget code component is no longer visible.
      cy.get('[data-cy="searchbar"]').should("be.visible");
      cy.get('[data-cy="searchbar"]').type(`${testBudgetName}{enter}`, {force: true});
      cy.get(`[data-cy="no-codes"]`).should('be.visible');
    });
  });
});
