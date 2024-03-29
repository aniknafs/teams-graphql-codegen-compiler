'use strict';
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var prepare_documents_only_1 = require('./prepare-documents-only');
var graphql_codegen_core_1 = require('graphql-codegen-core');
var moment = require('moment');
function generateSingleFile(compiledIndexTemplate, executionSettings, config, templateContext, documents) {
  graphql_codegen_core_1.debugLog('[generateSingleFile] Compiling single file to: ' + config.outFile);
  return [
    {
      filename: config.outFile,
      content: compiledIndexTemplate(
        __assign(
          { config: config.config, currentTime: moment().format() },
          !executionSettings.generateSchema
            ? prepare_documents_only_1.prepareSchemaForDocumentsOnly(templateContext)
            : templateContext,
          {
            operations: documents.operations,
            fragments: documents.fragments,
            hasFragments: documents.hasFragments,
            hasOperations: documents.hasOperations
          }
        )
      )
    }
  ];
}
exports.generateSingleFile = generateSingleFile;
//# sourceMappingURL=generate-single-file.js.map
