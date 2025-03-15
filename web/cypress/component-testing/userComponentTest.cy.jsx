import UserComponent from "@/components/Users/user";

describe('<UserComponent />', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('userData');
    // Intercept DELETE requests for users.
    cy.intercept('DELETE', '**/users/*', {
      statusCode: 200,
      body: { message: 'Deleted', data: {} }
    }).as('deleteUser');
  });

  it('renders with fixture data', function() {
    const user = this.userData.data[0];
    cy.mount(<UserComponent user={user} />);
    cy.get('[data-cy=user-component]').should('exist');
    cy.contains(user.name).should('be.visible');
    cy.get('[data-cy=user-actions]').should('exist');
  });

  it('click actions displays user actions dropdown', function() {
    const user = this.userData.data[0];
    cy.mount(<UserComponent user={user} />);
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-delete]').should('be.visible');
    cy.get('[data-cy=user-timeout]').should('be.visible');
    cy.get('[data-cy=user-add]').should('be.visible');
  });

  it('click delete, then cancel and confirm works', function() {
    const user = this.userData.data[0];
    cy.mount(<UserComponent user={user} />);
    
    // Open dropdown and click Delete
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-delete]').first().click({ force: true });
    
    // Verify that the delete dialog appears
    cy.contains("Are you sure?").should("be.visible");
    cy.contains("delete the user").should("be.visible");
    cy.contains("Cancel").should("be.visible");
    cy.contains("Delete").should("be.visible");
    
    // Click Cancel to close the dialog
    cy.contains("Cancel").click({ force: true });
    cy.contains("Are you sure?").should("not.exist");
    
    // Reopen dropdown and click Delete again
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-delete]').first().click({ force: true });
    cy.contains("Are you sure?").should("be.visible");
    
    // Click the confirm button (we assume your DeleteUserDialog now has a dedicated data‑cy attribute)
    cy.get('[data-cy=user-delete-confirm]').click({ force: true });
    cy.wait('@deleteUser');
    cy.contains("Are you sure?").should("not.exist");
  });

  it('click timeout (ban), then cancel and confirm works', function() {
    const user = this.userData.data[0];
    cy.mount(<UserComponent user={user} />);
    
    // Open dropdown and click Timeout (ban)
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-timeout]').should('be.visible').first().click({ force: true });
    
    // Verify that the ban dialog appears
    cy.contains("Are you sure?").should("be.visible");
    cy.contains("ban the user").should("be.visible");
    cy.contains("Cancel").should("be.visible");
    cy.contains("Ban").should("be.visible");
    
    // Click Cancel to close the ban dialog
    cy.contains("Cancel").click({ force: true });
    cy.contains("Are you sure?").should("not.exist");
    
    // Optionally wait a brief moment for the dropdown to be removed
    cy.wait(300);
    
    // Reopen dropdown and ensure the Timeout option is visible
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-timeout]', { timeout: 5000 }).should('be.visible').first().click({ force: true });
    
    // Verify that the ban dialog appears again
    cy.contains("Are you sure?").should("be.visible");
    
    // Click Ban to confirm the action
    cy.contains("Ban").click({ force: true });
    cy.contains("Are you sure?").should("not.exist");
  });

  it('click add training, then cancel and confirm works', function() {
    const user = this.userData.data[0];

    // Intercept the GET request for machine types
    cy.intercept('GET', '**/machine-types*', {
      statusCode: 200,
      body: {
        message: 'Success',
        data: [
          { id: 456, type: 'Training Type A' },
          { id: 789, type: 'Training Type B' }
        ]
      }
    }).as('getMachineTypes');

    // Intercept the POST request for training creation
    cy.intercept('POST', '**/trainings', {
      statusCode: 200,
      body: { 
        message: 'Training created', 
        data: { id: 123, userId: user.id, machineTypeId: 456 } 
      }
    }).as('createTraining');

    cy.mount(<UserComponent user={user} />);
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-add]').first().click({ force: true });
    cy.wait('@getMachineTypes');
    cy.get('[data-cy=user-training-dialog]').should('exist');

    // Optionally, simulate selecting a machine option
    cy.get('[data-cy=machine-option]').first().click({ force: true });

    // Click the "Save Changes" button
    cy.get('[data-cy=user-training-add]').click({ force: true });
    cy.wait('@createTraining');

    // Verify that the training dialog closes
    cy.get('[data-cy=user-training-dialog]').should('not.exist');
  });
});