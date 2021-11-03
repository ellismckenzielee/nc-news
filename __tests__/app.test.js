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
      it("status: 200, responds with all topics", () => {
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
      it("status: 400, responds with a message: 400: bad request", () => {
        return request(app)
          .get("/api/articles/wrongID")
          .expect(400)
          .then(({ body }) => {
            console.log(body);
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 404, responds with a message: invalid URL", () => {
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
      it("status: 400, responds with a message: bad request when passed invalid votesInc", () => {
        const votesInc = "badVote";
        return request(app)
          .patch("/api/articles/badId")
          .send({ votesInc })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 404, responds with a message: invalid URL", () => {
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
  describe("/api/articles", () => {
    describe("GET", () => {
      it("status: 200, returns with an array of articles", () => {
        const testArticle = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        };
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            console.log(articles[0]);
            expect(articles.length).toBe(12);
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
      it("status: 200, returns (by default) ascending date ordered articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at");
          });
      });
      it("status: 200, returns sorted array when sort_by query present", () => {
        const sort_by = "comment_count";
        const testArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: new Date(1594329060000).toISOString(),
          votes: 100,
          comment_count: 11,
        };

        return request(app)
          .get(`/api/articles?sort_by=${sort_by}`)
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("comment_count");
            expect(articles[11]).toEqual(testArticle);
          });
      });
      it("status: 400, returns message: invalid query when invalid sort provided", () => {
        const sort_by = "allthethings";
        return request(app)
          .get(`/api/articles?sort_by=${sort_by}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });
      it("status 200: returns ordered articles when order query sent", () => {
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
            expect(articles.length).toBe(11);
            articles.forEach((article) => {
              article.topic = topic;
            });
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      it("status 200: returns an array of comments", () => {
        const testComment = {
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        };
        const articleId = 1;
        return request(app)
          .get(`/api/articles/${articleId}/comments`)
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(testComment);
            });
          });
      });
      it("status: 404, returns message: invalud URL", () => {
        const articleId = 1;
        return request(app)
          .get(`/api/articles/${articleId}/commnents`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status 400, returns message: 400 bad request when article_id invalid", () => {
        const articleId = "fivehunderd";
        return request(app)
          .get(`/api/articles/${articleId}/comments`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 404, returns message: article not found when technically valid article_id is given", () => {
        const articleId = 4000;
        return request(app)
          .get(`/api/articles/${articleId}/comments`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article not found");
          });
      });
    });
    describe("POST", () => {
      it("status: 201, responds with newly created comment", () => {
        const newComment = {
          username: "icellusedkars",
          body: "this is a comment about article 1!",
        };
        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ newComment })
          .expect(201)
          .then(({ body }) => {
            const { comment: createdComment } = body;
            const testComment = {
              comment_id: expect.any(Number),
              author: "icellusedkars",
              body: "this is a comment about article 1!",
              article_id: 1,
              created_at: expect.any(String),
              votes: expect.any(Number),
            };
            expect(createdComment).toEqual(testComment);
          });
      });
    });
  });
});
