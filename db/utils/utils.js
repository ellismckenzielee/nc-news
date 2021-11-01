const utils = {};
module.exports = utils;

utils.createReferenceObject = (array, key, val) => {
  /*creates a reference object linking key and value properties 
  in array*/
  return array.reduce((refObj, cur) => {
    refObj[cur[key]] = cur[val];
    return refObj;
  }, {});
};

utils.convertObjectsToArrays = (array, keyOrder) => {
  /*converts array of objects into an array of arrays, using
    the specified keyOrder parameter to maintain consistent order*/
  return array.map((item) => {
    const valuesArray = [];
    for (let key of keyOrder) {
      valuesArray.push(item[key]);
    }
    return valuesArray;
  });
};

utils.updateObjectsArray = (array, referenceObject, keyToUpdate, newKey) => {
  /*returns an array of updated objects. keyToUpdate and newKe specify the name of the 
    key to update and the new key name, respectively*/
  return array.map((item) => {
    const updatedObj = {};
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (key === keyToUpdate) {
        updatedObj[newKey] = referenceObject[item[key]];
      } else {
        updatedObj[key] = item[key];
      }
    });
    return updatedObj;
  });
};
