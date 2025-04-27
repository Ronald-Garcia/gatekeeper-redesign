/// <reference types="cypress" />

const API_DB_URL = "http://localhost:3000"

let admin_card_num = "1234567890777777";

describe('Add user tests', () => {
  let test_user_cardnum = "8987816946561711"
  beforeEach(() => {
    //Before each test, go to our locally running app and use the testing cardNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy= "kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  })

  it('Add a user and have it show up on the dashboard', () => {

    cy.request({
      url: `${API_DB_URL}/users/${test_user_cardnum}`,
      failOnStatusCode: false,
    }).then((req) => {
      //If we found a user, DELETE THEM. Otherwise, they are fine.
      
      //This is to re‑sign in as an admin
      cy.request(`${API_DB_URL}/users/${admin_card_num}`);

      if (req.status === 200) {
        //Get the specific user id, then delete them.
        const foundUser = req.body.data
        const userId = foundUser.id
        cy.request({
          method: 'DELETE',
          url: `${API_DB_URL}/users/${userId}`,
        })
      }
    })

    //Get add user button and click it. Assert form shows up.
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
    
    // now assert the new user ID cell is visible
    cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`)
      
      .should("be.visible");
  })
})

describe('Remove user tests', () => {
  let test_user_cardnum = "8987816946561711"
  beforeEach(() => {
    //Before each test, go to our locally running app and use the testing cardNum "1234567890777777"
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy= "kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")

    cy.request({
      url: `${API_DB_URL}/users/${test_user_cardnum}`,
      failOnStatusCode: false,
    }).then((req) => {
      //This is to re‑sign in as an admin
      cy.request(`${API_DB_URL}/users/${admin_card_num}`);

      //If we found a user, DELETE THEM. Otherwise, they are fine.
      if (req.status === 200) {
        //Get the specific user id, then delete them.
        const foundUser = req.body.data
        const userId = foundUser.id
        cy.request({
          method: 'DELETE',
          url: `${API_DB_URL}/users/${userId}`,
        })
      }
    })
  })

  it('Making a user inactive has them not show up on the dashboard in active tab, but yes on inactive tab', () => {
    
    // Let's make sure the user we are about to add does not exist by deleting them first 
    cy.request({
      method: "POST",
      url: `${API_DB_URL}/users`,
      failOnStatusCode: false,
      body: {
        name: "Atest",
        cardNum: test_user_cardnum,
        JHED: "ttest01",
        graduationYear: 2030,
        isAdmin: 1
      }
    }).then((res) => {
      // Capture a unique identifier
      const userIdentifier = res.body.data.cardNum;
      
      // Search for component, confirm it is there.
      cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
      
      // scroll container to bottom before grabbing the row
      cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`)
        .should("be.visible");
      
      // Open the user options to trigger deletion 
      cy.get(`[data-cy="user-trigger-${userIdentifier}"]`).click();
    });

    // Get delete button and click it
    cy.get('[data-cy = "user-delete"]').click()
    cy.get('[data-cy = "user-delete-confirm"]').click()

    // Wait for deletion 
    cy.wait(1000);
    
    // Look up deleted user on active search and assert its not there
    cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
    // scroll container again

    cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`).should("not.exist");

    cy.wait(1000);

    // Switch to inactive tab and search here 
    cy.get('[data-cy="inactive-tab"]').click({ force: true });
    cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
    // scroll container in inactive view

    cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`)
      
      .should("be.visible");
  })


  it('Activating Deactivated user displays them on active tab and removes them from inactive tab ', () => {
    // make sure the user we are about to add does not exist by deleting them first 
    cy.request({
      method: "POST",
      url: `${API_DB_URL}/users`,
      failOnStatusCode: false,
      body: {
        name: "Atest",
        cardNum: test_user_cardnum,
        JHED: "ttest01",
        graduationYear: 2030,
        isAdmin: 1
      }
    }).then((res) => {
      // Capture a unique identifier 
      const userIdentifier = res.body.data.cardNum;
      
      // Search for component, confirm it is there.
      cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
      cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`).should("be.visible");
      
      // Open the user options to trigger deletion 
      cy.get(`[data-cy="user-trigger-${userIdentifier}"]`).click();
    });

    // Get delete button and click it
    cy.get('[data-cy = "user-delete"]').click()
    cy.get('[data-cy = "user-delete-confirm"]').click()

    // Wait for deletion 
    cy.wait(1000);
    
    // Look up deleted user on active search and assert its not tehre
    cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
    cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`).should("not.exist");

    cy.wait(1000);

    //Switch to inactive tab and search here 
    cy.get('[data-cy="inactive-tab"]').click({ force: true });
    cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
    cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`).should("be.visible");


    
    // Open the user options to trigger deletion 

    cy.wait(1000);
    cy.get(`[data-cy="user-trigger-${test_user_cardnum.substring(0,15)}"]`).click({ force: true });
    cy.get('[data-cy = "user-activate"]').click()
    cy.get('[data-cy = "user-activate-confirm"]').click()


   // assert on the active tab
   cy.get('[data-cy="active-tab"]').click({ force: true });
   cy.get('[data-cy="searchbar"]').clear({ force: true }).type("THE_TESTING_USER_44\n");
   cy.get(`[data-cy="${test_user_cardnum.substring(0,16)}"]`).should("be.visible");
 
  })
})

describe('UI test', () => {


  beforeEach(() => {
    cy.visit('http://localhost:5173/kiosk')
    cy.get('[data-cy= "kiosk-button"]').click();
    cy.get('[data-cy="cardnum-input"]').type(`;${admin_card_num};`)
    cy.get('[data-cy="cardnum-input"]').type("\n")
  })
    
  it('Test pagination, scrolling to the next page displays appropiate next page. ', () => {
    // Ensure we are logged in with admin credentials for API calls.
    cy.request(`${API_DB_URL}/users/${admin_card_num}`).then(() => {
      // Now ensure there's enough active users for pagination
      cy.request('GET', `${API_DB_URL}/users?search=&limit=100&page=1&sort=name_asc&active=1`)
        .then(response => {
          const currentActiveUsers = response.body.data.length;
          const numUsersToAdd = Math.max(0, 11 - currentActiveUsers);
          if(numUsersToAdd > 0) {
            Cypress._.times(numUsersToAdd, (i) => {
              // Create a unique 16-digit card number using a base value plus random offset.
              const randomOffset = Cypress._.random(100000, 999999);
              const cardNum = (7000000000000000 + randomOffset + i).toString();
              cy.request({
                method: 'POST',
                url: `${API_DB_URL}/users`,
                body: {
                  name: `PAG_TEST_USER_${i}`,
                  cardNum: cardNum,
                  JHED: `pagtest${i}`,
                  graduationYear: 2030,
                  isAdmin: 1
                },
                failOnStatusCode: false
              });
            });
          }
        })
        .then(() => {
          //Set up intercept before loading for new GET request
          cy.intercept('GET', `${API_DB_URL}/users*`).as('getUsers');
      
          //wait for page to load check response form the user 
          cy.wait('@getUsers').then((initialInterception) => {
            const initialPage = initialInterception.response.body.currentPage || 1;
            cy.get('[data-cy="pagination-current"]').should("contain.text", `${initialPage}`);
          });
      
          // go to next page
          cy.get('[data-cy="pagination-next"]').last().click();
      
          // ait for the API to load page data
          cy.wait('@getUsers').then((page2Interception) => {
            //Verify that the API call was successful
            expect(page2Interception.response.statusCode).to.eq(200);
            
            //Get the current page number 
            const page2 = page2Interception.response.body.currentPage || 2;
            
            //Assert that the pagination UI shows next page
            cy.get('[data-cy="pagination-current"]').should("contain.text", `${page2}`);
            
         
          });
        });
    });
  });
});
