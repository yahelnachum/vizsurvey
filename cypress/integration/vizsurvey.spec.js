/// <reference types="cypress" />

describe("vizsurvey", () => {
  it("survey", () => {
    cy.viewport(1200, 700);
    cy.visit("http://localhost:3000");
    //<p><a href="http://localhost:3000/vizsurvey?treatment_id=2">localhost</a></p>
    cy.get("#getQuestionSet").click();
    cy.wait(1000);
    cy.get(".nav-link").contains("Survey").click();
    cy.get("label").contains("$200 today").click();
    cy.get("button").contains("Submit").click();
    cy.get("p").contains("Thank you").should("exist");

    cy.viewport(800, 600);
    cy.visit("http://localhost:3000");
    //<p><a href="http://localhost:3000/vizsurvey?treatment_id=2">localhost</a></p>
    cy.get("#getQuestionSet").click();
    cy.get(".navbar-toggler-icon").click();
    cy.get(".nav-link").contains("Survey").click();
    cy.get(".navbar-toggler-icon").click();
    cy.get("label").contains("$200 today").click();
    cy.get("button").contains("Submit").click();
    cy.get("p").contains("Thank you").should("exist");
  });
});
