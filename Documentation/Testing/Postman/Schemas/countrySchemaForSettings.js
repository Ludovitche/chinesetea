{
    "type": "array",
    "title": "Schema - Countries",
    "additionalProperties": false,
    "items":{
        "type": "object",
        "required": [
            "countryid",
            "name",
            "candelete",
        ],
    	"properties": {
    		"countryid": {
    			"type": "number",
    			"minimum": 1
    		},
    		"name": {
    			"type": "string",
    			"minLength": 1
    		},
    		"candelete": {
    			"type": "boolean"
    		}
    	}
    }
}