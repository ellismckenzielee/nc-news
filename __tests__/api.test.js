const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("GET", () => {
    it("status: 200, responds with a JSON object describing API endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpoints = body.endpoints;
          expect(typeof endpoints).toBe("object");
          expect(endpoints.hasOwnProperty("GET /api"));
        });
    });
    it("status: 404, responds with message: invalid URL", () => {
      return request(app)
        .get("/api2")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
    it("status: 405, responds with message: method not allowed if invalid HTTP verb", () => {
      return request(app)
        .patch("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("method not allowed");
        });
    });
  });
});
