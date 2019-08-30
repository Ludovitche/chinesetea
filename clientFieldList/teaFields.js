"use strict";

// See orderFields.js for explanations

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
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "name",
    displayLabel: "Name",
    displayOrder: 1,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "shopid",
    displayLabel: "Shop",
    displayOrder: 2,
    type: "FK",
    data: "shops",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "typeid",
    displayLabel: "Type",
    displayOrder: 3,
    type: "FK",
    data: "types",
    parent: "",
    defaultValue: 1,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "subtypeid",
    displayLabel: "SubType",
    displayOrder: 4,
    type: "FK",
    data: "subtypes",
    parent: "types",
    defaultValue: "",
    mandatory: false,
    readonly: false
  },
  {
    dbFieldName: "countryid",
    displayLabel: "Country",
    displayOrder: 5,
    type: "FK",
    data: "countries",
    parent: "",
    defaultValue: 1,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "areaid",
    displayLabel: "Area",
    displayOrder: 6,
    type: "FK",
    data: "areas",
    parent: "countries",
    defaultValue: 1,
    mandatory: false,
    readonly: false
  },
  {
    dbFieldName: "formatid",
    displayLabel: "Format",
    displayOrder: 7,
    type: "FK",
    data: "formats",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "weightingrams",
    displayLabel: "Usual weight",
    displayOrder: 8,
    type: "weight",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "lastpurchasepriceinusdcents",
    displayLabel: "Usual price ($)",
    displayOrder: 9,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "issample",
    displayLabel: "Sample",
    displayOrder: 10,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "amountingrams", //from current OrderTea
    displayLabel: "Weight (this order)",
    displayOrder: 11,
    type: "currency",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "comments",
    displayLabel: "Comments",
    displayOrder: 12,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false,
    readonly: false
  },
  {
    dbFieldName: "received",
    displayLabel: "Received",
    displayOrder: 13,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "gone",
    displayLabel: "Gone",
    displayOrder: 14,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "outofstock",
    displayLabel: "Out of stock",
    displayOrder: 15,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: false,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "currentroleid",
    displayLabel: "Current Role",
    displayOrder: 16,
    type: "FK",
    data: "roles",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "locationid",
    displayLabel: "Location",
    displayOrder: 17,
    type: "FK",
    data: "locations",
    parent: "",
    defaultValue: "",
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "lastpurchaseyear",
    displayLabel: "Year purchased",
    displayOrder: 18,
    type: "integer",
    data: "",
    parent: "",
    defaultValue: currentYear,
    mandatory: true,
    readonly: false
  },
  {
    dbFieldName: "url",
    displayLabel: "Tea url",
    displayOrder: 19,
    type: "url",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false,
    readonly: false
  },
  {
    dbFieldName: "vendordescription",
    displayLabel: "Vendor description",
    displayOrder: 20,
    type: "text",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false,
    readonly: false
  },
  {
    dbFieldName: "totalweightboughtingrams", //calculated from all OrderTea
    displayLabel: "Total bought",
    displayOrder: 21,
    type: "weight",
    data: "",
    parent: "",
    defaultValue: "",
    mandatory: false,
    readonly: true
  },
  {
    dbFieldName: "amountconsumedingrams",
    displayLabel: "Total consumed",
    displayOrder: 22,
    type: "weight",
    data: "",
    parent: "",
    defaultValue: 0,
    mandatory: true,
    readonly: false
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
    displayLabel: "Usual weight",
    displayOrder: 8,
    type: "weight",
    data: ""
  },
  {
    dbFieldName: "lastpurchasepriceinusdcents",
    displayLabel: "Usual price ($)",
    displayOrder: 9,
    type: "currency",
    data: ""
  },
  {
    dbFieldName: "pricepergram", //calculated
    displayLabel: "Price / gram ($)",
    displayOrder: 10,
    type: "currency",
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
    displayOrder: 12,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "received",
    displayLabel: "Received",
    displayOrder: 13,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "gone",
    displayLabel: "Gone",
    displayOrder: 14,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "outofstock",
    displayLabel: "Out of stock",
    displayOrder: 15,
    type: "boolean",
    data: ""
  },
  {
    dbFieldName: "currentrolename",
    displayLabel: "Current Role",
    displayOrder: 16,
    type: "FK",
    data: "roles"
  },
  {
    dbFieldName: "locationname",
    displayLabel: "Location",
    displayOrder: 17,
    type: "FK",
    data: "locations"
  },
  {
    dbFieldName: "lastpurchaseyear",
    displayLabel: "Year purchased",
    displayOrder: 18,
    type: "integer",
    data: ""
  },
  {
    dbFieldName: "url",
    displayLabel: "Tea url",
    displayOrder: 19,
    type: "url",
    data: ""
  },
  {
    dbFieldName: "vendordescription",
    displayLabel: "Vendor description",
    displayOrder: 20,
    type: "text",
    data: ""
  },
  {
    dbFieldName: "totalweightboughtingrams", //calculated from all OrderTea
    displayLabel: "Total bought",
    displayOrder: 21,
    type: "weight",
    data: ""
  },
  {
    dbFieldName: "amountconsumedingrams",
    displayLabel: "Total consumed",
    displayOrder: 22,
    type: "weight",
    data: ""
  }
];

module.exports = {
  formFields: formFields,
  displayFields: displayFields
};
