// Let's make an object and start adding methods to it!
class LoScore {
  identity(val) {
    return val;
  }

  /**
  | ARRAYS
  |~~~~~~~~~~
  * */
  uniq(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      if (result.includes(array[i])) continue;
      result.push(array[i]);
    }
    return result;
  }

  /**
  | COLLECTIONS
  |~~~~~~~~~~
  * */
  each(collection, iterator) {
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i += 1) {
        iterator(collection[i], i, collection);
      }
    } else {
      const keys = Object.keys(collection);
      for (let i = 0; i < keys.length; i += 1) {
        iterator(collection[keys[i]], keys[i], collection);
      }
    }
  }

  map(collection, iteratee) {
    const result = [];
    this.each(collection, (value, key) => {
      result.push(iteratee(value, key, collection));
    });
    return result;
  }

  filter(collection, test) {
    const result = [];
    this.each(collection, (val) => test(val) && result.push(val));
    return result;
  }

  reject(collection, test) {
    return this.filter(collection, (val) => {
      if (test(val)) return false;
      return true;
    });
  }

  reduce(collection, iterator, accumulator) {
    let result = accumulator;
    this.each(collection, (value, index) => {
      if (index === 0 && result === undefined) {
        result = value;
      } else {
        result = iterator(result, value);
      }
    });
    return result;
  }

  every(collection, test) {
    return this.reduce(
      collection,
      (accumulator, value) => {
        if (typeof test === "function") {
          return !!(accumulator && test(value));
        }
        return !!(accumulator && value);
      },
      true
    );
  }

  /**
  | OBJECTS
  |~~~~~~~~~~
  * */
  extend(obj, ...extra) {
    this.each(extra, (value) => {
      for (const i of Object.keys(value)) {
        obj[i] = value[i];
      }
    });
    return obj;
  }

  /**
  | FUNCTIONS
  |~~~~~~~~~~
  * */

  once(func) {
    let invoked = false;
    return () => {
      if (!invoked) {
        func();
        invoked = true;
      }
    };
  }

  memoize(func) {
    const cache = new Object();
    return (...data) => {
      if (typeof cache[JSON.stringify(data)] === "undefined") {
        cache[JSON.stringify(data)] = func(...data);
      }
      return cache[JSON.stringify(data)];
    };
  }

  invoke(collection, functionOrKey) {
    const result = [];
    if (typeof functionOrKey === "function") {
      for (let i = 0; i < collection.length; i++) {
        result.push(functionOrKey.apply(collection[i]));
      }
    } else {
      for (let i = 0; i < collection.length; i++) {
        result.push(collection[i][functionOrKey].apply(collection[i]));
      }
    }
    return result;
  }

  /**
  | ADVANCED REQUIREMENTS
  |~~~~~~~~~~~~~
  * */

  sortBy(collection, functionOrKey) {
    return collection.sort((a, b) => {
      if (typeof functionOrKey === "function") {
        return functionOrKey(a) < functionOrKey(b) ? -1 : 1;
      }
      return a[functionOrKey] < b[functionOrKey] ? -1 : 1;
    });
  }

  zip(...array) {
    const result = [];
    for (let i = 0; i < array[0].length; i++) {
      const tmp = [];
      for (let j = 0; j < array.length; j++) {
        tmp.push(array[j][i]);
      }
      result.push(tmp);
    }
    return result;
  }

  delay(func, delay, ...arg) {
    setTimeout(() => {
      func(...arg);
    }, delay);
  }

  defaults(obj, ...extra) {
    this.each(extra, (value) => {
      for (const i of Object.keys(value)) {
        if (typeof obj[i] === "undefined") obj[i] = value[i];
      }
    });
    return obj;
  }

  throttle(func, delay) {
    let time = 0;
    return () => {
      const timePast = Date.now() - time;
      if (time && timePast < delay) return;
      func();
      time = Date.now();
    };
  }
}

module.exports = new LoScore();
