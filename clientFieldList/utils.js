"use strict";

/* 
In the client, the behaviour of a few fields will be harcoded, 
but for other fields, the client will create components dynamically using 
objects in xxxFields.js
*/

/* 
Note about special types:
- "PK" = primary key, not displayed
- "FK" = foreign key, creates a dropdown list for resource "data", 
  filtered by resource "parent"
- "currency": stored as an integer but displayed with 2 decimals
*/

const createComponents = row => item => ({
  ...item,
  value: row[item.dbFieldName]
});

const createComponentsWithUrl = row => item => {
  if (item.type === "url") {
    const urlField = row[item.data];
    return {
      ...item,
      data: row[urlField],
      value: row[item.dbFieldName]
    };
  } else {
    return {
      ...item,
      value: row[item.dbFieldName]
    };
  }
};

module.exports = {
  createComponents: createComponents,
  createComponentsWithUrl: createComponentsWithUrl
};
