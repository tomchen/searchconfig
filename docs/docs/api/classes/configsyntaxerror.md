---
id: "configsyntaxerror"
title: "Class: ConfigSyntaxError"
sidebar_label: "ConfigSyntaxError"
hide_title: true
---

# Class: ConfigSyntaxError

Error specifying that there is syntax error in the config file
found therefore it cannot be parsed

## Hierarchy

* [*ConfigError*](configerror.md)

  ↳ **ConfigSyntaxError**

## Constructors

### constructor

\+ **new ConfigSyntaxError**(`message?`: *string*, `originalError?`: Error, `fileName?`: *string*): [*ConfigSyntaxError*](configsyntaxerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message?` | *string* |
`originalError?` | Error |
`fileName?` | *string* |

**Returns:** [*ConfigSyntaxError*](configsyntaxerror.md)

Inherited from: [ConfigError](configerror.md)

Defined in: src/errors.ts:28

## Properties

### fileName

• `Optional` **fileName**: *undefined* | *string*

Inherited from: [ConfigError](configerror.md).[fileName](configerror.md#filename)

Defined in: src/errors.ts:11

___

### message

• **message**: *string*

Inherited from: [ConfigError](configerror.md).[message](configerror.md#message)

Defined in: src/errors.ts:9

___

### name

• **name**: *string*= 'ConfigSyntaxError'

Overrides: [ConfigError](configerror.md).[name](configerror.md#name)

Defined in: src/errors.ts:28

___

### originalError

• `Optional` **originalError**: *undefined* | Error

Inherited from: [ConfigError](configerror.md).[originalError](configerror.md#originalerror)

Defined in: src/errors.ts:10

___

### prepareStackTrace

• `Optional` **prepareStackTrace**: *undefined* | (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stack

• `Optional` **stack**: *undefined* | *string*

Inherited from: [ConfigError](configerror.md).[stack](configerror.md#stack)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### stackTraceLimit

• **stackTraceLimit**: *number*

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: node_modules/@types/node/globals.d.ts:4
