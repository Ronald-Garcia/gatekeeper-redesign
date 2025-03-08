/// <reference types="cypress" />


describe('Notes testing', () => {
    beforeEach(() => {
        //Before each test, go to our locally running app.
      cy.visit('http://localhost:5173/')
    })
  
    it('displays title on launch', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are two matched items,
      // which are the two default items.
      cy.get('[data-testid="cardnum-input"]').type(";1234567890777777;")
    })
  
}
)