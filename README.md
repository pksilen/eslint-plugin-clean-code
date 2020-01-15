# eslint-plugin-clean-code

# UNDER CONSTRUCTION !!

Clean code ESLint plugin

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm install --save-dev eslint 
```

Next, install `eslint-plugin-clean-code`:

```
$ npm install --save-dev eslint-plugin-clean-code
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-clean-code` globally.

## Usage

Add `clean-code` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "clean-code"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "clean-code/feature-envy": 2
    }
}
```

## Supported Rules

    | Rule name         | Description                                                                      |
    --------------------------------------------------------------------------------------------------------
    | feature-envy      | Reports the "Feature Envy" code smell. Feature envy is defined as occurring when |
    |                   | a method calls methods on another class three or more times. Feature envy is     |
    |                   | often an indication that functionality is located in the wrong class.            |                                                                        |
    
    
## Todo
- [ ] Allow feature envy for library classes and lodash (_)
- [ ] Allow end-user configuration of object name/class for which feature envy is not reported 

- [ ] Chain of 'instanceof' checks
        
      Reports any chains of if-else statements all of whose conditions are instanceof expressions or class equality
      expressions (e.g. comparison with String.class). Such constructions usually indicate a failure of object-oriented
      design, which dictates that such type-based dispatch should be done via polymorphic method calls rather than 
      explicit chains of type tests. 

- [ ] 'if' statement with too many branches
      
      Reports if statements with too many branches. Such statements may be confusing, and are often the sign of 
      inadequate levels of design abstraction.
      
- [ ] 'switch' statement outside of factory class/method

- [ ] Method call violates Law of Demeter

- [ ] Overly complex boolean expression  

## Contributing




