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

  it.skip('Soal ke 1 - Positive Case - Login and Add New Employee', function () {
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

  it.skip('Soal ke 1 - Negative Case - Login and Fail Add New Employee', function () {
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
    cy.xpath("//input[@placeholder='Last Name']").type(" ");
    // Verify input data
    cy.xpath("//input[@placeholder='First Name']").should("have.value", "Reza");
    cy.xpath("//input[@placeholder='Middle Name']")
      .invoke("val")
      .then(val => expect(val.trim()).to.eq(""));
    cy.xpath("//input[@placeholder='Last Name']").invoke("val").then(val => expect(val.trim()).to.eq(""));
    cy.get('.--name-grouped-field > :nth-child(3) > .oxd-text').should('have.text', 'Required');

  });

  // Test Case Soal 2 -- Positive Case
  it.skip('Soal ke - 2 : Positive Case - Login and Add Jatah Cuti', function() {
    // Ensure Leave and Click its module
    cy.xpath("//a[@class='oxd-main-menu-item active']").should('be.visible');
    cy.get(':nth-child(3) > .oxd-main-menu-item').click();

    // Click Entitlements
    cy.get('.oxd-topbar-body-nav > ul > :nth-child(3)').click();
    cy.xpath("//a[normalize-space()='Add Entitlements']").click();

    // Type on Employee Name*
    cy.xpath("//input[@placeholder='Type for hints...']").type('Peter');

    // Waiting on API response
    cy.get('.oxd-autocomplete-dropdown > div')
      .contains('Peter Mac Anderson')
      .click();

    // Verify Field filled with Peter Mac Anderson
    cy.xpath("//input[@placeholder='Type for hints...']").should('have.value', 'Peter Mac Anderson');

    // Klik dropdown-nya
    cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text')]").click({multiple: true});
    cy.get('.oxd-select-dropdown > div').eq(2).click();

    // Verify filled with index ke 2
    cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text-input')]")
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.eq('CAN - FMLA');
    });

    // Click Leave Period*
    cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").click({multiple: true});
    // Verify Leave Period filled with 2025-01-01 - 2025-31-12
    cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").should('have.text', '2025-01-01 - 2025-31-12');

    // Type on Entitlement*
    let Entitlement = 2025;
    cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").type(Entitlement);

    // Click 'Save' Button
    cy.xpath("//button[normalize-space()='Save']").click();

    // Popup Confirm
    cy.get('.oxd-sheet').should('be.visible');

    // Click 'Confirm' Button
    cy.get('.orangehrm-modal-footer > .oxd-button--secondary').click();

    // Verify Entitlements Success
    cy.url().should('include', '/web/index.php/leave/viewLeaveEntitlements');

    });

  // Test Case Soal 2 -- Negative Case - //span[normalize-space()='Entitlements']
  it.skip('Soal ke 2 : Negative Case - Fail Add Jatah Cuti', function() {
    // Ensure Leave and Click its module
    cy.xpath("//a[@class='oxd-main-menu-item active']").should('be.visible');
    cy.get(':nth-child(3) > .oxd-main-menu-item').click();

    // Click Entitlements
    cy.get('.oxd-topbar-body-nav > ul > :nth-child(3)').click();
    cy.xpath("//a[normalize-space()='Add Entitlements']").click();

    // Type on Employee Name*
    cy.xpath("//input[@placeholder='Type for hints...']").type('Peter');

    // Waiting on API response
    cy.get('.oxd-autocomplete-dropdown > div')
      .contains('Peter Mac Anderson')
      .click();

    // Verify Field filled with Peter Mac Anderson
    cy.xpath("//input[@placeholder='Type for hints...']").should('have.value', 'Peter Mac Anderson');

    // Klik dropdown-nya
    cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text')]").click({multiple: true});
    cy.get('.oxd-select-dropdown > div').eq(2).click();


    // Verify filled with index ke 2
    cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text-input')]")
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.eq('CAN - FMLA');
    });

    // Click Leave Period*
    cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").click({multiple: true});
    // Verify Leave Period filled with 2025-01-01 - 2025-31-12
    cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").should('have.text', '2025-01-01 - 2025-31-12');

    // Type on Entitlement*
    let Entitlement = 'Ablahulah';
    cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").type(Entitlement);

    // Verify Negative Test Case confirmed
    cy.get('.oxd-input-group > .oxd-text').should('have.text', 'Should be a number with upto 2 decimal places');

    // Click 'Save' Button
    cy.xpath("//button[normalize-space()='Save']").click();
    });

    // Test Case Soal 3 -- Positive Case
    it('Login as new employee', function() {
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
      const newEmployeeId = 'EMP' + Date.now().toString().slice(-6);

      // Isi input Employee ID dengan ID baru
      cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']")
        .clear()
        .type(newEmployeeId)
        .should('have.value', newEmployeeId)
        .then(() => {
          cy.log('Generated Employee ID:', newEmployeeId);
          // Simpan ke alias jika perlu dipakai lagi
          cy.wrap(newEmployeeId).as('generatedEmployeeId');

      // Generate username unik
      const uniqueUsername = `pegawai_${Date.now()}`;

      // Simpan ke alias agar bisa dipakai lagi
      cy.wrap(uniqueUsername).as('generatedUsername');

      // Aktifkan switch untuk buat login
      cy.get('.oxd-switch-input').click();

      // Input username dan password
      cy.get(':nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input').type(uniqueUsername);
      cy.get('.user-password-cell > .oxd-input-group > :nth-child(2) > .oxd-input').type('Aku123!');
      cy.get('.oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type('Aku123!');

      // Simpan akun
      cy.get('.oxd-button--secondary').click();


        });

    it('Soal ke 3 : Positive Case - New Employee Request Entitlements', function() {
        cy.get('@generatedUsername').then((username) => {
        cy.xpath("//input[@placeholder='Username']").type(username);
        cy.xpath("//input[@placeholder='Password']").type('Aku123!');
        cy.xpath("//button[normalize-space()='Login']").click();

        // Request Entitlements
        // Ensure Leave and Click its module
        cy.xpath("//a[@class='oxd-main-menu-item active']").should('be.visible');
        cy.get(':nth-child(3) > .oxd-main-menu-item').click();

        // Click Entitlements
        cy.get('.oxd-topbar-body-nav > ul > :nth-child(3)').click();
        cy.xpath("//a[normalize-space()='Add Entitlements']").click();

        // Type on Employee Name*
        cy.xpath("//input[@placeholder='Type for hints...']").type('Peter');

        // Waiting on API response
        cy.get('.oxd-autocomplete-dropdown > div')
          .contains('Peter Mac Anderson')
          .click();

        // Verify Field filled with Peter Mac Anderson
        cy.xpath("//input[@placeholder='Type for hints...']").should('have.value', 'Peter Mac Anderson');

        // Klik dropdown-nya
        cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text')]").click({multiple: true});
        cy.get('.oxd-select-dropdown > div').eq(2).click();

        // Verify filled with index ke 2
        cy.xpath("//label[text()='Leave Type']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text-input')]")
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.eq('CAN - FMLA');
        });

        // Click Leave Period*
        cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").click({multiple: true});
        // Verify Leave Period filled with 2025-01-01 - 2025-31-12
        cy.xpath("//div[contains(text(),'2025-01-01 - 2025-31-12')]").should('have.text', '2025-01-01 - 2025-31-12');

        // Type on Entitlement*
        let Entitlement = 2025;
        cy.xpath("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").type(Entitlement);

        // Click 'Save' Button
        cy.xpath("//button[normalize-space()='Save']").click();

        // Popup Confirm
        cy.get('.oxd-sheet').should('be.visible');

        // Click 'Confirm' Button
        cy.get('.orangehrm-modal-footer > .oxd-button--secondary').click();

        // Verify Entitlements Success
        cy.url().should('include', '/web/index.php/leave/viewLeaveEntitlements');

        
        });
    });
  });
});
