---
id: "configerror"
title: "Class: ConfigError"
sidebar_label: "ConfigError"
hide_title: true
---

# Class: ConfigError

Error thrown by searchconfig package.
Parent Error for [ConfigSyntaxError](configsyntaxerror.md),
[ConfigUnknownLoaderError](configunknownloadererror.md) and [ConfigNotFoundError](confignotfounderror.md)

## Hierarchy

* *Error*

  ↳ **ConfigError**

  ↳↳ [*ConfigSyntaxError*](configsyntaxerror.md)

  ↳↳ [*ConfigUnknownLoaderError*](configunknownloadererror.md)

  ↳↳ [*ConfigNotFoundError*](confignotfounderror.md)

## Constructors

### constructor

\+ **new ConfigError**(`message?`: *string*, `originalError?`: Error, `fileName?`: *string*): [*ConfigError*](configerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message?` | *string* |
`originalError?` | Error |
`fileName?` | *string* |

**Returns:** [*ConfigError*](configerror.md)

Defined in: src/errors.ts:11

## Properties

### fileName

• `Optional` **fileName**: *undefined* | *string*

Defined in: src/errors.ts:11

___

### message

• **message**: *string*

Defined in: src/errors.ts:9

___

### name

• `Readonly` **name**: *string*= 'ConfigError'

Defined in: src/errors.ts:8

___

### originalError

• `Optional` **originalError**: *undefined* | Error

Defined in: src/errors.ts:10

___

### stack

• `Optional` **stack**: *undefined* | *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Optional` `Static` **prepareStackTrace**: *undefined* | (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: node_modules/@types/node/globals.d.ts:4
