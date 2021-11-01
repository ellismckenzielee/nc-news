const {
  convertObjectsToArrays,
  createReferenceObject,
  updateObjectsArray,
} = require("../db/utils/utils");

describe("testing convertObjectsToArrays function:", () => {
  describe("testing core functionality", () => {
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

describe("testing createReferenceObject function:", () => {});

describe("testing updateObjectsArray function", () => {});
