const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("testing app.js", () => {
  describe("/api/topics", () => {
    it("status: 200. responds with all topics", () => {});
  });
});
