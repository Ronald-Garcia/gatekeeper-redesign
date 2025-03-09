import StartPage from "@/components/pages/start-page";

describe('<StartPage /> Component', () => {
  beforeEach(() => {
    //Intercept turnOnMachine.
    cy.intercept('POST', '**/turn-on', {
      statusCode: 200,
      body: { message: 'success: machine turned on' },
    }).as('turnOnMachine');

    //Intercept validateUser.
    cy.intercept('GET', '**/users/*/*', {
      statusCode: 200,
      body: { userStatus: 'userValid' },
    }).as('validateUser');
  });

  it('renders StartPage correctly', () => {
    cy.mount(<StartPage />);
    cy.contains('Swipe').should('be.visible');
    cy.get('button').contains('JHUOAuth').should('be.visible');
    cy.get('[data-testid="cardnum-input"]').should('exist');
  });

  it('clicking the JHUOAuth button calls turnOnMachine', () => {
    cy.mount(<StartPage />);
   
  
    cy.get('button').contains('JHUOAuth').click();
    cy.wait('@turnOnMachine').its('response.body').should('deep.equal', { message: 'success: machine turned on' });

  });

  it('handles invalid card swipe input', () => {
    cy.intercept('GET', '**/users/123/4', {
      statusCode: 400,
      body: { message: 'User not found' },
    }).as('validateUserInvalid');
    
    
    cy.on('uncaught:exception', (err) => {
      return false;
    });
    
    cy.mount(<StartPage />);
    cy.get('[data-testid="cardnum-input"]').type(';1234;{enter}');
    
    cy.wait('@validateUserInvalid').then((interception) => {
      expect(interception.request.url).to.contain('/users/123/4');
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body).to.deep.equal({ message: 'User not found' });
    });

  });


  it('handles valid card swipe input', () => {
    cy.intercept('GET', '**/users/123456789077777/7', {
      statusCode: 200,
      body: { message: 'user found', data: { id: 1, name: 'Test User Long' } },
    }).as('validateUserValidLong');
    
    cy.mount(<StartPage />);
    cy.get('[data-testid="cardnum-input"]').type(';1234567890777777;{enter}');
    
    cy.wait('@validateUserValidLong').then((interception) => {
      expect(interception.request.url).to.contain('/users/123456789077777/7');
      expect(interception.response.body).to.deep.equal({ message: 'user found', data: { id: 1, name: 'Test User Long' } });
    });
  });
});
