describe("Add and delete accouncement", () => {
  it("Adds new announcement with basic title and body", () => {
    cy.visit("/");

    cy.request("POST", "localhost:8000/api/signin", {
      email: Cypress.env("BOT_EMAIL"),
      password: Cypress.env("BOT_PASS"),
    });

    cy.visit("/user/manage/announcement");

    cy.get("div.col-md-4")
      .children()
      .eq(2)
      .within(() => {
        cy.get("ul").children().first().children("input").click();
      });
    cy.get("div.col-md-4")
      .children()
      .eq(3)
      .within(() => {
        cy.get("ul").children().first().children("input").click();
      });
    cy.get("div.col-md-8")
      .children("form")
      .within(($form) => {
        cy.get("div[class=form-group]");
        cy.get('input[type="text"]')
          .first()
          .type("Testowe ogłoszenie bota")
          .should("have.value", "Testowe ogłoszenie bota");
        cy.get("div[class=form-group]");
        cy.get('div[class="ql-editor ql-blank"]').type(
          "wololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololowololo",
          { delay: 10 }
        );
        cy.get("button[class='btn btn-primary']").click();
      });
  });

  it("Goes to Announcements and checks if newly created ann exists", () => {
    cy.request("POST", "localhost:8000/api/signin", {
      email: Cypress.env("BOT_EMAIL"),
      password: Cypress.env("BOT_PASS"),
    });

    cy.contains("Announcements").click();
    cy.location("href").should("eq", "http://localhost:3000/announcements");
    cy.get("article")
      .children()
      .first()
      .children()
      .first()
      .children("a")
      .children("h2")
      .should((h2) => {
        expect(h2).to.contain("Testowe ogłoszenie bota");
      });
  });

  it("Deletes newly created announcement", () => {
    cy.request("POST", "localhost:8000/api/signin", {
      email: Cypress.env("BOT_EMAIL"),
      password: Cypress.env("BOT_PASS"),
    });

    cy.contains("bot Dashboard").click();
    cy.location("href").should("eq", "http://localhost:3000/user");
    cy.get("div.col-md-4").children().eq(2).children().first().click();
    cy.location("href").should(
      "eq",
      "http://localhost:3000/user/manage/announcements"
    );
    cy.contains("Delete").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Are you sure you want to delete this?`);
      cy.type("{enter}");
    });
  });
});
