const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    it("status: 200, responds with all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(topics.length).toBe(3);
          const testTopic = {
            description: expect.any(String),
            slug: expect.any(String),
          };
          topics.forEach((topic) => {
            expect(topic).toEqual(testTopic);
          });
        });
    });
    it("status: 404, responds with invalid URL", () => {
      return request(app)
        .get("/api/topicss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
  });
  describe("POST", () => {
    it("status: 201, responds with new topic object", () => {
      const slug = "pearl jam";
      const description = "a band";
      const testTopic = { slug, description };
      return request(app)
        .post("/api/topics")
        .send({ slug, description })
        .expect(201)
        .then(({ body }) => {
          const { topic } = body;
          console.log(topic);
          expect(topic).toEqual(testTopic);
        });
    });
    it("status: 404, responds with message: invalid url", () => {
      const slug = "pearl jam";
      const description = "a band";
      const testTopic = { slug, description };
      return request(app)
        .post("/api/topiccs")
        .send({ slug, description })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid URL");
        });
    });
    it("status: 409, responds with message: topic already exists", () => {
      const slug = "mitch";
      const description = "a band";
      return request(app)
        .post("/api/topics")
        .send({ slug, description })
        .expect(409)
        .then(({ body }) => {
          expect(body.msg).toBe("topic already exists");
        });
    });
    it("status: 400, responds with message: bad request if key is missing", () => {
      const slug = "cool stuff";
      return request(app)
        .post("/api/topics")
        .send({ slug })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("ststus: 400, responds with message: bad request if description is empty", () => {
      const slug = "cool stuff";
      const description = "";
      return request(app)
        .post("/api/topics")
        .send({ slug, description })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("status: 405, responds with message: method not allowed", () => {
      return request(app)
        .delete("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("method not allowed");
        });
    });
  });
});
