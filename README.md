# Northcoders News API

## Available at:

### https://nc-news-ellis.herokuapp.com/api

## Project Summary

Northcoders News API is a restful API which serves article, comment and topic information to endpoints specified in *https://nc-news-ellis.herokuapp.com/api*. The API stack is a combination of JavaScript/Express and a Postgres DBMS.

```http
*example endpoints*
/api
/api/articles
/api/topics
/api/articles/:article_id
```

## Installation Instructions

The installation instructions are are follows:

**1.** run git clone *https://github.com/ellismckenzielee/nc-news.git*  
**2.** **cd** into nc-news  
**3.** enter **npm install** to install dependencies  
**4.** enter **npm run setup-dbs** to setup nc-news database  
**5.** enter **touch .env.development .env.test** to create environment files  
**6.** open .env.development and write _PGDATABASE=nc_news_  
**7.** open .env.test and write PGDATABASE=nc_news_test  
**8** enter **npm test** to run test file or **npm start** to run the server

## Version Information

- node: v14.17.6
- postgres: v14

## Additional Information
