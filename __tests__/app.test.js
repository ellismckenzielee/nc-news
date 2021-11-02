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
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("status: 200, responds with an article object that has specified id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const testArticle = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: new Date(1594329060000).toISOString(),
              votes: 100,
            };
            expect(body.article).toEqual(testArticle);
          });
      });
      it("status: 400, responds with a message: bad request when invalid ID supplied", () => {
        return request(app)
          .get("/api/articles/wrongID")
          .expect(400)
          .then(({ body }) => {
            console.log(body);
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 404, responds with 404 and message Invalid URL if incorrect path specified", () => {
        return request(app)
          .get("/api/articless/3")
          .expect(404)
          .then(({ body }) => {
            console.log(body);
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status: 404, responds with a message: article not found when request is technically correct", () => {
        return request(app)
          .get("/api/articles/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article not found");
          });
      });
    });
    describe("PATCH", () => {
      it("status: 201, responds with updated article when votes increment sent in the request", () => {
        const votesInc = 10;
        return request(app)
          .patch("/api/articles/1")
          .send({ votesInc })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.votes).toBe(110);
          });
      });
      it("status 404, responds with message: article not found", () => {
        const votesInc = 10;
        return request(app)
          .patch("/api/articles/999")
          .send({ votesInc })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article not found");
          });
      });
      it("status: 400, responds with a message: bad request when invalid ID supplied", () => {
        const votesInc = 10;

        return request(app)
          .patch("/api/articles/badId")
          .send({ votesInc })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 400, responds with a message: bad request when passed votesInc is invalid", () => {
        const votesInc = "badVote";
        return request(app)
          .patch("/api/articles/badId")
          .send({ votesInc })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 404, responds with a message: Invalid URL", () => {
        const votesInc = "badVote";
        return request(app)
          .patch("/api/articlees/badId")
          .send({ votesInc })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
    });
  });
});
