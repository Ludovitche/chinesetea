"use strict";

/* 
In the client, the behaviour of a few fields will be harcoded, 
but for other fields, the client will create components dynamically using 
objects in xxxFields.js
*/
/*
objects format:
{
    dbFieldName = field name in DB query result (must be lower case)
    displayLabel = label to use in client ("hidden" if not displayed)
    displayOrder = display order for fields that are not harcoded in client 
                   (-1 if not displayed)
    type = data type, like 'integer' or 'date' - see also special types below
    data = external data source when needed (dropdown list, url)
    parent = allow to filter when needed
    mandatory = in edit mode, perform check when user submit 
                in read-only mode, hide/show item by default
}
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
      data: urlField,
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
