const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Optional: tambahkan listener Node.js kalau diperlukan
    },
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 30000,
    baseUrl: "https://opensource-demo.orangehrmlive.com/",
    env: {
      username: "Admin",
      password: "admin123",
    }
  },
});
