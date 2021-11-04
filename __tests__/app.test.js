const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("testing app.js", () => {
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
            console.log(body);
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
    describe.only("DELETE", () => {
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
    });
  });
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
      it("status: 200, returns <= limit articles when a limit query is sent", () => {
        const limit = 5;
        return request(app)
          .get(`/api/articles?limit=${limit}`)
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            console.log(articles);
            expect(articles.length).toBe(limit);
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
      it("status 200: returns offset paginated articles when limit and offset (p) specified", () => {
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
            expect(articles.length).toBe(5);
            expect(articles[0].title).toBe(
              "Seven inspirational thought leaders from Manchester UK"
            );
          });
      });
      it("status 200: returns empty array when p value too high", () => {
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
      it("status: 400, returns message: 400 bad request when article_id invalid", () => {
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
      it("status: 201, responds with newly created comment object", () => {
        const username = "icellusedkars";
        const body = "this is a comment about article 1!";

        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ username, body })
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            const testComment = {
              comment_id: expect.any(Number),
              author: "icellusedkars",
              body: "this is a comment about article 1!",
              article_id: 1,
              created_at: expect.any(String),
              votes: expect.any(Number),
            };
            expect(comment).toEqual(testComment);
          });
      });
      it("status: 404, responds with message: invalid URL", () => {
        const username = "icellusedkars";
        const body = "this is a comment about article 1!";

        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/commments`)
          .send({ username, body })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status: 404, responds with message: username not found if username not in DB", () => {
        const username = "ellis";
        const body = "this is a comment about article 1!";

        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ username, body })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("username not found");
          });
      });
      it("status: 400, responds with message: 400: bad request if posted comment does not have username", () => {
        const body = "this is a comment about article 1!";

        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ body })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 400, responds with message: 400: bad request if posted comment does not have a body", () => {
        const username = "icellusedkars";
        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ username })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 400, responds with message: 400: bad request if posted comment has body key but no content", () => {
        const username = "icellusedkars";
        const body = "";
        const articleId = 1;
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ username, body })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      it("status: 204, upon successful deletion", () => {
        const comment_id = 1;
        return request(app).delete(`/api/comments/${comment_id}`).expect(204);
      });
      it("status: 404, responds with message: comment not found", () => {
        const comment_id = 999;
        return request(app)
          .delete(`/api/comments/${comment_id}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("comment not found");
          });
      });
      it("status: 404, responds with message: invalid URL", () => {
        const comment_id = 1;
        return request(app)
          .delete(`/api/commentss/${comment_id}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status: 400, responds with message: 400: bad request if invalid comment_id type is passed", () => {
        const comment_id = "badcommentID";
        return request(app)
          .delete(`/api/comments/${comment_id}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
    });
    describe("PATCH", () => {
      it("status: 200, responds with updated comment object - votes can be incremented", () => {
        const inc_votes = 10;
        const comment_id = 1;
        const testComment = {
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 26,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        };
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ inc_votes })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toEqual(testComment);
          });
      });
      it("status: 200, responds with updated comment object - votes can be decremented", () => {
        const inc_votes = -10;
        const comment_id = 1;
        const testComment = {
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 6,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        };
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ inc_votes })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toEqual(testComment);
          });
      });
      it("status: 404, responds with message: comment not found for technically correct comment_id", () => {
        const comment_id = 9090;
        const inc_votes = 100;
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ inc_votes })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("comment not found");
          });
      });
      it("status: 404, responds with message: invalid url", () => {
        const inc_votes = 10;
        const comment_id = 1;
        return request(app)
          .patch(`/api/commennts/${comment_id}`)
          .send({ inc_votes })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status: 400, responds with message: 400: bad request if inc_votes is invalid type", () => {
        const comment_id = 1;
        const inc_votes = "add100";
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ inc_votes })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 400, responds with message: 400: bad request if votes increment stored on incorrect key", () => {
        const comment_id = 1;
        const incVotes = 5;
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ incVotes })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
      it("status: 400, responds with message: 400 bad request if the comment_id is the incorrect type", () => {
        const comment_id = "thecomment";
        const incVotes = 5;
        return request(app)
          .patch(`/api/comments/${comment_id}`)
          .send({ incVotes })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: bad request");
          });
      });
    });
  });
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
});
