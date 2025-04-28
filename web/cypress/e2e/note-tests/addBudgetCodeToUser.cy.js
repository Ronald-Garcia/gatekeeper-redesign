/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
const test_user_num = "5555555555555555";
const test_user_name = "hruiehgured";
const test_code_1 = "11298365"
const test_code_2 = "1120875"
var userId = 807;

const login = () => {
    //Before each test, go to our locally running app and sign in.
    cy.visit(`${WEB_URL}`)
    cy.get('[data-cy= "kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`)
    cy.get('[data-cy="cardnum-input"]').should("have.value", `;${admin_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
    //Search for the fresh user we just made and ensure they are there and unique.
    cy.get('[data-cy = "searchbar"]').type(`${test_user_name}\n`);
    cy.get(`[data-cy = users-component]`).should("have.length", 1);
    cy.get(`[data-cy = ${test_user_num.substring(0,16)}]`).should("be.visible");
}
describe('budget code user relation tests', () => {
    beforeEach(() => {
      //get admin credentials
      cy.request(`http://localhost:3000/users/${admin_num}`);
      // Post a couple of budget codes in there to make sure we have some.
      // Dont card if we fail, since we will reference the unique code number
      cy.visit(`${WEB_URL}`)
      cy.get('[data-cy= "kiosk-button"]').click();
      cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`)
      cy.get('[data-cy="cardnum-input"]').should("have.value", `;${admin_num};`)
      cy.get('[data-cy="cardnum-input"]').type("\n")
      //Search for the fresh user we just made and ensure they are there and unique.
      cy.get('[data-cy = "searchbar"]').type(`${test_user_name}\n`);
      cy.get(`[data-cy = "users-component"]`).should("have.length", 1);
      cy.get(`[data-cy = ${test_user_num.substring(0,16)}]`).should("be.visible");
        
    });
    it('Add a budget code to a user', () => {


        cy.request({
            url: `${API_DB_URL}/user-budgets/${userId}`,
            method: "PATCH",
            body: {
                budget_code: []
            }
        }).then(() => {
        //first, ensure no budget codes on user.
        cy.request(`${API_DB_URL}/user-budgets/${userId}`).then((res) => {
            assert(res.body.data.length === 0);
            //Simple test. Just click actions -> budgetCodes -> first budget code.
            cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
            cy.wait(1000);
            cy.get(`[data-cy = user-budget-code-${test_user_num.substring(0,15)} ]`).click();
            cy.wait(1000);
            cy.get(`[data-cy = toggle-budget-code-${test_code_1} ]`).click({ force: true })
            .should('have.attr', 'data-state', 'on').then(() => {
                //Check budget code button is on.
                cy.get(`[data-cy = toggle-budget-code-${test_code_1} ]`).should("have.attr", "data-state", "on"); 

                cy.get(`[data-cy = add-budget-code-save ]`).click()
                cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
                cy.get(`[data-cy = user-budget-code-${test_user_num.substring(0,15)} ]`).click();
                cy.get(`[data-cy = toggle-budget-code-${test_code_1} ]`).should("have.attr", "data-state", "on");
            });
        })
        })


    })
    it('Turn off a budget code from a user', () => {
        //First, add one budget code to the user.
        cy.request(`${API_DB_URL}/user-budgets/${userId}`).then((res) => {
            //Check budget code button is on.
            cy.get(`[data-cy = user-trigger-${test_user_num.substring(0,15)} ]`).click();
            cy.wait(1000);
            cy.get(`[data-cy = user-budget-code-${test_user_num.substring(0,15)} ]`).click();
            cy.wait(1000);
            cy.get(`[data-cy = toggle-budget-code-${test_code_1} ]`).should("have.attr", "data-state", "on");
            // Turn the budget code off.
            cy.get(`[data-cy=toggle-budget-code-${test_code_1}]`).click({ force: true })
              .should('have.attr', 'data-state', 'off');
            // Save the changes after toggling off.
            cy.get(`[data-cy=add-budget-code-save]`).click();
              // Open the user again and then assert that it's off for the budget code on it.
              cy.get(`[data-cy=user-trigger-${test_user_num.substring(0,15)}]`).click({ force: true });
              cy.get(`[data-cy=user-budget-code-${test_user_num.substring(0,15)}]`).click();
              cy.get(`[data-cy=toggle-budget-code-${test_code_1}]`)
                .should("have.attr", "data-state", "off");
    })
  })
})