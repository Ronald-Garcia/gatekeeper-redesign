/// <reference types="cypress" />



const API_DB_URL = "https://interlock-api-database-v1.vercel.app"

describe('Entering kiosk testing', () => {
    beforeEach(() => {
        //Before each test, go to our locally running app.
      cy.visit('http://localhost:5173/')
    })
  
    it('Able to type into input field (for current testing)', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Should is basically your assertion
      cy.get('[data-cy="cardnum-input"]').type(";1234567890777777;")
      cy.get('[data-cy="cardnum-input"]').should("have.value", ";1234567890777777;")
      cy.get('[data-cy="cardnum-input"]').type("\n")
    })

    it('displays kiosk when logging in without connection to python server', () => {
      cy.get('[data-cy="cardnum-input"]').type(";1234567890777777;")
      cy.get('[data-cy="cardnum-input"]').type("\n")
      cy.get('[data-cy="admin-dashboard"]').should("be.visible")
    })
  
}
)

