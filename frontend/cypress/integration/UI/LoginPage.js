describe("The Login Page", () => {
  it("sets auth cookie when logging in via form submission", () => {
    cy.visit("/signin");
    cy.get("form").within(($form) => {
      cy.get("div[class=form-group]");
      cy.get('input[type="email"]')
        .type(Cypress.env('BOT_EMAIL'))
        .should("have.value", Cypress.env('BOT_EMAIL'));
      cy.get("div[class=form-group]");
      cy.get('input[type="password"]').type(Cypress.env('BOT_PASS'));
      cy.get("button[class='btn btn-primary']").click();
    });
      cy.get('li').should('contain', 'bot')
  });
});
