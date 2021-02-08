module.exports = [
  "api/index",
  {
    "type": "category",
    "label": "Classes",
    "items": [
      "api/classes/configerror",
      "api/classes/confignotfounderror",
      "api/classes/configsyntaxerror",
      "api/classes/configunknownloadererror",
      "api/classes/registry"
    ]
  },
  {
    "type": "category",
    "label": "Type aliases",
    "items": [
      "api/types/configgetstrategyfilenametype",
      "api/types/configgetstrategyfilepathtype",
      "api/types/configgetstrategytype",
      "api/types/configmergestrategytype",
      "api/types/loadererrorfunctype",
      "api/types/loadertype"
    ]
  },
  {
    "type": "category",
    "label": "Variables",
    "items": [
      "api/variables/importloader",
      "api/variables/registry"
    ]
  },
  {
    "type": "category",
    "label": "Functions",
    "items": [
      "api/functions/defaultconfiggetstrategy",
      "api/functions/getconfig",
      "api/functions/mergeconfig"
    ]
  }
];