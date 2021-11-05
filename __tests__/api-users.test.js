const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/users", () => {
  describe("GET", () => {
    it("status: 200, responds with an array of user objects", () => {
      const testUser = {
        username: expect.any(String),
      };
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toEqual(testUser);
          });
        });
    });
    it("status: 405, returns message: method not allowed when using invalid HTTP verb", () => {
      return request(app)
        .post("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("method not allowed");
        });
    });
    it("status: 404, returns message: invalid URL", () => {
      return request(app)
        .get("/api/userss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
  });
});
