"use strict";

const currentYear = new Date().getFullYear();

const formFields = [
  {
    dbFieldName: "teaid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "name",
    displayLabel: "Name",
    displayOrder: 1,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "FK",
    data: "shops",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "typeid",
    displayLabel: "Type",
    displayOrder: 3,
    type: "FK",
    data: "types",
    parent: "",
    defaultValue: 1,
    mandatory: true
  },
  {
    dbFieldName: "subtypeid",
    displayLabel: "SubType",
    displayOrder: 4,
    type: "FK",
    data: "subtypes",
    parent: "types",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "countryid",
    displayLabel: "Country",
    displayOrder: 5,
    type: "FK",
    data: "countries",
    parent: "",
    defaultValue: 1,
    mandatory: true
  },
  {
    dbFieldName: "areaid",
    displayLabel: "Area",
    displayOrder: 6,
    type: "FK",
    data: "areas",
    parent: "countries",
    defaultValue: 1,
    mandatory: false
  },
  {
    dbFieldName: "formatid",
    displayLabel: "Format",
    displayOrder: 7,
    type: "FK",
    data: "formats",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "weightingrams",
    displayLabel: "Weight",
    displayOrder: 8,
    type: "weight",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "issample",
    displayLabel: "Sample",
    displayOrder: 9,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true
  },
  {
    dbFieldName: "lastpurchasepriceinusdcents",
    displayLabel: "Price in $",
    displayOrder: 10,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "comments",
    displayLabel: "Comments",
    displayOrder: 11,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "received",
    displayLabel: "Received",
    displayOrder: 12,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true
  },
  {
    dbFieldName: "gone",
    displayLabel: "Gone",
    displayOrder: 13,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true
  },
  {
    dbFieldName: "outofstock",
    displayLabel: "Out of stock",
    displayOrder: 14,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true
  },
  {
    dbFieldName: "currentroleid",
    displayLabel: "Current Role",
    displayOrder: 15,
    type: "FK",
    data: "roles",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "locationid",
    displayLabel: "Location",
    displayOrder: 16,
    type: "FK",
    data: "locations",
    parent: "",
    defaultValue: "",
    mandatory: true
  },
  {
    dbFieldName: "lastpurchaseyear",
    displayLabel: "Year purchased",
    displayOrder: 17,
    type: "integer",
    data: "",
    parent: "",
    defaultValue: currentYear,
    mandatory: true
  },
  {
    dbFieldName: "url",
    displayLabel: "Tea url",
    displayOrder: 18,
    type: "url",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "vendordescription",
    displayLabel: "Vendor description",
    displayOrder: 19,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false
  },
  {
    dbFieldName: "amountconsumedingrams",
    displayLabel: "integer",
    displayOrder: 20,
    type: "PK",
    data: "",
    parent: "",
    defaultValue: 0,
    mandatory: true
  }
];

const displayFields = [
  {
    dbFieldName: "teaid",
    displayLabel: "hidden",
    displayOrder: -1,
    type: "PK",
    data: ""
  },
  {
    dbFieldName: "name",
    displayLabel: "Name",
    displayOrder: 1,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "shopname",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "typename",
    displayLabel: "Type",
    displayOrder: 3,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "subtypename",
    displayLabel: "SubType",
    displayOrder: 4,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "countryname",
    displayLabel: "Country",
    displayOrder: 5,
    type: "text",
    data: "countries"
  },
  {
    dbFieldName: "areaname",
    displayLabel: "Area",
    displayOrder: 6,
    type: "text",
    data: "areas"
  },
  {
    dbFieldName: "formatname",
    displayLabel: "Format",
    displayOrder: 7,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "weightingrams",
    displayLabel: "Weight",
    displayOrder: 8,
    type: "weight",
    data: ""
  },
  {
    dbFieldName: "lastpurchasepriceinusdcents",
    displayLabel: "Price in $",
    displayOrder: 10,
    type: "currency",
    data: ""
  },
  {
    dbFieldName: "pricePerGram", //not a DB field, server should create it
    displayLabel: "Price / gram ($)",
    displayOrder: 11,
    type: "numerical",
    data: ""
  },
  {
    dbFieldName: "comments",
    displayLabel: "Comments",
    displayOrder: 11,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "issample",
    displayLabel: "Sample",
    displayOrder: 9,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "received",
    displayLabel: "Received",
    displayOrder: 12,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "gone",
    displayLabel: "Gone",
    displayOrder: 13,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "outofstock",
    displayLabel: "Out of stock",
    displayOrder: 14,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "currentrolename",
    displayLabel: "Current Role",
    displayOrder: 15,
    type: "FK",
    data: "roles"
  },
  {
    dbFieldName: "locationname",
    displayLabel: "Location",
    displayOrder: 16,
    type: "FK",
    data: "locations"
  },
  {
    dbFieldName: "lastpurchaseyear",
    displayLabel: "Year purchased",
    displayOrder: 17,
    type: "integer",
    data: ""
  },
  {
    dbFieldName: "url",
    displayLabel: "Tea url",
    displayOrder: 18,
    type: "url",
    data: ""
  },
  {
    dbFieldName: "vendordescription",
    displayLabel: "Vendor description",
    displayOrder: 19,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "amountconsumedingrams",
    displayLabel: "integer",
    displayOrder: 20,
    type: "PK",
    data: ""
  }
];

module.exports = {
  formFields: formFields,
  displayFields: displayFields
};
