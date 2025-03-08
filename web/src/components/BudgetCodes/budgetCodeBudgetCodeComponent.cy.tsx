import BudgetCodeComponent from './budgetCode'

describe('<BudgetCodeComponent />', () => {
  beforeEach(() => {
  // load sample data 
    cy.fixture('budgetCodes.json').as('budgetCodes');
  })

  it('renders with fixture data', function() {
    const budgetCodeData = this.budgetCodes[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    cy.get('[data-cy=budget-code-component]').should('exist');
    cy.get('[data-cy="budget-name"]').should('contain', this.budgetCodes[0].name);
    cy.get('[data-cy="budget-code"]').should('contain', this.budgetCodes[0].budgetCode);
    cy.get('[data-cy=budget-code-actions]').should('exist');
  })

  it('click actions displays budget actions', function() {
    const budgetCodeData = this.budgetCodes[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    cy.get('[data-cy=budget-code-trigger]').click({ force: true });
    cy.get('[data-cy=budget-code-delete]').should('be.visible');
  })


  it('click delete ', function() {
    const budgetCodeData = this.budgetCodes[0];
    cy.mount(<BudgetCodeComponent budgetcode={budgetCodeData} />);
    cy.get('[data-cy=budget-code-trigger]').click({ force: true });
    cy.get('[data-cy=budget-code-delete]').click({ force: true });
    cy.get('[data-cy=budget-code-delete-dialog]').should('exist');
    cy.get('[data-cy=budget-code-delete-confirm]').should('be.visible');
    cy.get('[data-cy=budget-code-delete-cancel]').should('be.visible');
    cy.get('[data-cy=budget-code-delete-confirm]').click({ force: true });
    cy.get('[data-cy=budget-code-component]').should('not.exist');
  })

  
})
