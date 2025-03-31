/// <reference types="cypress" />


const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";

const adminCardNum = "1234567890777777";

beforeEach(() => {
    // Visit the kiosk page
    cy.visit(`${WEB_URL}/kiosk`);
  });


describe("Create a financial statements", () => {
    
    it("logs in as admin, navigates to Financial Statements, verifies empty state, and clicks send email", () => {
        // Log in as admin via the kiosk input.
        cy.get('[data-cy="cardnum-input"]')
          .clear()
          .type(`;${adminCardNum};{enter}`);
    
        // see the admin dashboard
        
        cy.get('[data-cy="admin-dashboard"]').should("be.visible");
    
        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();
    
        cy.get('[data-cy="statement-tabs"]').should("be.visible");

        cy.get('[data-cy="close-financial-statements"]').click();
        cy.get('[data-cy="statement-tabs"]').should("not.exist");


        // click financial statemnt button 
        cy.get('[data-cy="financial-statements-dialog"]').click();
        cy.get('[data-cy="view-financial-statements"]').click();

        //redirection to financial staemtns 
        cy.url().should("include", "/statements");
      });

    });
