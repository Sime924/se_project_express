const supertest = require("supertest");
const app = require("./app");

const request = supertest(app);

describe("Endpoints to respond to requests", () => {
  test("Returns data and status request 200 on request to '/' ", () => {
    return request.get("/").then((response) => {
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello, World!");
    });
  });
});
