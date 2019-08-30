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
- "url": to display the fuild, we need to combine 2 entries from server: 
  one with the text of the url and one with the url itself
*/

const formFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK",
    data: "shops",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "orderdate",
    displayLabel: "Date",
    displayOrder: 2,
    type: "date",
    data: "",
    parent: "",
    defaultValue: "today",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinbaht",
    displayLabel: "Shipping cost in ฿",
    displayOrder: 7,
    type: "integer",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  }
];

const displayFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: ""
  },
  {
    dbFieldName: "orderdate",
    displayLabel: "Date",
    displayOrder: 1,
    type: "date",
    data: ""
  },
  {
    dbFieldName: "shopname",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "url",
    data: "shopurl"
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: ""
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: ""
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: ""
  }
];

const orderTeaFormFields = [
  {
    dbFieldName: "orderteaid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "FK",
    data: "order",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "teaid",
    displayLabel: "Tea",
    displayOrder: 1,
    type: "FK",
    data: "tea",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "amountingrams",
    displayLabel: "hidden",
    displayOrder: 2,
    type: "weight",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  }
];

module.exports = {
  formFields: formFields,
  displayFields: displayFields,
  orderTeaFormFields: orderTeaFormFields
};
