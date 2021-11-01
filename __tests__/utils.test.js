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

describe("testing updateObjectsArray function", () => {});
