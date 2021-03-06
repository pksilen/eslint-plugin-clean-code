/**
 * @fileoverview Feature envy
 * @author Petri Silen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/feature-envy'),

    RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 11,
        sourceType: "module"
    },
    "parser": "/Users/pksilen/Code/eslint-plugin-clean-code/node_modules/babel-eslint"
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('feature-envy', rule, {

    valid: [
        "Number.isFinite(1); Number.isFinite(2); Number.isFinite(3);",
        "const str = ''; str.trim(); str.trim(); str.trim()",
        "import _ from 'lodash'; const a = []; a.head(); a.head(); a.head()",
        "console.log('test'); console.log('test'); console.log('test');",
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); }",
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); const test = () => testObj.testFunction();",
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); class Test { test() { testObj.testFunction(); } }",
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); class Test { test = () => { testObj.testFunction(); } }"
    ],

    invalid: [
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); class Test { test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); } }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "MethodDefinition"
            }]
        },
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); class Test { test = () => { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); } }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "ClassProperty"
            }]
        },
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); const test = () => { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "import testObj from './testObj'; function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "import StringUtils from './StringUtils'; function test() { StringUtils.testFunction(); StringUtils.testFunction(); StringUtils.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'StringUtils' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "import Chart from './Chart'; const chart = new Chart(); function test() { chart.testFunction(); chart.testFunction(); chart.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'chart' called multiple times",
                type: "FunctionDeclaration"
            }]
        }
    ]
});
