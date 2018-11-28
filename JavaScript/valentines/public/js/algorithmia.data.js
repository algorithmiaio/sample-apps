(function() {
  var autoType, isArray, isMap, printType, unifyArray, unifyTypes;

  autoType = function(data) {
    var arrayType, key, keyType, types, value, valueType;
    switch (Object.prototype.toString.call(data)) {
      case "[object Array]":
        types = data.map(autoType);
        arrayType = unifyArray(types);
        return [arrayType];
      case "[object Object]":
        keyType = unifyArray((function() {
          var _results;
          _results = [];
          for (key in data) {
            value = data[key];
            _results.push(autoType(key));
          }
          return _results;
        })());
        valueType = unifyArray((function() {
          var _results;
          _results = [];
          for (key in data) {
            value = data[key];
            _results.push(autoType(value));
          }
          return _results;
        })());
        return {
          key: keyType,
          value: valueType
        };
      case "[object Boolean]":
        return "Boolean";
      case "[object String]":
        return "String";
      case "[object Number]":
        return "Number";
      case "[object Undefined]":
        return "Unit";
      case "[object Null]":
        return "Unit";
    }
  };

  unifyArray = function(array) {
    return array.reduce(unifyTypes, "Unit");
  };

  unifyTypes = function(typeA, typeB) {
    var arrayType, keyType, valueType;
    if (typeA === typeB) {
      return typeA;
    } else if (typeA === null || typeA === "Unit") {
      return typeB;
    } else if (typeB === null || typeB === "Unit") {
      return typeA;
    } else if (typeA === "Any" || typeB === "Any") {
      return "Any";
    } else if (typeA === "String" && (typeB === "Number" || typeB === "Boolean")) {
      return "String";
    } else if (typeB === "String" && (typeA === "Number" || typeA === "Boolean")) {
      return "String";
    } else if (isArray(typeA) && isArray(typeB)) {
      arrayType = unifyTypes(typeA[0], typeB[0]);
      return [arrayType];
    } else if (isMap(typeA) && isMap(typeB)) {
      keyType = unifyTypes(typeA.key, typeB.key);
      valueType = unifyTypes(typeA.value, typeB.value);
      return {
        key: keyType,
        value: valueType
      };
    } else {
      return "Any";
    }
  };

  isArray = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };

  isMap = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };

  printType = function(type) {
    if (isArray(type)) {
      return "List[" + printType(type[0]) + "]";
    } else if (isMap(type)) {
      return "Map[" + printType(type.key) + "," + printType(type.value) + "]";
    } else {
      return type;
    }
  };

  window.Types = {
    autoType: autoType,
    printType: printType
  };

}).call(this);

//# sourceMappingURL=algorithmia.data.js.map