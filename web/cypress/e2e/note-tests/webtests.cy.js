/// <reference types="cypress" />



const API_DB_URL = "https://interlock-api-database-v1.vercel.app"

describe('Entering kiosk testing', () => {
    beforeEach(() => {
        //Before each test, go to our locally running app.
      cy.visit('http://localhost:5173/kiosk')
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

describe('Adding a user test', () => {
  beforeEach(() => {
      //Before each test, go to our locally running app and use the testing carNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy="cardnum-input"]').type(";1234567890777777;")
    cy.get('[data-cy="cardnum-input"]').type("\n")

  })

  it('Add a user and have it show up on the dashboard', () => {
    // Set up interception of user post request for later.
    cy.intercept('POST', '**/users*', (req) => {}).as("createUser");


    //Get the current length of users.
    //const usersLength = cy.get('[data-cy=users-component]').get(length)
    // Get add user button and click it. Assert form shows up.
    cy.get('[data-cy="add-user-button"]').click()
    // Fill out the form.
    cy.get('[data-cy = "enter-student-name"]').type("THE_TESTING_USER_17")
    cy.get('[data-cy = "enter-cardnum"]').type("8655145962561711")
    cy.get('[data-cy = "enter-jhed"]').type("aaaa4")
    cy.get('[data-cy = "enter-grad-year"]').type("2030")
    // Confirm
    cy.get('[data-cy = "user-add-confirm"]').click()
    
    //Make intercept of the creation request, then read the response.
    cy.wait('@createUser').then((interception) => {
      const [createdUser] = interception.response.body.data
      const userId = createdUser.id
      assert.equal(interception.response.statusCode, 201)
      assert.equal(interception.response.body.message, "User created")
      // Ok now delete him.
      cy.request("DELETE", `${API_DB_URL}/users/${userId}`)
    })
    
  })

}
)