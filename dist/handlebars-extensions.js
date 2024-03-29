'use strict';
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
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
var handlebars_1 = require('handlebars');
var change_case_1 = require('change-case');
var common_tags_1 = require('common-tags');
var field_type_to_string_1 = require('./field-type-to-string');
var sanitizie_filename_1 = require('./sanitizie-filename');
var flatten_types_1 = require('./flatten-types');
exports.initHelpers = function(config, schemaContext) {
  var customHelpers = config.customHelpers || {};
  Object.keys(customHelpers).forEach(function(helperName) {
    handlebars_1.registerHelper(helperName, customHelpers[helperName]);
  });
  handlebars_1.registerHelper('toPrimitive', function(type) {
    return config.primitives[type] || type || '';
  });
  handlebars_1.registerHelper('isPrimitive', function(type) {
    return config.primitives[type] ? true : false;
  });
  handlebars_1.registerHelper('stringify', function(obj) {
    return new handlebars_1.SafeString(JSON.stringify(obj));
  });
  handlebars_1.registerHelper('times', function(n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });
  handlebars_1.registerHelper('ifDirective', function(context, directiveName, options) {
    if (context && context['directives'] && directiveName && typeof directiveName === 'string') {
      var directives = context['directives'];
      var directiveValue = directives[directiveName];
      if (directiveValue) {
        return options && options.fn ? options.fn(__assign({}, directiveValue || {}, context)) : '';
      } else {
        return options && options.inverse ? options.inverse(context) : '';
      }
    }
    return options && options.inverse ? options.inverse(context) : '';
  });
  handlebars_1.registerHelper('unlessDirective', function(context, directiveName, options) {
    if (context && context['directives'] && directiveName && typeof directiveName === 'string') {
      var directives = context['directives'];
      var directiveValue = directives[directiveName];
      if (!directiveValue) {
        return options && options.fn ? options.fn(__assign({}, directiveValue || {}, context)) : '';
      } else {
        return options && options.inverse ? options.inverse(context) : '';
      }
    }
    return options && options.inverse ? options.inverse(context) : '';
  });
  handlebars_1.registerHelper('toComment', function(str) {
    if (!str || str === '') {
      return '';
    }
    return (
      '/* ' +
      common_tags_1.oneLineTrim(
        templateObject_1 || (templateObject_1 = __makeTemplateObject(['', ''], ['', ''])),
        str || ''
      ) +
      ' */'
    );
  });
  handlebars_1.registerHelper('eachImport', function(context, options) {
    var ret = '';
    var imports = [];
    // Interface, input types, types
    if (context.fields && !context.onType && !context.operationType) {
      context.fields.forEach(function(field) {
        if (!config.primitives[field.type]) {
          if (field.type === context.name) {
            return;
          }
          var fieldType = field_type_to_string_1.getFieldTypeAsString(field);
          var file = sanitizie_filename_1.sanitizeFilename(field.type, null, true);
          if (
            !imports.find(function(t) {
              return t.name === field.type;
            })
          ) {
            imports.push({ name: field.type, file: file, type: fieldType });
          }
        }
        // Fields arguments
        if (field.arguments && field.hasArguments) {
          field.arguments.forEach(function(arg) {
            if (!config.primitives[arg.type]) {
              var fieldType = field_type_to_string_1.getFieldTypeAsString(arg);
              var file = sanitizie_filename_1.sanitizeFilename(arg.type, null, true);
              if (
                !imports.find(function(t) {
                  return t.name === arg.type;
                })
              ) {
                imports.push({ name: arg.type, file: file, type: fieldType });
              }
            }
          });
        }
      });
    }
    // Types that uses interfaces
    if (context.interfaces) {
      context.interfaces.forEach(function(infName) {
        var file = sanitizie_filename_1.sanitizeFilename(infName, null, true);
        if (
          !imports.find(function(t) {
            return t.name === infName;
          })
        ) {
          imports.push({ name: infName, file: file, type: 'interface' });
        }
      });
    }
    // Unions
    if (context.possibleTypes) {
      context.possibleTypes.forEach(function(possibleType) {
        var file = sanitizie_filename_1.sanitizeFilename(possibleType, null, true);
        if (
          !imports.find(function(t) {
            return t.name === possibleType;
          })
        ) {
          imports.push({ name: possibleType, file: file, type: 'type' });
        }
      });
    }
    if (context.variables) {
      context.variables.forEach(function(variable) {
        if (!config.primitives[variable.type]) {
          var fieldType = field_type_to_string_1.getFieldTypeAsString(variable);
          var file = sanitizie_filename_1.sanitizeFilename(variable.type, null, true);
          if (
            !imports.find(function(t) {
              return t.name === variable.type;
            })
          ) {
            imports.push({ name: variable.type, file: file, type: fieldType });
          }
        }
      });
    }
    // Operations and Fragments
    if (context.selectionSet) {
      var flattenDocument = context.isFlatten ? context : flatten_types_1.flattenSelectionSet(context);
      flattenDocument.innerModels.forEach(function(innerModel) {
        if (innerModel.fragmentsSpread && innerModel.fragmentsSpread.length > 0) {
          innerModel.fragmentsSpread.forEach(function(fragmentSpread) {
            var file = sanitizie_filename_1.sanitizeFilename(fragmentSpread.fragmentName, null, true);
            if (
              !imports.find(function(t) {
                return t.name === fragmentSpread.fragmentName;
              })
            ) {
              imports.push({ name: fragmentSpread.fragmentName, file: file, type: 'fragment' });
            }
          });
        }
        innerModel.fields.forEach(function(field) {
          console.log('field: ', field, field.type);
          if (!config.primitives[field.type]) {
            var type = null;
            if (field.isEnum) {
              type = 'enum';
            } else if (field.isInputType) {
              type = 'input-type';
            } else if (field.isScalar) {
              type = 'scalar';
            }
            if (type !== null) {
              var file = sanitizie_filename_1.sanitizeFilename(field.type, null, true);
              if (
                !imports.find(function(t) {
                  return t.name === field.type;
                })
              ) {
                imports.push({ name: field.type, file: file, type: type });
              }
            }
          }
        });
      });
    }
    for (var i = 0, j = imports.length; i < j; i++) {
      ret =
        ret +
        options.fn(imports[i], {
          data: {
            withExtension: imports[i] + '.' + config.filesExtension
          }
        });
    }
    return ret;
  });
  handlebars_1.registerHelper('toLowerCase', function(str) {
    return (str || '').toLowerCase();
  });
  handlebars_1.registerHelper('toUpperCase', function(str) {
    return (str || '').toUpperCase();
  });
  handlebars_1.registerHelper('toPascalCase', function(str) {
    return change_case_1.pascalCase(str || '');
  });
  handlebars_1.registerHelper('toSnakeCase', function(str) {
    return change_case_1.snakeCase(str || '');
  });
  handlebars_1.registerHelper('toTitleCase', function(str) {
    return change_case_1.titleCase(str || '');
  });
  handlebars_1.registerHelper('toCamelCase', function(str) {
    return change_case_1.camelCase(str || '');
  });
  handlebars_1.registerHelper('multilineString', function(str) {
    if (!str) {
      return '';
    }
    var lines = str.split('\n');
    return lines
      .map(function(line, index) {
        var isLastLine = index !== lines.length - 1;
        return '"' + line.replace(/"/g, '\\"') + '"' + (isLastLine ? ' +' : '');
      })
      .join('\r\n');
  });
  handlebars_1.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for (var i = from; i < to; i += incr) {
      accum += block.fn(i);
    }
    return accum;
  });
  handlebars_1.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  handlebars_1.registerHelper('withGql', function(type, name, options) {
    if (!type || !name) {
      throw new Error('Both type and name are required for withGql helper!');
    }
    type = change_case_1.camelCase(type);
    var sourceArr = schemaContext[type] || schemaContext[type + 's'];
    if (!sourceArr) {
      throw new Error('Type ' + type + ' is not a valid SchemaTemplateContext field!');
    }
    var item = sourceArr.find(function(item) {
      return item.name === name;
    });
    if (!item) {
      throw new Error('GraphQL object with name ' + name + ' and type ' + type + ' cannot be found!');
    }
    return options.fn(item);
  });
};
var templateObject_1;
//# sourceMappingURL=handlebars-extensions.js.map
