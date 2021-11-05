const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/articles", () => {
  describe("GET", () => {
    it("status: 200, responds with an array of articles", () => {
      const testArticle = {
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
        total_count: expect.any(Number),
      };
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toEqual(testArticle);
          });
        });
    });
    it("status: 404, returns message: invalid URL if url incorrect", () => {
      return request(app)
        .get("/api/articless")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
    it("status: 200, returns (by default) descending date ordered articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("status: 200, returns sorted  of objects when sort_by query present", () => {
      const sort_by = "comment_count";
      return request(app)
        .get(`/api/articles?sort_by=${sort_by}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    it("status: 400, returns message: invalid query when invalid sort query provided", () => {
      const sort_by = "allthethings";
      return request(app)
        .get(`/api/articles?sort_by=${sort_by}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200: returns ordered articles when order query sent", () => {
      const order = "DESC";
      return request(app)
        .get(`/api/articles?order=${order}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("status: 400, returns message: invalid query when invalid order provided", () => {
      const order = "sidewards";
      return request(app)
        .get(`/api/articles?order=${order}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200, returns array of filtered article objects when topic query provided", () => {
      const topic = "mitch";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article.topic).toBe(topic);
          });
        });
    });
    it("status: 404, returns a message: topic not found when a tehnically valid topic is passed that does not exist", () => {
      const topic = "squirrels";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("topic not found");
        });
    });
    it("status: 200, returns an empty article array when a valid topic that has no associated articles is passed as topic query", () => {
      const topic = "paper";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(0);
        });
    });
    it("status: 200, returns article array when order, sort_by and topic passed as queries", () => {
      const [order, sort_by, topic] = ["DESC", "title", "mitch"];
      return request(app)
        .get(`/api/articles?order=${order}&sort_by=${sort_by}&topic=${topic}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            article.topic = topic;
          });
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    ///WOKRING ON
    it("status: 200, returns <= limit articles when a limit query is sent", () => {
      const limit = 5;
      return request(app)
        .get(`/api/articles?limit=${limit}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeLessThan(limit + 1);
        });
    });
    it("status: 200, returns <= 10 articles when a limit query is not present", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeLessThan(11);
        });
    });
    it("status: 400, returns message: invalid query when limit value is <= 0", () => {
      const limit = -1;
      return request(app)
        .get(`/api/articles?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 400, returns message invalid query if limit value is NaN", () => {
      const limit = "tenthousand";
      return request(app)
        .get(`/api/articles?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 400, returns message invalid query if limit value is >100", () => {
      const limit = 105;
      return request(app)
        .get(`/api/articles?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200, returns offset paginated articles when offset is specified", () => {
      const p = 1;
      return request(app)
        .get(`/api/articles?p=${p}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(2);
        });
    });
    it("status: 200: returns offset paginated articles when limit, offset (p), sort_by and order specified", () => {
      const limit = 5;
      const p = 1;
      const sort_by = "title";
      const order = "DESC";
      return request(app)
        .get(
          `/api/articles?limit=${limit}&p=${p}&sort_by=${sort_by}&order=${order}`
        )
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeLessThan(limit + 1);
          expect(articles[0].title).toBe(
            "Seven inspirational thought leaders from Manchester UK"
          );
        });
    });
    it("status: 200: returns empty array when p value too high", () => {
      const limit = 5;
      const p = 100;
      const sort_by = "title";
      const order = "DESC";
      return request(app)
        .get(
          `/api/articles?limit=${limit}&p=${p}&sort_by=${sort_by}&order=${order}`
        )
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(0);
        });
    });
    it("status: 400, responds with message: invalid query when p query is NaN", () => {
      const limit = 5;
      const p = "pageone";
      return request(app)
        .get(`/api/articles?limit=${limit}&p=${p}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200, responds with array of articles that have a total_count property", () => {
      const limit = 5;
      const p = 1;
      return request(app)
        .get(`/api/articles?limit=${limit}&p=${p}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length > 0).toBe(true);
          articles.forEach((article) => {
            expect(article.total_count).toEqual(expect.any(Number));
          });
        });
    });
  });
  describe("POST", () => {
    it("status: 201, responds with newly created article", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const body = "the best story that ever was.";
      const topic = "mitch";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };
      const testArticle = {
        ...newArticle,
        article_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        comment_count: 0,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          console.log(article);
          expect(article).toEqual(testArticle);
        });
    });
    it("status: 404 responds with invalid url", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const body = "the best story that ever was.";
      const topic = "mitch";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };
      const testArticle = {
        ...newArticle,
        article_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        comment_count: 0,
      };

      return request(app)
        .post("/api/articless")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid URL");
        });
    });
    it("status: 400, responds with message: 400 bad request if author missing from req.body", () => {
      const title = "a new story";
      const body = "the best story that ever was.";
      const topic = "mitch";
      const newArticle = {
        title,
        body,
        topic,
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with message: 400 bad request if title missing from req.body", () => {
      const author = "butter_bridge";
      const body = "the best story that ever was.";
      const topic = "mitch";
      const newArticle = {
        author,
        body,
        topic,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with message: 400 bad request if body missing from req.body", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const topic = "mitch";
      const newArticle = {
        author,
        topic,
        title,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with message: 400 bad request if topic missing from req.body", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const body = "the best story that ever was.";
      const newArticle = {
        author,
        body,
        title,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 404, responds with message: resource not found if author does not exist", () => {
      const author = "ellis";
      const title = "a new story";
      const body = "the best story that ever was.";
      const topic = "mitch";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("resource not found");
        });
    });
    it("status: 404, responds with message: resource not found if topic does not exist", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const body = "the best story that ever was.";
      const topic = "bose";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("resource not found");
        });
    });
    it("status: 400, responds with message: 400: bad request if body is empty string", () => {
      const author = "butter_bridge";
      const title = "a new story";
      const body = "";
      const topic = "mitch";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 400, responds with message: 400: bad request if title is empty string", () => {
      const author = "butter_bridge";
      const title = "";
      const body = "content";
      const topic = "mitch";
      const newArticle = {
        author,
        title,
        body,
        topic,
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
  });
});
