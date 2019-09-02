{
    "type": "object",
    "title": "Schema - Tea options",
    "additionalProperties": false,
    "required": [
        "shops",
        "types",
        "subtypes",
        "countries",
        "areas",
        "formats",
        "locations",
		"roles"
    ],
    "properties": {
        "shops": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/shops" }
        },
        "types": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/types" }
        },
        "subtypes": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/subtypes" }
        },
        "countries": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/countries" }
        },
        "areas": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/areas" }
        },
        "formats": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/formats" }
        },
        "locations": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/locations" }
        },
        "roles": {
            "type": "array",
            "minItems": 1,
			"items": { "$ref": "#/definitions/roles" }
        }
    },
	"definitions": {
		"shops": {
			"type": "object",
			"required": [ "shopid", "name" ],
			"properties": {
				"shopid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"types": {
			"type": "object",
			"required": [ "typeid", "name" ],
			"properties": {
				"typeid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"subtypes": {
			"type": "object",
			"required": [ "typeid", "subtypeid", "name" ],
			"properties": {
				"typeid": {
					"type": "number",
					"minimum": 1
				},
				"subtypeid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"countries": {
			"type": "object",
			"required": [ "countryid", "name" ],
			"properties": {
				"countryid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"areas": {
			"type": "object",
			"required": [ "countryid", "areaid", "name" ],
			"properties": {
				"countryid": {
					"type": "number",
					"minimum": 1
				},
				"areaid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"formats": {
			"type": "object",
			"required": [ "formatid", "name" ],
			"properties": {
				"formatid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"locations": {
			"type": "object",
			"required": [ "locationid", "name" ],
			"properties": {
				"locationid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
		"roles": {
			"type": "object",
			"required": [ "currentroleid", "name" ],
			"properties": {
				"currentroleid": {
					"type": "number",
					"minimum": 1
				},
				"name": {
					"type": "string",
					"minLength": 1
				}
			}
		},
    }
}