"use strict";
/*
Summary of currently implemented filters
(key = DB field, value = filter code in URI)

- ShopId : shoid
- TypeId : typid
- SubType : subid
- Gone : gone
- OutOfStock : out
- IsSample : samp
- FormatId : forid
- CurentRoleId : rolid
- LastPurchasePriceInUSD >= filter value : pricebt 
- LastPurchasePriceInUSD <= filter value : pricest
- LastPurchasePriceInUSD / WeightInGrams >= filter value : grampricebt
- LastPurchasePriceInUSD / WeightInGrams <= filter value : grampricest

*/

const formFields = [
  {
    filterName: "shoid",
    displayLabel: "Shop",
    displayOrder: 1,
    type: "FK",
    data: "shops",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "typid",
    displayLabel: "Type",
    displayOrder: 2,
    type: "FK",
    data: "types",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "subid",
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
    filterName: "out",
    displayLabel: "Out of stock",
    displayOrder: 5,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "samp",
    displayLabel: "Sample",
    displayOrder: 6,
    type: "boolean",
    data: "",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "forid",
    displayLabel: "Format",
    displayOrder: 7,
    type: "FK",
    data: "formats",
    parent: "",
    defaultValue: ""
  },
  {
    filterName: "rolid",
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
  formFields: formFields
};
