import UsersComponent from '../../src/components/Users/users';

describe('UsersComponent', () => {
  let fixtureData;
  let getCallCount = 0;

  //Load fixture data once before all tests.
  before(() => {
    cy.fixture('users.json').then((data) => {
      fixtureData = data;
    });
  });

  beforeEach(() => {
    getCallCount = 0;
    // Intercept GET requests for user list
    cy.intercept('GET', '**/users*', (req) => {
      getCallCount++;
      if (getCallCount === 1) {
        // First GET: return full fixture.
        req.reply({ fixture: 'users.json' });
      } else {
        //Subsequent GET for deletion
        req.reply({
          message: fixtureData.message,
          data: fixtureData.data.slice(1)
        });
      }
    }).as('getUsers');

    //Intercept DELETE requests
    cy.intercept('DELETE', '**/users/*', {
      statusCode: 200,
      body: { message: 'Deleted', data: {} }
    }).as('deleteUser');
  });

  it('renders all users from fixture data', () => {
    cy.mount(<UsersComponent />);
    cy.wait('@getUsers');
    cy.get('[data-cy=user-component]')
    // check if component renders all data
      .should('have.length', fixtureData.data.length);
  });

  it('deletes a user and updates the component', () => {
    cy.mount(<UsersComponent />);
    cy.wait('@getUsers');
    cy.get('[data-cy=user-component]')
      .should('have.length', fixtureData.data.length);

    // click delete on actions 
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-delete]').first().click({ force: true });
    //check dialog appears
    cy.contains("Are you sure?").should("be.visible");
    //confirm
    cy.get('[data-cy=user-delete-confirm]').click({ force: true });
    cy.wait('@deleteUser');
    //wait to fetch new user list 
    cy.wait('@getUsers');
    cy.get('[data-cy=user-component]')
      .should('have.length', fixtureData.data.length - 1);
  });

  it('clicks the ban (timeout) option without assertion', () => {
    cy.mount(<UsersComponent />);
    cy.wait('@getUsers');
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-timeout]').first().click({ force: true });
    //click cancel, nothing happens on ban yet 
    cy.contains("Cancel").click({ force: true });
  });

  it('clicks the add training option and then cancel', function() {
    const user = fixtureData.data[0];
    //Intercept the GET for machine types
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

    //Intercept the POST for trainings
    cy.intercept('POST', '**/trainings', {
      statusCode: 200,
      body: { 
        message: 'Training created', 
        data: { id: 123, userId: user.id, machineTypeId: 456 } 
      }
    }).as('createTraining');

    cy.mount(<UsersComponent />);
    cy.wait('@getUsers');

    //Open dropdown and click the "Add Training" option.
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-add]').first().click({ force: true });

    // Wait for machine types to load.
    cy.wait('@getMachineTypes');

    // Verify that the Add Training dialog appears.
    cy.get('[data-cy=user-training-dialog]').should('exist');
    // simply click Cancel to close the dialog, no routes for banning
    cy.contains("Cancel").click({ force: true });
  });

  it('opens the add training dialog, selects a training type, saves, and asserts the form is closed', function() {
    const user = fixtureData.data[0];
    //Intercept the GET for machine types
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

    //Intercept the POST for trainings.
    cy.intercept('POST', '**/trainings', {
      statusCode: 200,
      body: { 
        message: 'Training created', 
        data: { id: 123, userId: user.id, machineTypeId: 456 } 
      }
    }).as('createTraining');

    cy.mount(<UsersComponent />);
    cy.wait('@getUsers');

    //Open dropdown and click Add Training
    cy.get('[data-cy=user-trigger]').first().click({ force: true });
    cy.get('[data-cy=user-add]').first().click({ force: true });

    //Wait for machine types to load.
    cy.wait('@getMachineTypes');

    //Verify that the Add Training dialog appears.
    cy.get('[data-cy=user-training-dialog]').should('exist');

    //Select a training type from the dropdown
    cy.contains('[data-cy=machine-option]', 'Training Type A').click({ force: true });

    //Click the save button
    cy.get('[data-cy=user-training-add]').click({ force: true });

    //Wait for the POST request
    cy.wait('@createTraining');

    //Assert that the Add Training dialog is not visible anymore
    cy.get('[data-cy=user-training-dialog]').should('not.exist');
  });

});
