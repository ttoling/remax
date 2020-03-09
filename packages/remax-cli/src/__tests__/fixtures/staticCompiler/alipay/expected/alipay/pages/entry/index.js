'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('../../_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');
var createHostComponent = require('../../npm/remax/esm/createHostComponent.js');
require('../../npm/remax/esm/render.js');
require('../../npm/remax/esm/createAppConfig.js');
require('../../npm/remax/esm/Platform.js');
var createPageConfig = require('../../npm/remax/esm/createPageConfig.js');
var createNativeComponent = require('../../npm/remax/esm/createNativeComponent.js');
require('../../npm/remax/esm/index.js');
var index$2 = require('../../npm/remax/npm/remax-alipay/esm/hostComponents/View/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/ScrollView/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Swiper/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/SwiperItem/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/MovableView/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/MovableArea/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/CoverView/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/CoverImage/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Icon/index.js');
var index$9 = require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Text/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/RichText/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Progress/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Button/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/CheckboxGroup/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Checkbox/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Form/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Input/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Label/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Picker/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/PickerView/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/PickerViewColumn/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/RadioGroup/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Radio/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Slider/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Switch/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Textarea/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Navigator/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Image/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Map/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Canvas/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/WebView/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Lifestyle/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/ContactButton/index.js');
require('../../npm/remax/npm/remax-alipay/esm/hostComponents/Video/index.js');
require('../../npm/remax/npm/remax-alipay/esm/api/index.js');
var index$z = require('../../npm/remax-window/index.js');

var NativeComponent = createNativeComponent.default('native-component-0');
var RenameView = index$2.default;
var Deep = {
  Object: {
    View: index$2.default
  }
};
var DDD = createHostComponent.default('ddd');

function ReactComp(_ref) {
  var children = _ref.children;
  return React.createElement(React.Fragment, null, React.createElement(index$2.default, {
    _tid: "1"
  }, React.createElement(index$9.default, null, "react component"), React.createElement(React.Fragment, null, React.createElement(index$9.default, null, "Text inside Fragment")), React.createElement("block", null, React.createElement(index$2.default, {
    _tid: "2"
  }, "View inside Expression")), React.createElement("block", null, React.Children.map(children, function (child, index) {
    if (index === 2) {
      return child;
    }

    return React.cloneElement(child, {
      id: 'reactComp' + index
    });
  }))));
}

function _ref2() {
  var _React$useState = React.useState(1),
      _React$useState2 = _rollupPluginBabelHelpers.slicedToArray(_React$useState, 1),
      count = _React$useState2[0];

  var props = {
    id: 'spreadId'
  };

  var _React$useState3 = React.useState(true),
      _React$useState4 = _rollupPluginBabelHelpers.slicedToArray(_React$useState3, 1),
      show = _React$useState4[0];

  var _React$useState5 = React.useState(true),
      _React$useState6 = _rollupPluginBabelHelpers.slicedToArray(_React$useState5, 1),
      showPlainText = _React$useState6[0];

  var plainText = 'plain-text-leaf';
  return React.createElement(index$2.default, {
    entry: true,
    _tid: "3"
  }, "JSXText entry", React.createElement("block", null, 'expression entry'), React.createElement(React.Fragment, null, React.createElement(index$9.default, null, "Fragment Text 1"), React.createElement(index$9.default, null, "Fragment Text 2"), React.createElement(React.Fragment, null, React.createElement(index$9.default, null, "Fragment Text 3"), React.createElement(index$9.default, null, "Fragment Text 4"))), React.createElement(React.Fragment, null, "Fragment"), React.createElement(React.Fragment, null, "React.Fragment"), React.createElement("block", null, React.createElement(DDD, null)), React.createElement(index$9.default, null, "Remax.Text"), React.createElement("block", null, React.createElement(NativeComponent, null)), React.createElement("block", null, React.createElement(ReactComp, null, React.createElement(index$2.default, {
    _tid: "4"
  }, "React Component First Child"), React.createElement("block", null, 'React Component Second Child'), React.createElement(index$2.default, {
    _tid: "5"
  }, "React Component Third Child"))), React.createElement(index$2.default, {
    className: "className"
  }, "Count: ", React.createElement("block", null, count)), React.createElement(index$2.default, {
    id: count,
    className: 'class'
  }, "view"), React.createElement(index$2.default, null, "custom view"), React.createElement("block", null, React.createElement('view', {
    id: 'view'
  }, [React.createElement(index$2.default, {
    key: "1",
    _tid: "6"
  }, "create element children 1"), React.createElement('view', {
    key: '2'
  })])), React.createElement("block", null, [1, 2, 3].map(function (item) {
    return React.createElement(index$2.default, {
      key: item,
      _tid: "7"
    }, "array map: ", React.createElement("block", null, item));
  })), React.createElement(index$2.default, props, "Spread Attributes View"), React.createElement(index$9.default, null, "long long long long long long long long long long long long text long long long long long long long long long long long long text"), React.createElement("block", null, React.createElement(index$z.default, null)), React.createElement("block", null, 'Literal Expression'), React.createElement("block", null, React.createElement(Deep.Object.View, null, "Deep Object View")), React.createElement("block", null, React.createElement(RenameView, null, "Rename View")), React.createElement("block", null, show && React.createElement(index$2.default, {
    _tid: "8"
  }, "Conditional View")), React.createElement(index$9.default, {
    leaf: true
  }, showPlainText && plainText), React.createElement(index$2.default, {
    "ns:attr": "1"
  }));
}

var index = Page(createPageConfig.default(_ref2));

exports.default = index;