const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());
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
          expect(comments.length).toBeLessThan(11);
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
    it("status: 404, returns message: article not found when technically valid article_id is given which does not yet exist", () => {
      const articleId = 4000;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    it("status: 200, returns empty array when a valid article ID is given that has no comments", () => {
      const articleId = 2;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    it("status: 200, returns an array of comments when limit query is provided", () => {
      const limit = 5;
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?limit=${limit}`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBeLessThan(limit + 1);
        });
    });
    it("status: 400, returns a message: invalid query if limit <= 0", () => {
      const limit = -1;
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 400, returns a message: invalid query if limit > 100", () => {
      const limit = 105;
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 400, returns a message: invalid query if limit is incorrect type", () => {
      const limit = "ten";
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?limit=${limit}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200, returns an array of comments of length <= 10 (default), when no limit provided", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBeLessThan(11);
        });
    });
    it("status: 200, returns an array of comments offset by limit*p when p query added", () => {
      const p = 1;
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?p=${p}`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(1);
        });
    });
    it("status: 400, returns a message: invalid query if p is NaN", () => {
      const p = "one";
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?p=${p}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query");
        });
    });
    it("status: 200, returns an array of comments with no offset when p <= 0", () => {
      const articleId = 1;
      const testComment = {
        comment_id: 5,
        body: "I hate streaming noses",
        votes: 0,
        author: "icellusedkars",
        created_at: expect.any(String),
      };
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          console.log(comments);
          expect(comments.length).toBeLessThan(11);
          expect(comments[0]).toEqual(testComment);
        });
    });
    it("status: 200, returns an empty array when p too high", () => {
      const p = 100;
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments?p=${p}`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
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
    it("status: 404, responds with message: resource not found if username not in DB", () => {
      const username = "ellis";
      const body = "this is a comment about article 1!";
      const articleId = 1;

      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({ username, body })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("resource not found");
        });
    });
    it("status: 400, responds with message: 400: bad request if invalid article ID", () => {
      const username = "icellusedkars";
      const body = "this is a comment about article 1!";
      const articleId = "incorrectarticleID";

      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({ username, body })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: bad request");
        });
    });
    it("status: 404, responds with message: resource not found for non-present article_id", () => {
      const username = "icellusedkars";
      const body = "this is a comment about article 1!";
      const articleId = 1000;
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({ username, body })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("resource not found");
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
