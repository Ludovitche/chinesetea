"use strict";

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

module.exports = {
  formFields: formFields,
  displayFields: displayFields
};
