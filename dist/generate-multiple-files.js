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
var graphql_codegen_core_1 = require('graphql-codegen-core');
var sanitizie_filename_1 = require('./sanitizie-filename');
var prepare_documents_only_1 = require('./prepare-documents-only');
var path = require('path');
var moment = require('moment');
var handlersMap = {
  type: handleType,
  inputType: handleInputType,
  union: handleUnion,
  enum: handleEnum,
  scalar: handleScalar,
  interface: handleInterface,
  operation: handleOperation,
  fragment: handleFragment,
  schema: handleSchema,
  documents: handleDocuments,
  all: handleAll
};
exports.ALLOWED_CUSTOM_TEMPLATE_EXT = ['template', 'handlebars', 'tmpl', 'gqlgen'];
function handleSchema(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleSchema] called');
  return [
    {
      filename: prefixAndPath + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({ config: extraConfig }, schemaContext))
    }
  ];
}
function handleAll(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleAll] called');
  return [
    {
      filename: prefixAndPath + '.' + (fileExtension || ''),
      content: compiledTemplate(
        __assign({}, schemaContext, {
          config: extraConfig,
          operations: documents.operations,
          fragments: documents.fragments,
          hasFragments: documents.hasFragments,
          hasOperations: documents.hasOperations
        })
      )
    }
  ];
}
function handleDocuments(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleDocuments] called');
  return [
    {
      filename: prefixAndPath + '.' + (fileExtension || ''),
      content: compiledTemplate({
        config: extraConfig,
        operations: documents.operations,
        fragments: documents.fragments,
        hasFragments: documents.hasFragments,
        hasOperations: documents.hasOperations
      })
    }
  ];
}
function handleType(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleType] called');
  return schemaContext.types.map(function(type) {
    return {
      filename: prefixAndPath + sanitizie_filename_1.sanitizeFilename(type.name, 'type') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, type, { config: extraConfig }))
    };
  });
}
function handleInputType(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleInputType] called');
  return schemaContext.inputTypes.map(function(type) {
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(type.name, 'input-type') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, type, { config: extraConfig }))
    };
  });
}
function handleUnion(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleUnion] called');
  return schemaContext.unions.map(function(union) {
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(union.name, 'union') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, union, { config: extraConfig }))
    };
  });
}
function handleEnum(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleEnum] called');
  return schemaContext.enums.map(function(en) {
    return {
      filename: prefixAndPath + sanitizie_filename_1.sanitizeFilename(en.name, 'enum') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, en, { config: extraConfig }))
    };
  });
}
function handleScalar(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleScalar] called');
  return schemaContext.scalars.map(function(scalar) {
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(scalar.name, 'scalar') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, scalar, { config: extraConfig }))
    };
  });
}
function handleInterface(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleInterface] called... ' + prefixAndPath);
  return schemaContext.interfaces.map(function(inf) {
    graphql_codegen_core_1.debugLog('[handleInterface] called... ' + inf);
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(inf.name, 'interface') + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, inf, { config: extraConfig }))
    };
  });
}
function handleOperation(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleOperation] called ' + prefixAndPath);
  return documents.operations.map(function(operation) {
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(operation.name, null, true) + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, operation, { config: extraConfig }))
    };
  });
}
function handleFragment(compiledTemplate, schemaContext, documents, extraConfig, fileExtension, prefixAndPath) {
  if (prefixAndPath === void 0) {
    prefixAndPath = '';
  }
  graphql_codegen_core_1.debugLog('[handleFragment] called');
  return documents.fragments.map(function(fragment) {
    return {
      filename:
        prefixAndPath + sanitizie_filename_1.sanitizeFilename(fragment.name, null, true) + '.' + (fileExtension || ''),
      content: compiledTemplate(__assign({}, fragment, { config: extraConfig }))
    };
  });
}
function parseTemplateName(templateName) {
  var splitted = path.basename(templateName).split('.');
  var hasPrefix = true;
  if (splitted.length === 3) {
    splitted.unshift('');
    hasPrefix = false;
  }
  if (splitted.length > 4 && templateName.includes('/')) {
    splitted = [splitted.slice(0, splitted.length - 3).join('.'), splitted[2], splitted[3], splitted[4]];
  }
  var templateExtension = splitted[3];
  if (templateExtension && exports.ALLOWED_CUSTOM_TEMPLATE_EXT.includes(templateExtension)) {
    var compilationContext = splitted[2];
    var prefix = splitted[0];
    var fileExtension = splitted[1];
    var handler = handlersMap[compilationContext];
    if (handler) {
      var pref = path.resolve(path.dirname(templateName) + '/', prefix);
      return {
        prefix: hasPrefix
          ? ['all', 'documents', 'schema'].includes(compilationContext) ? pref : pref + '.'
          : pref + '/',
        handler: handler,
        fileExtension: fileExtension
      };
    }
  }
  return null;
}
function generateMultipleFiles(templates, executionSettings, config, templateContext, documents) {
  graphql_codegen_core_1.debugLog('[generateMultipleFiles] Compiling multiple files...');
  var result = [];
  var schemaContext = !executionSettings.generateSchema
    ? prepare_documents_only_1.prepareSchemaForDocumentsOnly(templateContext)
    : templateContext;
  Object.keys(templates).forEach(function(templateName) {
    graphql_codegen_core_1.debugLog('[generateMultipleFiles] Checking template: ' + templateName);
    var templateFn = templates[templateName];
    if (handlersMap[templateName]) {
      graphql_codegen_core_1.debugLog('[generateMultipleFiles] Using simple handle of type: ' + templateName);
      var handler = handlersMap[templateName];
      result.push.apply(
        result,
        handler(
          templateFn,
          schemaContext,
          documents,
          __assign({}, config.config, { currentTime: moment().format() }),
          config.filesExtension
        )
      );
    } else {
      var parsedTemplateName = parseTemplateName(templateName);
      graphql_codegen_core_1.debugLog(
        '[generateMultipleFiles] Using custom template handlers, parsed template name result: ',
        parsedTemplateName
      );
      if (parsedTemplateName !== null) {
        result.push.apply(
          result,
          parsedTemplateName.handler(
            templateFn,
            schemaContext,
            documents,
            __assign({}, config.config, { currentTime: moment().format() }),
            parsedTemplateName.fileExtension,
            parsedTemplateName.prefix
          )
        );
      }
    }
  });
  return result;
}
exports.generateMultipleFiles = generateMultipleFiles;
//# sourceMappingURL=generate-multiple-files.js.map
