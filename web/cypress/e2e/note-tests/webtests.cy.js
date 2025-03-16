/// <reference types="cypress" />



const API_DB_URL = "http://localhost:3000"

let admin_card_num = "1234567890777777";
describe('Add user tests', () => {
  let test_user_cardnum = "8987816946561711"
  beforeEach(() => {
    //Before each test, go to our locally running app and use the testing carNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  })

  it('Add a user and have it show up on the dashboard', () => {
    // Let's make sure to the user we are about to make does not exist by deleting them
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy="cardnum-input"]').type(`;1234567890777777;`)
    cy.get('[data-cy="cardnum-input"]').type("\n")

    cy.request({
      url: `http://localhost:3000/users/${test_user_cardnum}`,
      failOnStatusCode: false,
    }).then((req) => {
      //If we found a user, DELETE THEM. Otherwise, they are fine.
      
      //This is to resign in as an admin
      cy.request(`http://localhost:3000/users/${admin_card_num}`);

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

    //Get the current length of users.
    //const usersLength = cy.get('[data-cy=users-component]').get(length)
    // Get add user button and click it. Assert form shows up.
    cy.get('[data-cy="add-user-button"]').click()
    // Fill out the form.
    cy.get('[data-cy = "enter-student-name"]').type("THE_TESTING_USER_44")
    cy.get('[data-cy = "enter-cardnum"]').type(`${test_user_cardnum}`)
    cy.get('[data-cy = "enter-jhed"]').type("aaaae4")
    cy.get('[data-cy = "enter-grad-year"]').type("2030")

    // Confirm
    cy.get('[data-cy = "user-add-confirm"]').click()
    
    // Search for component, confirm it is there.
    cy.get('[data-cy = "searchbar"]').type("THE_TESTING_USER_44\n");
    cy.get(`[data-cy = ${test_user_cardnum.substring(0,15)}]`).should("be.visible");
  
  })
})


describe('Remove user tests', () => {
  let test_user_cardnum = "8987816946561711"
  beforeEach(() => {
    //Before each test, go to our locally running app and use the testing carNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy="cardnum-input"]').type(`;1234567890777777;`)
    cy.get('[data-cy="cardnum-input"]').type("\n")

    cy.request({
      url: `http://localhost:3000/users/${test_user_cardnum}`,
      failOnStatusCode: false,
    }).then((req) => {
      //This is to resign in as an admin
      cy.request(`http://localhost:3000/users/${admin_card_num}`);

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
  })

  it('Remove a user and have them not show up on the dashboard', () => {
    
    // Let's make sure to the user we are about to make does not exist by deleting them
    let us = 1;
    cy.request({
      method: "POST",
      url: `http://localhost:3000/users`,
      failOnStatusCode: false,
      body: {
        name: "test",
        cardNum: test_user_cardnum,
        JHED: "ttest01",
        graduationYear: 2030,
        isAdmin: 1
      }
    }).then(res => {
        console.log(res.body);
        us = res.body.data.id
            // Search for component, confirm it is there.
        cy.get('[data-cy = "searchbar"]').type("test\n");
        cy.get(`[data-cy = ${test_user_cardnum.substring(0,15)}]`).should("be.visible").not();

        cy.get(`[data-cy = "user-trigger-${us}"]`).click()
    })
    //Get the current length of users.
    //const usersLength = cy.get('[data-cy=users-component]').get(length)
    // Get add user button and click it. Assert form shows up.
    cy.get('[data-cy = "user-delete"]').click()
    cy.get('[data-cy = "user-delete-confirm"]').click()
    
  
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