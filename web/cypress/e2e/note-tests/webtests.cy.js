/// <reference types="cypress" />



const API_DB_URL = "http://localhost:3000"


describe('Add user tests', () => {
  let test_user_cardnum = "8987816946561711"
  beforeEach(() => {
    //Before each test, go to our locally running app and use the testing carNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy="cardnum-input"]').type(`;1234567890777777;`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  })

  it('Add a user and have it show up on the dashboard', () => {
    // Let's make sure to the user we are about to make does not exist by deleting them
    cy.request({
      url: `http://localhost:3000/users/${test_user_cardnum}`,
      failOnStatusCode: false,
    }).then((req) => {
      //If we found a user, DELETE THEM. Otherwise, they are fine.
      if (req.status === 200) {
        //Get the specific user id, then delete them.
        const foundUser = req.body.data
        console.log("foundUser");
        console.log(foundUser.id);
        const userId = foundUser.id
        console.log(`/users/${userId}`);
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
        })
      }
    })
    
    // Set up interception of user post request for later.
    cy.intercept('POST', '**/users*', (req) => {}).as("createUser");

    //Get the current length of users.
    //const usersLength = cy.get('[data-cy=users-component]').get(length)
    // Get add user button and click it. Assert form shows up.
    cy.get('[data-cy="add-user-button"]').click()
    // Fill out the form.
    cy.get('[data-cy = "enter-student-name"]').type("THE_TESTING_USER_43")
    cy.get('[data-cy = "enter-cardnum"]').type(`${test_user_cardnum}`)
    cy.get('[data-cy = "enter-jhed"]').type("aaaae4")
    cy.get('[data-cy = "enter-grad-year"]').type("2030")

    // Confirm
    cy.get('[data-cy = "user-add-confirm"]').click()
    
    //Make intercept of the creation request, then read the response.
    cy.wait('@createUser').then((interception) => {
      console.log(interception.response);
      if (interception.response.statusCode !== 201){
        cy.contains("Did not successfully create user").should('not.exist')
      }
      else {
        assert.equal(interception.response.statusCode, 201)
        assert.equal(interception.response.body.message, "User has been created")
      }
    })   
  })
})


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

  it('displays kiosk when logging in (without connection to python server)', () => {
    cy.get('[data-cy="cardnum-input"]').type(";1234567890777777;")
    cy.get('[data-cy="cardnum-input"]').type("\n")
    cy.get('[data-cy="admin-dashboard"]').should("be.visible")
  })

}
)