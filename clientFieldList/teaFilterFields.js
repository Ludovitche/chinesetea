"use strict";

// See orderFields.js for explanations

/*
Meaning of custom filters:
- LastPurchasePriceInUSD >= filter value : pricebt 
- LastPurchasePriceInUSD <= filter value : pricest
- LastPurchasePriceInUSD / WeightInGrams >= filter value : grampricebt
- LastPurchasePriceInUSD / WeightInGrams <= filter value : grampricest
*/

const queryParamaters = [
  "shopid",
  "typeid",
  "subtypeid",
  "gone",
  "outofstock",
  "issample",
  "formatid",
  "currentroleid",
  "pricebt",
  "pricest",
  "grampricebt",
  "grampricest"
];

const formFields = [
  {
    filterName: "shopid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK",
    data: "shops",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "typeid",
    displayLabel: "Type",
    displayOrder: 2,
    type: "FK",
    data: "types",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "subtypeid",
    displayLabel: "SubType",
    displayOrder: 3,
    type: "FK",
    data: "subtypes",
    parent: "types",
    defaultValue: ""
  },
  {
    filterName: "gone",
    displayLabel: "Gone",
    displayOrder: 4,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "outofstock",
    displayLabel: "Out of stock",
    displayOrder: 5,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "issample",
    displayLabel: "Sample",
    displayOrder: 6,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "formatid",
    displayLabel: "Format",
    displayOrder: 7,
    type: "FK",
    data: "formats",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "currentroleid",
    displayLabel: "Current Role",
    displayOrder: 8,
    type: "FK",
    data: "roles",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "pricebt",
    displayLabel: "Min price ($)",
    displayOrder: 9,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "pricest",
    displayLabel: "Max price ($)",
    displayOrder: 10,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "grampricebt",
    displayLabel: "Min price / gram ($)",
    displayOrder: 11,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "grampricest",
    displayLabel: "Max price / gram ($)",
    displayOrder: 12,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: ""
  }
];

module.exports = {
  formFields: formFields,
  queryParamaters: queryParamaters
};
