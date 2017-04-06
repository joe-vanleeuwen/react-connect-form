(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', '../utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('../utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.utils);
    global.Form = mod.exports;
  }
})(this, function (exports, _react, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Form);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        fields: {},
        submitting: false,
        submitFailure: null,
        submitSuccess: null
      }, _this.validators = {}, _this.initialValues = {}, _this.cancelOnUnmount = function (promise) {
        return (0, _utils.cancelPromise)(promise, _this._isUnmounted);
      }, _this.registerField = function (name, fieldProps) {
        // TODO: add required?
        _this.validators[name] = (0, _utils.getValidators)(fieldProps);
        _this.setState(function (prevState) {
          var prevField = prevState.fields[name];
          // recalculate initial values
          if (_this.props.initialValues[name]) {
            _this.initialValues[name] = _this.props.initialValues[name];
          } else {
            _this.initialValues[name] = (0, _utils.getInitialValue)(prevField, fieldProps);
          }
          // field namespace is already registered.
          if (prevField) {
            return {
              fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevField, {
                // increment field count.
                count: prevField.count + 1,
                value: _this.initialValues[name]
              })))
            };
            // create new field namespace.
          } else {
            return {
              fields: _extends({}, prevState.fields, _defineProperty({}, name, {
                type: fieldProps.type,
                count: 1,
                errors: [],
                touched: false,
                focused: false,
                pristine: true,
                validated: true,
                validating: false,
                value: _this.initialValues[name]
              }))
            };
          }
        });
      }, _this.unregisterField = function (name, fieldProps) {
        _this.setState(function (prevState) {
          var prevField = prevState.fields[name];
          // multiple fields registered to the same name.
          if (prevField.count > 1) {
            return {
              fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevField, {
                // decrement field count.
                count: prevField.count - 1,
                value: (0, _utils.getDecrementValue)(prevField, fieldProps)
                // TODO: run validation again?
              })))
            };
            // only one field registered to name.
          } else {
            delete _this.validators[name];
            delete _this.initialValues[name];
            return {
              fields: Object.keys(prevState.fields).reduce(function (fields, key) {
                if (key !== name) {
                  fields[key] = prevState.fields[key];
                }
                return fields;
              }, {})
            };
          }
        });
      }, _this.resetField = function (name, fieldProps) {
        _this.setState(function (prevState) {
          var prevField = prevState.fields[name];
          if (_this.props.initialValues[name]) {
            _this.initialValues[name] = _this.props.initialValues[name];
          } else if (fieldProps) {
            _this.initialValues[name] = (0, _utils.getInitialValue)(prevField, fieldProps);
          }
          return {
            fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevField, {
              touched: false,
              pristine: true,
              validated: true,
              validating: false,
              value: _this.initialValues[name]
            })))
          };
        });
      }, _this.changeField = function (name, event) {
        _this.setState(function (prevState) {
          var prevField = prevState.fields[name];
          var value = (0, _utils.getNextValue)(event, prevField);
          // TODO: ensure this is actually merging setStates
          if (prevField.errors.length) {
            _this.validateField(name, value);
          }
          // FIXME: just testing!
          _this.props.onChange && _this.props.onChange(_extends({}, _this.values, _defineProperty({}, name, value)));
          return {
            fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevField, {
              value: value,
              touched: true,
              validated: value === prevField.value,
              pristine: _this.initialValues[name] === value
            })))
          };
        });
      }, _this.focusField = function (name) {
        _this.setState(function (prevState) {
          return {
            fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevState.fields[name], {
              focused: true
            })))
          };
        });
      }, _this.blurField = function (name) {
        _this.setState(function (prevState) {
          return {
            fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevState.fields[name], {
              focused: false,
              touched: true
            })))
          };
        });
        _this.validateField(name, _this.state.fields[name].value);
      }, _this.warnField = function (name, errors, validating) {
        errors = errors.filter(function (err) {
          return err;
        }).map(function (err) {
          return err.message || err;
        });
        _this.setState(function (prevState) {
          return {
            fields: _extends({}, prevState.fields, _defineProperty({}, name, _extends({}, prevState.fields[name], {
              errors: errors,
              validating: validating,
              validated: !errors.length && !validating
            })))
          };
        });
      }, _this.validateField = function (name, value) {
        if (!_this.shouldFieldValidate(name, value)) {
          return Promise.resolve();
        }
        // TODO: how should user build async errors? Promise.reject/resolve()

        var _this$runFieldValidat = _this.runFieldValidations(name, value),
            syncErrors = _this$runFieldValidat.syncErrors,
            asyncErrors = _this$runFieldValidat.asyncErrors;

        var hasSync = syncErrors.length > 0;
        var hasAsync = asyncErrors.length > 0;
        // if no syncErrors, this will clear errors
        _this.warnField(name, syncErrors, hasAsync);
        if (hasAsync) {
          // treat each error as successful resolve so we can handle all of them.
          var reflectErrors = asyncErrors.map(_utils.reflectPromise);
          // update field for first error when there are multiple async errors.
          if (asyncErrors.length > 1) {
            // wait for first error to resolve.
            // cancel if error resolves after unmount.
            _this.cancelOnUnmount(Promise.race(reflectErrors))
            // update field after first error resolves.
            .then(function (error) {
              return _this.warnField(name, [error].concat(_toConsumableArray(syncErrors)), true);
            });
          }
          // wait for all errors to resolve.
          // cancel if errors resolve after unmount.
          return _this.cancelOnUnmount(Promise.all(reflectErrors))
          // update field after errors resolve.
          .then(function (errors) {
            return _this.warnField(name, [].concat(_toConsumableArray(errors), _toConsumableArray(syncErrors)), false);
          });
        } else {
          Promise.resolve();
        }
      }, _this.shouldFieldValidate = function (name, nextValue) {
        var validated = _this.state.fields[name].validated;

        if (validated) return false;
        return true;
      }, _this.runFieldValidations = function (name, value) {
        return _this.validators[name].reduce(function (errors, validator) {
          var err = validator(value, _this.values);
          if (!err) {
            return errors;
          } else if (typeof err === 'string' || err instanceof Error) {
            errors.syncErrors.push(err);
          } else if (typeof err.then === 'function') {
            errors.asyncErrors.push(err);
          } else {
            throw new Error('validation must return a String, Error, or Promise');
          }
          return errors;
        }, { syncErrors: [], asyncErrors: [] });
      }, _this.validateForm = function () {
        // resolve if ALL fields are valid.
        // reject if ANY fields are invalid.
        return Promise.all(
        // run validation for every field.
        Object.keys(_this.state.fields).reduce(function (validations, name) {
          // each validation resolves when field was updated with latest error state.
          // should only fail to resolve if form unmounts.
          return [].concat(_toConsumableArray(validations), [_this.validateField(name, _this.state.fields[name].value)]);
        }, []));
      }, _this.handleSubmit = function (isValid) {
        var onSubmit = _this.props.onSubmit;

        if (_this.valid) {
          return onSubmit && onSubmit(_this.values);
        } else {
          return Promise.reject(new Error('Form is invalid'));
        }
      }, _this.handleSubmission = function (submission) {
        var isAsync = submission && typeof submission.then === 'function';
        if (isAsync) {
          _this.setState({
            submitting: true,
            submitSuccess: null,
            submitFailure: null
          });
        }
        // force submission into promise.
        return Promise.resolve(submission);
      }, _this.handleSubmitSuccess = function () {
        _this.setState({
          submitting: false,
          submitSuccess: true,
          submitFailure: null
        }, function () {
          _this.props.onSubmitSuccess();
        });
      }, _this.handleSubmitFailure = function (err) {
        _this.setState({
          submitting: false,
          submitSuccess: false,
          submitFailure: err ? err.message || err : null
        }, function () {
          _this.props.onSubmitFailure(err);
        });
      }, _this.submit = function () {
        return Promise
        // validate form before submitting.
        .resolve(_this.validateForm()).then(_this.handleSubmit).then(_this.handleSubmission).then(_this.handleSubmitSuccess).catch(_this.handleSubmitFailure);
      }, _this.reset = function () {
        Object.keys(_this.state.fields).forEach(function (name) {
          return _this.resetField(name);
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Form, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          _form: {
            unregisterField: this.unregisterField,
            registerField: this.registerField,
            changeField: this.changeField,
            resetField: this.resetField,
            focusField: this.focusField,
            blurField: this.blurField,
            submitting: this.state.submitting,
            fields: this.state.fields,
            pristine: this.pristine,
            focused: this.focused,
            touched: this.touched,
            values: this.values,
            errors: this.errors,
            valid: this.valid,
            submit: this.submit,
            reset: this.reset
          }
        };
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        if (nextProps.initialValues !== this.props.initialValues) {
          Object.keys(nextProps.initialValues).forEach(function (name) {
            _this2.resetField(name, nextProps.initialValues[name]);
          });
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._isUnmounted = false;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._isUnmounted = true;
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(this.element, {
          onSubmit: function onSubmit(e) {
            e.preventDefault();
          },
          children: this.props.children
        });
      }
    }, {
      key: 'pristine',
      get: function get() {
        return Object.values(this.state.fields).every(function (field) {
          return field.pristine;
        });
      }
    }, {
      key: 'touched',
      get: function get() {
        return Object.values(this.state.fields).some(function (field) {
          return field.touched;
        });
      }
    }, {
      key: 'valid',
      get: function get() {
        return Object.values(this.state.fields).every(function (field) {
          return field.errors.length < 1;
        });
      }
    }, {
      key: 'focused',
      get: function get() {
        var _this3 = this;

        return Object.keys(this.state.fields).find(function (name) {
          return _this3.state.fields[name].focused;
        });
      }
    }, {
      key: 'values',
      get: function get() {
        var _this4 = this;

        return Object.keys(this.state.fields).reduce(function (values, name) {
          values[name] = _this4.state.fields[name].value;
          return values;
        }, {});
      }
    }, {
      key: 'errors',
      get: function get() {
        var _this5 = this;

        return Object.keys(this.state.fields).reduce(function (errors, name) {
          if (_this5.state.fields[name].errors.length) {
            errors[name] = _this5.state.fields[name].errors;
          }
          return errors;
        }, {});
      }
    }, {
      key: 'element',
      get: function get() {
        return this.context._form ? 'div' : 'form';
      }
    }]);

    return Form;
  }(_react.Component);

  Form.displayName = 'Form';
  Form.propTypes = {
    initialValues: _react.PropTypes.object,
    onSubmit: _react.PropTypes.func,
    onSubmitSuccess: _react.PropTypes.func,
    onSubmitFailure: _react.PropTypes.func
  };
  Form.contextTypes = {
    _form: _react.PropTypes.object
  };
  Form.defaultProps = {
    initialValues: {},
    onSubmit: function onSubmit(e) {
      return console.log('onSubmit', e);
    },
    onSubmitSuccess: function onSubmitSuccess(e) {
      return console.log('onSubmitSuccess', e);
    },
    onSubmitFailure: function onSubmitFailure(e) {
      return console.log('onSubmitFailure', e);
    }
  };
  Form.childContextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  exports.default = Form;
});