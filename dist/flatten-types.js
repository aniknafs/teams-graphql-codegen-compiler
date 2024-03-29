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
var change_case_1 = require('change-case');
exports.handleNameDuplications = function(name, existing) {
  if (
    existing.find(function(model) {
      return model.modelType === name;
    })
  ) {
    return exports.handleNameDuplications('_' + name, existing);
  }
  return name;
};
function buildModelFromField(field, result) {
  var modelName = exports.handleNameDuplications(change_case_1.pascalCase(field.name), result);
  return {
    schemaBaseType: field.type,
    modelType: modelName,
    fields: field.fields,
    fragmentsSpread: field.fragmentsSpread,
    inlineFragments: field.inlineFragments,
    hasFields: field.hasFields,
    hasFragmentsSpread: field.hasFragmentsSpread,
    hasInlineFragments: field.hasInlineFragments
  };
}
function buildModelFromInlineFragment(fragment, result) {
  var modelName = exports.handleNameDuplications(change_case_1.pascalCase(fragment.onType), result);
  return {
    schemaBaseType: fragment.onType,
    modelType: modelName,
    fields: fragment.fields,
    fragmentsSpread: fragment.fragmentsSpread,
    inlineFragments: fragment.inlineFragments,
    hasFields: fragment.hasFields,
    hasFragmentsSpread: fragment.hasFragmentsSpread,
    hasInlineFragments: fragment.hasInlineFragments,
    isInlineFragment: fragment.isInlineFragment
  };
}
function flattenSelectionSet(selectionSet, result) {
  if (result === void 0) {
    result = [];
  }
  selectionSet.forEach(function(item) {
    if (graphql_codegen_core_1.isFieldNode(item)) {
      if (item.selectionSet.length > 0) {
        var model = buildModelFromField(item, result);
        item.type = model.modelType;
        result.push(model);
        flattenSelectionSet(item.selectionSet, result);
      }
    } else if (graphql_codegen_core_1.isInlineFragmentNode(item)) {
      var model = buildModelFromInlineFragment(item, result);
      item.onType = model.modelType;
      result.push(model);
      flattenSelectionSet(item.selectionSet, result);
    }
  });
  return result;
}
exports.flattenSelectionSet = flattenSelectionSet;
function flattenTypes(document) {
  return {
    operations: document.operations.map(function(operation) {
      return __assign({ isFlatten: true }, operation, { innerModels: flattenSelectionSet(operation.selectionSet) });
    }),
    fragments: document.fragments.map(function(fragment) {
      return __assign({ isFlatten: true }, fragment, { innerModels: flattenSelectionSet(fragment.selectionSet) });
    }),
    hasOperations: document.hasOperations,
    hasFragments: document.hasFragments
  };
}
exports.flattenTypes = flattenTypes;
//# sourceMappingURL=flatten-types.js.map
