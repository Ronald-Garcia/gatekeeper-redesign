/// <reference types="cypress" />



const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777"
const user_num = "5748372737435832"


describe('Entering kiosk testing', () => {
    beforeEach(() => {
        //Before each test, go to our locally running app.
      cy.visit(`${WEB_URL}/kiosk`)
    })
  
    it('Able to type into input field (for current testing)', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Should is basically your assertion
      cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`)
      cy.get('[data-cy="cardnum-input"]').should("have.value", `;${admin_num};`)
      cy.get('[data-cy="cardnum-input"]').type("\n")
    })
  
    it('displays kiosk when logging in as admin', () => {
      cy.get('[data-cy="cardnum-input"]').type(`;${admin_num};`)
      cy.get('[data-cy="cardnum-input"]').type("\n")
      cy.get('[data-cy="admin-dashboard"]').should("be.visible")
    })

    it('Displays error when trying to log in as user', () => {
        cy.get('[data-cy="cardnum-input"]').type(`;${user_num};`)
        cy.get('[data-cy="cardnum-input"]').type("\n")
        cy.get('[data-cy="cardnum-input"]').should("have.value", "")
      })
  }
  )