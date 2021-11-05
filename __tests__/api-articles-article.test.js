const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    it("status: 200, responds with an article object that has specified id", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}`)
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
            comment_count: 11,
          };
          const { article } = body;
          expect(article).toEqual(testArticle);
        });
    });
    it("status: 400, responds with a message: 400: bad request", () => {
      const article_id = "wrongID";
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 404, responds with a message: invalid URL", () => {
      const article_id = 3;
      return request(app)
        .get(`/api/articless/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
    it("status: 404, responds with a message: article not found when request is technically correct", () => {
      const article_id = 1000;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
  });
  describe("PATCH", () => {
    it("status: 200, responds with updated article object when inc_votes sent in the request body", () => {
      const inc_votes = 10;
      const article_id = 1;
      const testArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        body: "I find this existence challenging",
        author: "butter_bridge",
        created_at: "2020-07-09T21:11:00.000Z",
        votes: 110,
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({ inc_votes })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(testArticle);
        });
    });
    it("status: 404, responds with message: article not found", () => {
      const inc_votes = 10;
      const article_id = 999;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({ inc_votes })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    it("status: 400, responds with a message: bad request when invalid ID supplied", () => {
      const inc_votes = 10;
      const article_id = "badID";
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({ inc_votes })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with a message: bad request when passed invalid inc_votes", () => {
      const inc_votes = "badVote";
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({ inc_votes })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with a message: bad request when passed vote increment on incorrect key", () => {
      const incVotes = 10;
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({ incVotes })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 404, responds with a message: invalid URL", () => {
      const inc_votes = 10;
      const article_id = 1;
      return request(app)
        .patch(`/api/articless/${article_id}`)
        .send({ inc_votes })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
    it.skip("status: 200, responds with article if request body is empty", () => {
      const article_id = 1;
      const testArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        body: "I find this existence challenging",
        author: "butter_bridge",
        created_at: "2020-07-09T21:11:00.000Z",
        votes: 100,
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({})
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(testArticle);
        });
    });
  });
  describe("DELETE", () => {
    it("status: 204, on successful deletion", () => {
      const article_id = 1;
      return request(app).delete(`/api/articles/${article_id}`).expect(204);
    });
    it("status: 404, returns message: article not found when article_id correct type", () => {
      const article_id = 999;
      return request(app)
        .delete(`/api/articles/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    it("status: 400, returns message: 400: bad request when article_id incorrect type", () => {
      const article_id = "badarticleid";
      return request(app)
        .delete(`/api/articles/${article_id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 404, returns message: invalid url", () => {
      const article_id = 1;
      return request(app)
        .delete(`/api/artticles/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
  });
});
