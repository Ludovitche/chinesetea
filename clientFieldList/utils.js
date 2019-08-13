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
    type = data type, like 'integer' or 'date' - see also special types below
    data = external data source (edit mode: dropdown list, display mode: url)
    parent = edit mode only, allow to filter when needed
    default value = edit mode only, prefill empty values
    mandatory = edit mode only, perform check when user submit 
    readonly = edit mode only, not modifiable
}
*/
/* 
Special behaviour to implement on client side for specific types:
- "PK" = primary key, not displayed
- "FK" = foreign key, creates a dropdown list for resource "data", 
  filtered by resource "parent" (optional)
- "currency": stored as an integer but displayed with 2 decimals
  (for baht, we'll use integer as baht cents don't matter much)
- "weight": if > 1000, convert to kilograms (and display unit accordingly)
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
