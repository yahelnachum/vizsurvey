/// <reference types="cypress" />

describe("vizsurvey", () => {
  it("survey", () => {
    cy.viewport(1200, 700);
    cy.visit("http://localhost:3000");
    cy.get("#getQuestionSet").click();
    cy.wait(1000);
    cy.get(".nav-link").contains("Survey").click();
    cy.get("#id0").click();
    cy.get("#id3").click();
    // cy.get("button").contains("Submit").click();
    cy.get("p").contains("Thank you").should("exist");

    cy.viewport(800, 600);
    cy.visit("http://localhost:3000");
    cy.get("#getQuestionSet").click();
    cy.get(".navbar-toggler-icon").click();
    cy.get(".nav-link").contains("Survey").click();
    cy.get(".navbar-toggler-icon").click();
    cy.get("#id0").click();
    cy.get("#id3").click();
    cy.get("p").contains("Thank you").should("exist");
  });
});
