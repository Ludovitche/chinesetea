"use strict";

const formFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK",
    data: "shops",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "date",
    displayLabel: "Date",
    displayOrder: 2,
    type: "date",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinbaht",
    displayLabel: "Shipping cost in ฿",
    displayOrder: 7,
    type: "integer",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  }
];

const listFields = [
  {
    dbFieldName: "orderid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "orderdate",
    displayLabel: "Date",
    displayOrder: 1,
    type: "date",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "shopname",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "url",
    data: "shopurl",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "totalamountinbaht",
    displayLabel: "Amount in ฿",
    displayOrder: 5,
    type: "integer",
    data: "",
    parent: "",
    mandatory: true
  },
  {
    dbFieldName: "ordernumber",
    displayLabel: "Order number",
    displayOrder: 3,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "trackingnumber",
    displayLabel: "Tracking number",
    displayOrder: 4,
    type: "text",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "totalamountinusdcents",
    displayLabel: "Amount in $",
    displayOrder: 6,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  },
  {
    dbFieldName: "shippingcostinusdcents",
    displayLabel: "Shipping cost in $",
    displayOrder: 8,
    type: "currency",
    data: "",
    parent: "",
    mandatory: false
  }
];

module.exports = {
  formFields: formFields,
  listFields: listFields
};
