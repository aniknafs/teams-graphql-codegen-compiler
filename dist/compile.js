'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var graphql_codegen_core_1 = require('graphql-codegen-core');
var graphql_codegen_generators_1 = require('graphql-codegen-generators');
var handlebars_1 = require('handlebars');
var handlebars_extensions_1 = require('./handlebars-extensions');
var flatten_types_1 = require('./flatten-types');
var generate_multiple_files_1 = require('./generate-multiple-files');
var generate_single_file_1 = require('./generate-single-file');
var clean_template_1 = require('./clean-template');
exports.DEFAULT_SETTINGS = {
  generateSchema: true,
  generateDocuments: true
};
function compileTemplate(config, templateContext, documents, settings) {
  if (documents === void 0) {
    documents = [];
  }
  if (settings === void 0) {
    settings = exports.DEFAULT_SETTINGS;
  }
  if (!config) {
    throw new Error('compileTemplate requires a valid GeneratorConfig object!');
  }
  graphql_codegen_core_1.debugLog(
    '[compileTemplate] starting to compile template with input type = ' + config.inputType
  );
  graphql_codegen_core_1.debugLog('[compileTemplate] settings = ', settings);
  handlebars_extensions_1.initHelpers(config, templateContext);
  var executionSettings = Object.assign(exports.DEFAULT_SETTINGS, settings);
  var templates = config.templates;
  Object.keys(templates).forEach(function(templateName) {
    graphql_codegen_core_1.debugLog('[compileTemplate] register partial template ' + templateName);
    handlebars_1.registerPartial(templateName, templates[templateName].trim());
  });
  var mergedDocuments;
  if (!executionSettings.generateDocuments) {
    graphql_codegen_core_1.debugLog('[compileTemplate] generateDocuments is false, ignoring documents...');
    mergedDocuments = {
      fragments: [],
      operations: [],
      hasFragments: false,
      hasOperations: false
    };
  } else {
    mergedDocuments = documents.reduce(
      function(previousValue, item) {
        var opArr = previousValue.operations.concat(item.operations);
        var frArr = previousValue.fragments.concat(item.fragments);
        return {
          operations: opArr,
          fragments: frArr,
          hasFragments: frArr.length > 0,
          hasOperations: opArr.length > 0
        };
      },
      { hasFragments: false, hasOperations: false, operations: [], fragments: [] }
    );
    graphql_codegen_core_1.debugLog(
      '[compileTemplate] all documents merged into single document, total of ' +
        mergedDocuments.operations.length +
        ' operations and ' +
        mergedDocuments.fragments.length +
        ' fragments'
    );
    if (config.flattenTypes) {
      graphql_codegen_core_1.debugLog(
        '[compileTemplate] flattenTypes is true, flattening all selection sets from all documents...'
      );
      mergedDocuments = flatten_types_1.flattenTypes(mergedDocuments);
    }
  }
  if (config.inputType === graphql_codegen_generators_1.EInputType.SINGLE_FILE) {
    if (!templates['index']) {
      throw new Error("Template 'index' is required when using inputType = SINGLE_FILE!");
    }
    if (!config.outFile) {
      throw new Error('Config outFile is required when using inputType = SINGLE_FILE!');
    }
    graphql_codegen_core_1.debugLog('[compileTemplate] Executing generateSingleFile...');
    return generate_single_file_1.generateSingleFile(
      handlebars_1.compile(clean_template_1.cleanTemplateComments(templates['index'])),
      executionSettings,
      config,
      templateContext,
      mergedDocuments
    );
  } else if (
    config.inputType === graphql_codegen_generators_1.EInputType.MULTIPLE_FILES ||
    config.inputType === graphql_codegen_generators_1.EInputType.PROJECT
  ) {
    if (config.inputType === graphql_codegen_generators_1.EInputType.MULTIPLE_FILES) {
      if (!config.filesExtension) {
        throw new Error('Config filesExtension is required when using inputType = MULTIPLE_FILES!');
      }
    }
    graphql_codegen_core_1.debugLog('[compileTemplate] Executing generateMultipleFiles...');
    var compiledTemplates = Object.keys(templates)
      .map(function(templateName) {
        graphql_codegen_core_1.debugLog('[compileTemplate] Compiling template: ' + templateName + '...');
        var compiledTemplate = handlebars_1.compile(
          clean_template_1.cleanTemplateComments(templates[templateName], templateName)
        );
        return {
          key: templateName,
          value: compiledTemplate
        };
      })
      .reduce(function(prev, item) {
        prev[item.key] = item.value;
        return prev;
      }, {});
    graphql_codegen_core_1.debugLog('[compileTemplate] Templates names: ', Object.keys(compiledTemplates));
    return generate_multiple_files_1.generateMultipleFiles(
      compiledTemplates,
      executionSettings,
      config,
      templateContext,
      mergedDocuments
    );
  } else {
    throw new Error('Invalid inputType specified: ' + config.inputType + '!');
  }
}
exports.compileTemplate = compileTemplate;
//# sourceMappingURL=compile.js.map
