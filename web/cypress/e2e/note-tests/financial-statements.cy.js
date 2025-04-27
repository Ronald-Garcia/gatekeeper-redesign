/// <reference types="cypress" />


const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";

const adminCardNum = "1234567890777777";

beforeEach(() => {
    // Visit the kiosk page
    cy.visit(`${WEB_URL}`);
  });


describe("Create a financial statements", () => {
    
    it("logs in as admin, navigates to Financial Statements, verifies empty state, and clicks send email", () => {
        //Quick login to userdashboard
        cy.get(`[data-cy = kiosk-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${adminCardNum}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        
        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();
    
        cy.get('[data-cy="statement-tabs"]').should("be.visible");

        cy.get('[data-cy="close-financial-statements"]').click();
        cy.get('[data-cy="statement-tabs"]').should("not.exist");


        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();
        cy.wait(1000);
        
        cy.get('[data-cy="view-financial-statements"]').click();

        //redirection to financial staemtns 
        cy.url().should("include", "/statements");
      });



      it("log in as admin, navigate to financial statements, set automated schedule for financial statements", () => {
        // Log in as admin via the kiosk input.
        //Quick login to userdashboard
        cy.get(`[data-cy = kiosk-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${adminCardNum}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        
        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();
    
        cy.get('[data-cy="statement-tabs"]').should("be.visible");

        cy.get('[data-cy="close-financial-statements"]').click();
        cy.get('[data-cy="statement-tabs"]').should("not.exist");


        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();

        cy.wait(1000);

        cy.get('[data-cy="automate"]').click()
        cy.get('[data-cy="auto-financial-statements-title"]').should('exist');
      });
    });
