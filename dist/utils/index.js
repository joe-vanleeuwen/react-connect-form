(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./promises", "./values", "./validators", "react-fast-compare", "./polyfills"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./promises"), require("./values"), require("./validators"), require("react-fast-compare"), require("./polyfills"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promises, global.values, global.validators, global.reactFastCompare, global.polyfills);
    global.index = mod.exports;
  }
})(this, function (exports, _promises, _values, _validators2, _reactFastCompare) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEqual = exports.getValidators = exports.getDecrementValue = exports.getInitialValue = exports.getNextValue = exports.getEventValue = exports.valueIsEvent = exports.cancelPromise = exports.reflectPromise = exports.validators = undefined;
  Object.defineProperty(exports, "reflectPromise", {
    enumerable: true,
    get: function () {
      return _promises.reflectPromise;
    }
  });
  Object.defineProperty(exports, "cancelPromise", {
    enumerable: true,
    get: function () {
      return _promises.cancelPromise;
    }
  });
  Object.defineProperty(exports, "valueIsEvent", {
    enumerable: true,
    get: function () {
      return _values.valueIsEvent;
    }
  });
  Object.defineProperty(exports, "getEventValue", {
    enumerable: true,
    get: function () {
      return _values.getEventValue;
    }
  });
  Object.defineProperty(exports, "getNextValue", {
    enumerable: true,
    get: function () {
      return _values.getNextValue;
    }
  });
  Object.defineProperty(exports, "getInitialValue", {
    enumerable: true,
    get: function () {
      return _values.getInitialValue;
    }
  });
  Object.defineProperty(exports, "getDecrementValue", {
    enumerable: true,
    get: function () {
      return _values.getDecrementValue;
    }
  });
  Object.defineProperty(exports, "getValidators", {
    enumerable: true,
    get: function () {
      return _values.getValidators;
    }
  });

  var _validators = _interopRequireWildcard(_validators2);

  var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  exports.validators = _validators;
  exports.isEqual = _reactFastCompare2.default;
});