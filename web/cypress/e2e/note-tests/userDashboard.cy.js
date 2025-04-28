/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
const admin_cy_num = "1234567890444444";

const testUserId = 1;
const testUserName = "ronald";
const userYear = "2026"

const testMachineId = 50;
const testMachineName = "z FILTERING TEST MACHINE";
const testMachineType = "TestMachine1";

const testCodeId = 21412;
const testCodeName = "z Filtering text club";
const testCodeType = "Club";


describe('user dashboard functionality', () => {

    it('login to user dashboard and see machines', () => {
        //Quick login to userdashboard
        cy.visit(`${WEB_URL}`);
        cy.get(`[data-cy = user-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        //nav to machines tab


        cy.get(`[data-cy="machine-user"]`).should("exist")

        cy.get(`[data-cy="user-stats"]`).click();

        cy.get(`[data-cy="chart-view"]`).should("exist");

    });


})