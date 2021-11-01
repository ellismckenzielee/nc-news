const {
  convertObjectsToArrays,
  createReferenceObject,
  updateObjectsArray,
} = require("../db/utils/utils");

describe("testing convertObjectsToArrays function:", () => {
  describe("testing core functionality:", () => {
    it("should return an empty array when passed an empty array", () => {
      const inputArr = [];
      const expected = [];
      const actual = convertObjectsToArrays(inputArr);
      expect(actual).toEqual(expected);
    });
    it("should return an array with a single ordered array when passed an array with a single nested object and a key order", () => {
      const inputArr = [
        {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
      ];
      const keyOrder = ["username", "name", "avatar_url"];
      const expected = [
        [
          "butter_bridge",
          "jonny",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        ],
      ];
      const actual = convertObjectsToArrays(inputArr, keyOrder);
      expect(actual).toEqual(expected);
    });
    it("should return an array of multiple ordered arrays when passed an array of multiple nested objects and a key order", () => {
      const inputArr = [
        {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
        {
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        },
      ];
      const keyOrder = ["username", "name", "avatar_url"];
      const expected = [
        [
          "butter_bridge",
          "jonny",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        ],
        [
          "icellusedkars",
          "sam",
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        ],
      ];
      const actual = convertObjectsToArrays(inputArr, keyOrder);
      expect(actual).toEqual(expected);
    });
  });
  describe("testing side effects:", () => {
    const inputArr = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    const inputArrFixed = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    const keyOrder = ["username", "name", "avatar_url"];
    const actual = convertObjectsToArrays(inputArr, keyOrder);

    it("input array reference should not be the output array reference", () => {
      expect(actual).not.toBe(inputArr);
    });
    it("input array should not be mutated", () => {
      expect(inputArr).toEqual(inputArrFixed);
    });
  });
});

describe("testing createReferenceObject function:", () => {
  describe("testing core functionality:", () => {
    it("should return an object when passed an array", () => {
      const inputArr = [];
      const expected = "object";
      const actual = createReferenceObject(inputArr);
      expect(typeof actual).toBe(expected);
    });
    it("should return correct reference object when passed an array with a single object", () => {
      const inputArr = [
        {
          user_id: 1,
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
      ];
      const expected = {
        butter_bridge: 1,
      };
      const [key, value] = ["username", "user_id"];
      const actual = createReferenceObject(inputArr, key, value);
      expect(actual).toEqual(expected);
    });
    it("should return correct reference object when passed an array containing multiple objects", () => {
      const inputArr = [
        {
          user_id: 1,
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
        {
          user_id: 2,
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        },
        {
          user_id: 3,
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        },
      ];
      const [key, value] = ["username", "user_id"];

      const expected = {
        butter_bridge: 1,
        icellusedkars: 2,
        rogersop: 3,
      };
      const actual = createReferenceObject(inputArr, key, value);
      expect(actual).toEqual(expected);
    });
    it("should be generalised - works with arrays containing objects which describe other types of data", () => {
      const inputArr = [
        {
          topic_id: 78,
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        },
      ];
      const [key, value] = ["slug", "topic_id"];
      const expected = {
        mitch: 78,
      };
      const actual = createReferenceObject(inputArr, key, value);
      expect(actual).toEqual(expected);
    });
  });
  describe("testing side effects:", () => {
    const inputArr = [
      {
        user_id: 1,
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        user_id: 2,
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    const inputArrFixed = [
      {
        user_id: 1,
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        user_id: 2,
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    const [key, value] = ["username", "user_id"];
    createReferenceObject(inputArr, key, value);

    it("input should not be mutated", () => {
      expect(inputArr).toEqual(inputArrFixed);
    });
  });
});

const refObj = {
  butter_bridge: 1,
  icellusedkars: 2,
};
describe("testing updateObjectsArray function:", () => {
  describe("testing core functionality:", () => {
    it("should return an empty array when passed an empty array", () => {
      const inputArr = [];
      const expected = [];
      const actual = updateObjectsArray(inputArr);
      expect(actual).toEqual(expected);
    });
    it("should return an array of length equal to the input array length", () => {
      const inputArr = [{}, {}, {}];
      const expected = 3;
      const actual = updateObjectsArray(inputArr);
      expect(actual.length).toBe(expected);
    });
    it("should return an array with a single object with keys updated, when passed an array with a single object", () => {
      const inputArr = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: new Date(1594329060000),
          votes: 100,
        },
      ];
      const expected = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author_id: 1,
          body: "I find this existence challenging",
          created_at: new Date(1594329060000),
          votes: 100,
        },
      ];
      const keyToUpdate = "author";
      const newKey = "author_id";
      const actual = updateObjectsArray(inputArr, refObj, keyToUpdate, newKey);
      expect(actual).toEqual(expected);
    });
    it("should return an array of objects with updated keys, when passed an array with mulitple objects", () => {
      const inputArr = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: new Date(1594329060000),
          votes: 100,
        },
        {
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: new Date(1578406080000),
          votes: 0,
        },
      ];
      const expected = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author_id: 1,
          body: "I find this existence challenging",
          created_at: new Date(1594329060000),
          votes: 100,
        },
        {
          title: "Z",
          topic: "mitch",
          author_id: 2,
          body: "I was hungry.",
          created_at: new Date(1578406080000),
          votes: 0,
        },
      ];
      const keyToUpdate = "author";
      const newKey = "author_id";
      const actual = updateObjectsArray(inputArr, refObj, keyToUpdate, newKey);
      expect(actual).toEqual(expected);
    });
  });
  describe("testing side effects:", () => {
    it("input array should not be mutated", () => {});
    it("input array reference should not equal the output array reference", () => {});
  });
});
