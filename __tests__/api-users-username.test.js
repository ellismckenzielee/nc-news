const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("status: 200, responds with a user object", () => {
      const testUser = {
        username: "butter_bridge",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "jonny",
      };
      const username = "butter_bridge";
      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(user).toEqual(testUser);
        });
    });
    it("status: 404, responds with message: user not found", () => {
      const username = "nonexistentuser";
      return request(app)
        .get(`/api/users/${username}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user not found");
        });
    });
    it("status: 404, responds with message: invalid URL", () => {
      const username = "butter_bridge";
      return request(app)
        .get(`/api/useers/${username}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
  });
});
