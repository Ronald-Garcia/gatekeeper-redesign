import BudgetCodes from '../../src/components/BudgetCodes/budgetCodes';
import { $codes } from '@/data/store';

describe('BudgetCodes Component', () => {
  let fixtureData;
  let getCallCount = 0;

  //Load fixture data once before all tests
  before(() => {
    cy.fixture('budgetCodes.json').then((data) => {
      fixtureData = data;
    });
  });

  beforeEach(() => {
    getCallCount = 0;

    cy.intercept('GET', '**/budget-codes*', (req) => {
      getCallCount++;
      if (getCallCount === 1) {
        req.reply({ fixture: 'budgetCodes.json' });
      } else {
        //reply with a modified version, with first item removed to simulate deletion. 
        req.reply({
          message: fixtureData.message,
          data: fixtureData.data.slice(1)
        });
      }
    }).as('getBudgetCodes');

    //Intercept DELETE
    cy.intercept('DELETE', '**/budget-codes/*', {
      statusCode: 200,
      body: { message: 'Deleted', data: {} }
    }).as('deleteBudgetCode');
  });


  it('renders components correctly', () => {
    //Mount the component.
    cy.mount(<BudgetCodes />);
    
    //wait for GET 
    cy.wait('@getBudgetCodes');
   
    cy.get('[data-cy=budget-code-component]')
      .should('have.length', fixtureData.data.length);
  });

  it('deletes budget code and updates the component', () => {
    //Mount the component.
    cy.mount(<BudgetCodes />);
    
    //wait for GET 
    cy.wait('@getBudgetCodes');
    
    //simulate deletion of budget code
    cy.get('[data-cy=budget-code-trigger]').first().click({ force: true });
    cy.get('[data-cy=budget-code-delete]').first().click({ force: true });
    cy.get('[data-cy=budget-code-delete-dialog]').should('exist');
    cy.get('[data-cy=budget-code-delete-confirm]').first().click({ force: true });
    
    //wait for deletion
    cy.wait('@deleteBudgetCode');
    
    //intercept second GET request 
    cy.wait('@getBudgetCodes');
    
    //Assert that component was deleted
    cy.get('[data-cy=budget-code-component]')
      .should('have.length', fixtureData.data.length - 1);
  });

  
});
