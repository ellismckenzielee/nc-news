const utils = {};
module.exports = utils;

utils.createReferenceObject = (array, key, value) => {
  /*creates a reference object linking key and value properties 
  in array*/
};

utils.convertObjectsToArrays = (array, keyOrder) => {
  /*converts array of objects into an array of arrays, using
    the specified keyOrder parameter to maintain consistenorder*/
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
};
