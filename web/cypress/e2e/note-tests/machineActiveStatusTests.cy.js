/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
var machineId;
const testMachineTypeId = 1;
const machineName = "TestingMill2";
const usedMachineId = 38;

const activeMachineName = "LATHE";
const activeMachineId = 2;
const curTime = new Date();
const oldTime = "2024-04-20T03:14:30.913Z"

describe('active status testing', () => {
    beforeEach(() => {
      //get admin credentials
      cy.request(`http://localhost:3000/users/${admin_num}`);
      // Post a new machine in there that is inactive. On fail, does not matter if same name machine
      
        //Let make a fresh machine that is inactive.
        //Commented out for now as we use a static inactive machine
        /*
        cy.request({
            url: `${API_DB_URL}/machines`,
            method: "POST",
            body:
            {
                "name":machineName,
                "hourlyRate":35,
                "machineTypeId":testMachineTypeId,
                "active": 0
            },
          }).then((req) => {
            //Now, get the id number.
            machineId = req.body.data.id;
            console.log(machineId);
        })
        */
    })

    //Delete the user we made.
    afterEach(() => {
        //Uncomment in future when making fresh machines.
        /*

        cy.request({
            url: `${API_DB_URL}/machines/${machineId}`,
            method: "DELETE",
          })

        */
    })

    it('Check if inactivated machine has the inactive tag', () => {
        //Quick login to userdashboard
        cy.visit(`${WEB_URL}`);
        cy.get(`[data-cy = user-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        //Search up our machine
        cy.get('[data-cy="searchbar"]').type(`${machineName}`);
        cy.get('[data-cy="searchbar"]').type(`\n`);
        cy.get(`[data-cy = inactive-${usedMachineId}]`);
    })

    it('Check if activated machine has the active tag', () => {

        cy.request({
            url: `${API_DB_URL}/machines/${activeMachineId}`,
            method: "PATCH",
            body:
            {
                "name":machineName,
                "hourlyRate":35,
                "machineTypeId":testMachineTypeId,
                "active": 1,
                "lastTimeUsed":oldTime
            },
          }).then(() => {

            //Quick login to userdashboard
            cy.visit(`${WEB_URL}`);
            cy.get(`[data-cy = user-button]`).click();
            cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
            cy.get('[data-cy="cardnum-input"]').type("\n");
            //Search up our machine
            cy.get('[data-cy="searchbar"]').type(`${activeMachineName}`);
            cy.get('[data-cy="searchbar"]').type(`\n`);
            cy.get(`[data-cy = available-${activeMachineId}]`);
        })
    })

    it('Check if activated machine has the in use tag after "use" ', () => {
        //Simulate a use with a update to last use time for the machine
        cy.request({
            url: `${API_DB_URL}/machines/${activeMachineId}`,
            method: "PATCH",
            body:
            {
                "name":machineName,
                "hourlyRate":35,
                "machineTypeId":testMachineTypeId,
                "active": 1,
                "lastTimeUsed":curTime
            },
          }).then(() => {
            //Now, log in, check it has the in use tag.
            cy.visit(`${WEB_URL}`);
            cy.get(`[data-cy = user-button]`).click();
            cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
            cy.get('[data-cy="cardnum-input"]').type("\n");
            //Search up our machine
            cy.get('[data-cy="searchbar"]').type(`${activeMachineName}`);
            cy.get('[data-cy="searchbar"]').type(`\n`);
            cy.get(`[data-cy = in-use-${activeMachineId}]`);
            
        })

    })
})