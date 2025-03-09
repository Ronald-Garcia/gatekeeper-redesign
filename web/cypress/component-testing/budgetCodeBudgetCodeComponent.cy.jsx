import BudgetCodeComponent from '../../src/components/BudgetCodes/budgetCode';

describe('<BudgetCodeComponent />', () => {

  // run before each test to intercept requests done by hooks, also access data from the fixtures  
  beforeEach(() => {
    // Load fixture data
    cy.fixture('budgetCodes.json').as('budgetCodes');
    //Intercept the DELETE request.
    cy.intercept('DELETE', '**/budget-codes/*', {
      statusCode: 200,
      body: { message: 'Deleted', data: {} }
    }).as('deleteBudgetCode');
  });

  it('renders with fixture data', function() {
    //Access the first budget code
    const budgetCodeData = this.budgetCodes.data[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    
    cy.get('[data-cy=budget-code-component]').should('exist');
    cy.get('[data-cy="budget-name"]').should('contain', this.budgetCodes.data[0].name);
    cy.get('[data-cy="budget-code"]').should('contain', this.budgetCodes.data[0].budgetCode);
    cy.get('[data-cy=budget-code-actions]').should('exist');
  });

  it('click actions displays budget actions', function() {
    const budgetCodeData = this.budgetCodes.data[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    
    cy.get('[data-cy=budget-code-trigger]').click({ force: true });
    cy.get('[data-cy=budget-code-delete]').should('be.visible');
  });

  it('click delete, cancel and confirm works', function() {
    const budgetCodeData = this.budgetCodes.data[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    
    cy.get('[data-cy=budget-code-trigger]').click({ force: true });
    cy.get('[data-cy=budget-code-delete]').click({ force: true });
    cy.get('[data-cy=budget-code-delete-dialog]').should('exist');
    cy.get('[data-cy=budget-code-delete-confirm]').should('be.visible');
    cy.get('[data-cy=budget-code-delete-cancel]').should('be.visible');
    
    cy.get('[data-cy=budget-code-delete-confirm]').click({ force: true });
    cy.wait('@deleteBudgetCode');

  });
});
