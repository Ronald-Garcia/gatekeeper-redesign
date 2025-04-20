/// <reference types="cypress" />
const API_DB_URL = "http://localhost:3000";
const WEB_URL = "http://localhost:5173";
const admin_num = "1234567890777777";
const admin_cy_num = "123456789044444";

const testUserId = 1;
const testUserName = "ronald";
const userYear = "2026"

const testMachineId = 50;
const testMachineName = "z FILTERING TEST MACHINE";
const testMachineType = "TestMachine1";

const testCodeId = 21412;
const testCodeName = "z Filtering text club";
const testCodeType = "Club";


describe('filter tests', () => {

    it('Check if filtering works for budget code by code type', () => {
        //Quick login to userdashboard
        cy.visit(`${WEB_URL}`);
        cy.get(`[data-cy = kiosk-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        //nav to machines tab
        cy.get(`[data-cy = view-budget-codes]`).click();

        //filter for our machine, assert they are there.
        cy.get(`[data-cy = filter-trigger]`).click();
        cy.get(`[data-cy = box-${testCodeType}]`).click();
        cy.get(`[data-cy = apply-filters]`).click();
        cy.get(`[data-cy = budget-code-${testCodeId}]`);
    });
    
    it('Check if filtering works for user by year', () => {
        //Quick login to userdashboard
        cy.visit(`${WEB_URL}`);
        cy.get(`[data-cy = kiosk-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        //filter for our user, assert they are there.
        cy.get(`[data-cy = filter-trigger]`).click();
        cy.get(`[data-cy = box-${userYear}]`).click();
        cy.get(`[data-cy = apply-filters]`).click();
        cy.get(`[data-cy = ${admin_cy_num}]`);
    });

    it('Check if filtering works for machine by machine type', () => {
        //Quick login to userdashboard
        cy.visit(`${WEB_URL}`);
        cy.get(`[data-cy = kiosk-button]`).click();
        cy.get('[data-cy="cardnum-input"]').type(`${admin_num}`);
        cy.get('[data-cy="cardnum-input"]').type("\n");
        //nav to machines tab
        cy.get(`[data-cy = view-machines]`).click();


        //filter for our machine, assert they are there.
        cy.get(`[data-cy = filter-trigger]`).click();
        cy.get(`[data-cy = box-${testMachineType}]`).click();
        cy.get(`[data-cy = apply-filters]`).click();
        cy.get(`[data-cy = machine-${testMachineId}]`);
    });
})