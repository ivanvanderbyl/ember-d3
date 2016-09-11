/* jshint node: true */
'use strict';
module.exports = function exclusionFilter(needles) {
  return function (needle) {
    if (needles.length === 0) { return true; }

    return needles.indexOf(needle) === -1;
  };
};
