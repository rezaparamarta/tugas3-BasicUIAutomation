const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Optional: tambahkan listener Node.js kalau diperlukan
    },
    supportFile: "cypress/support/commands.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    defaultCommandTimeout: 30000,
    baseUrl: "https://opensource-demo.orangehrmlive.com/",
    env: {
      username: "Admin",
      password: "admin123",
    },
    video: false,
  },
});
