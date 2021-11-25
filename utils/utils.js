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

utils.handleSortQuery = (sort_by) => {
  /*sets default sort_by behaviour and returns sort_by method.
  returns false if sort_by is not in a list of accepted sort columns*/
  if (!sort_by) {
    return "created_at";
  } else {
    if (!["author", "title", "article_id", "topic", "created_at", "votes", "comment_count"].includes(sort_by)) {
      return false;
    }
  }
  return sort_by;
};

utils.handleOrderQuery = (order) => {
  /*sets default order and returns order method. 
  returns false if order not in a list of accepter order methods*/
  if (!order) return "DESC";
  else if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return false;
  } else {
    return order;
  }
};

utils.assembleSelectArticlesQuery = (sort_by, order, filter, limit, p) => {
  /*assembles selectArticlesQuery using sort_by, order and filter queries provided.
  returns query string and query params in an array which can be de-structured*/
  const pagination = p * limit;
  let queryParams = [];
  let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.comment_id )::integer AS comment_count, COUNT(*) OVER() ::integer AS total_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (filter) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(filter);
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${pagination}`;
  return [queryString, queryParams];
};

utils.handleLimitQuery = (limit) => {
  /* creates default limit variable if no limit query 
  and returns false if limit invalid */
  if (limit === undefined) return 10;

  if (limit <= 0 || isNaN(limit) || limit > 100) return false;
  return limit;
};

utils.handlePaginationOffset = (p) => {
  /*creates a default pagination variable if no query.*/
  if (!p) return 0;
  if (isNaN(p)) return false;
  return p;
};

utils.handleUserSortQuery = (sort_by) => {
  if (!sort_by) {
    return "username";
  } else {
    if (["username", "name", "total_votes"].includes(sort_by)) {
      return sort_by;
    }
  }
};

utils.handleUserSortOrder = (order) => {
  console.log("inhandle usersortorder");
  if (!order) {
    return "DESC";
  } else {
    if (["ASC", "DESC"].includes(order.toUpperCase())) {
      return order;
    }
  }
};

utils.assembleSelectUsersQuery = (sort_by, order) => {
  let query = `SELECT username, avatar_url, name, COALESCE(comment_votes,0)::int + COALESCE(article_votes,0)::int AS total_votes  FROM users LEFT JOIN (SELECT comments.author, COALESCE(SUM(votes),0) AS comment_votes FROM comments GROUP BY comments.author) AS p ON p.author = username LEFT JOIN (SELECT articles.author, COALESCE(SUM(votes),0) AS article_votes FROM articles GROUP BY articles.author) AS q ON q.author = username ORDER BY ${sort_by} ${order};`;
  return query;
};
