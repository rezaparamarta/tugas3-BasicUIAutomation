describe('Add New Employee', function () {
  beforeEach(function () {
    cy.fixture("loginData").as("loginData");

    cy.origin('https://www.orangehrm.com', () => {
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('postMessage')) return false;
      });
    });

    cy.login(Cypress.env("username"), Cypress.env("password"));

    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Request failed with status code 422')) return false;
    });
  });

  it('Login and Add New Employee', function () {
    cy.get(':nth-child(2) > .oxd-main-menu-item').click();
    cy.url().should('include', '/web/index.php/pim/viewEmployeeList');
    cy.wait(1000);
    // Click (+Add) button
    cy.xpath("//button[normalize-space()='Add']").click();
    cy.url().should('include', '/web/index.php/pim/addEmployee');
    // Upload file
    cy.xpath("//input[@type='file']")
      .should('exist')
      .selectFile("C:\\Users\\Reza Paramarta\\photo.jpg", { force: true });
    // Verify file upload
    cy.xpath("//input[@type='file']")
      .invoke('val')
      .should('include', 'photo.jpg');
    // Input data
    cy.xpath("//input[@placeholder='First Name']").type("Reza");
    cy.xpath("//input[@placeholder='Middle Name']").clear();
    cy.xpath("//input[@placeholder='Last Name']").type("Paramarta");
    // Verify input data
    cy.xpath("//input[@placeholder='First Name']").should("have.value", "Reza");
    cy.xpath("//input[@placeholder='Middle Name']")
      .invoke("val")
      .then(val => expect(val.trim()).to.eq(""));
    cy.xpath("//input[@placeholder='Last Name']").should("have.value", "Paramarta");
    // Input dan Get Id employee
    cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']")
      .invoke('val')
      .should('not.be.empty')
      .then((value) => {
        cy.log('Employee ID:', value);
    // Verify input dan Get Id employee
        cy.request({
          method: 'GET',
          url: '/web/index.php/api/v2/core/validation/unique',
          qs: {
            value: value,
            entityName: 'Employee',
            attributeName: 'employeeId'
          },
          failOnStatusCode: false
        }).then((res) => {
          if (!res.body.data.valid) {
            const newId = 'EMP' + Date.now().toString().slice(-5);
            cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']")
              .clear()
              .type(newId)
              .should('have.value', newId);
            cy.log('Updated ID:', newId);
          }

          cy.intercept('POST', '**/pim/employees').as('createEmployee');
          cy.xpath("//button[normalize-space()='Save']").click();

          cy.wait('@createEmployee').then((interception) => {
            cy.log('Request:', JSON.stringify(interception.request.body));
            cy.log('Status:', interception.response.statusCode);
            cy.log('Response:', JSON.stringify(interception.response.body));

            expect(interception.response.statusCode).to.eq(200);
          });
        });
      });
      // verify success add employee
      cy.url().should('contains', '/web/index.php/pim/viewPersonalDetails/empNumber/');
  });
});
