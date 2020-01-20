# Feature envy (feature-envy)

A method accesses the data of another object more than its own data


## Rule Details

Reports the "Feature Envy" code smell. Feature envy is defined as occurring when a method calls methods on another class three or more times. Calls to library classes are not counted for purposes of this inspection. Feature envy is often an indication that functionality is located in the wrong class. 

Examples of **incorrect** code for this rule:

```js
class TestObj {
  testFunction() {};
};

const testObj = new TestObj();

function test() {
  testObj.testFunction();
  testObj.testFunction();
  testObj.testFunction();
}
```

Examples of **correct** code for this rule:

```js
Number.isFinite(1);
Number.isFinite(2);
Number.isFinite(3);

class TestObj {  
  testFunction() {};
}

const testObj = new TestObj();

function test() {
  testObj.testFunction();
  testObj.testFunction();
}

import _ from 'lodash';
const a = [];
a.head();
a.head();
a.head();
```

## Further Reading

https://refactoring.guru/smells/feature-envy
