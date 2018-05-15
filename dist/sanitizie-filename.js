'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function sanitizeFilename(name, graphQlType, isDashCased) {
  var cleanName;
  if (isDashCased) {
    cleanName = name.replace(/([A-Z])/g, function(g) {
      return '-' + g[0].toLowerCase();
    });
  } else {
    cleanName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  return cleanName === '' ? cleanName : '' + cleanName + (graphQlType ? '.' + graphQlType : '');
}
exports.sanitizeFilename = sanitizeFilename;
//# sourceMappingURL=sanitizie-filename.js.map
