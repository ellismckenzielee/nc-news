const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const topics = require("../db/data/test-data/topics.js");

console.log(seed);
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("testing app.js", () => {
  describe("/api/topics", () => {
    describe("GET", () => {
      it("status: 200. responds with all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).toBe(3);
            const testTopic = {
              description: expect.any(String),
              slug: expect.any(String),
            };
            topics.forEach((topic) => {
              expect(topic).toEqual(testTopic);
            });
          });
      });
    });
    describe("error handling:", () => {
      it("status: 404, responds with invalid URL", () => {
        return request(app)
          .get("/api/topicss")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
    });
  });
});
