---
id: "registry"
title: "Class: Registry"
sidebar_label: "Registry"
hide_title: true
---

# Class: Registry

Class of the registry of loader functions, loader error functions
and exts (file extensions).
Although exported, it is not recommended to use this class directly,
please use the instance of the class - [registry](../variables/registry.md) - instead

**`internal`** 

## Hierarchy

* **Registry**

## Constructors

### constructor

\+ **new Registry**(): [*Registry*](registry.md)

**Returns:** [*Registry*](registry.md)

Defined in: src/registry.ts:114

## Properties

### defaultExtRegistry

• `Private` **defaultExtRegistry**: { `.cjs`: *string* = 'import'; `.js`: *string* = 'import'; `.json`: *string* = 'json'; `.mjs`: *string* = 'import'; `.ts`: *string* = 'import'; `.yaml`: *string* = 'yaml'; `.yml`: *string* = 'yaml' }

#### Type declaration:

Name | Type |
------ | ------ |
`.cjs` | *string* |
`.js` | *string* |
`.json` | *string* |
`.mjs` | *string* |
`.ts` | *string* |
`.yaml` | *string* |
`.yml` | *string* |

Defined in: src/registry.ts:102

___

### defaultLoaderErrorRegistry

• `Private` **defaultLoaderErrorRegistry**: *Record*<*string*, [*LoaderErrorFuncType*](../types/loadererrorfunctype.md)\>

Defined in: src/registry.ts:88

___

### defaultLoaderRegistry

• `Private` **defaultLoaderRegistry**: *Record*<*string*, [*LoaderType*](../types/loadertype.md)\>

Defined in: src/registry.ts:83

___

### extRegistry

• `Private` **extRegistry**: *Record*<*string*, *string*\>

Defined in: src/registry.ts:114

___

### loaderErrorRegistry

• `Private` **loaderErrorRegistry**: *Record*<*string*, [*LoaderErrorFuncType*](../types/loadererrorfunctype.md)\>

Defined in: src/registry.ts:113

___

### loaderRegistry

• `Private` **loaderRegistry**: *Record*<*string*, [*LoaderType*](../types/loadertype.md)\>

Defined in: src/registry.ts:112

## Accessors

### exts

• **exts**(): *Record*<*string*, *string*\>

Get ext (file extension) in the registry

**`example`** 

**Returns:** *Record*<*string*, *string*\>

Object containing all exts (file extensions)

Defined in: src/registry.ts:212

___

### loaderErrors

• **loaderErrors**(): *Record*<*string*, [*LoaderErrorFuncType*](../types/loadererrorfunctype.md)\>

Get loader error in the registry

**`example`** 

**Returns:** *Record*<*string*, [*LoaderErrorFuncType*](../types/loadererrorfunctype.md)\>

Object containing all loader errors

Defined in: src/registry.ts:200

___

### loaders

• **loaders**(): *Record*<*string*, [*LoaderType*](../types/loadertype.md)\>

Get loaders in the registry

**`example`** 

**Returns:** *Record*<*string*, [*LoaderType*](../types/loadertype.md)\>

Object containing all loaders

Defined in: src/registry.ts:188

## Methods

### addExt

▸ **addExt**(`ext`: *string*, `loaderName`: *string*): *void*

Add an ext (file extension) into the registry

**`example`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`ext` | *string* | Ext (file extension) name   |
`loaderName` | *string* | Loader name    |

**Returns:** *void*

Defined in: src/registry.ts:176

___

### addLoader

▸ **addLoader**(`loaderName`: *string*, `loader`: [*LoaderType*](../types/loadertype.md)): *void*

Add a loader function into the registry

**`example`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`loaderName` | *string* | Loader name   |
`loader` | [*LoaderType*](../types/loadertype.md) | - |

**Returns:** *void*

Defined in: src/registry.ts:147

___

### addLoaderError

▸ **addLoaderError**(`loaderName`: *string*, `loaderErrorFunc`: [*LoaderErrorFuncType*](../types/loadererrorfunctype.md)): *void*

Add a loader error function into the registry

**`example`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`loaderName` | *string* | Loader name   |
`loaderErrorFunc` | [*LoaderErrorFuncType*](../types/loadererrorfunctype.md) | Loader error function    |

**Returns:** *void*

Defined in: src/registry.ts:160

___

### jsonoryaml

▸ `Private`**jsonoryaml**(`str`: *string*): *unknown*

Parse a string that is JSON or YAML: try JSON.parse first,
if it is not correct JSON string, then use
the loader function registered as 'yaml' to parse the string

**`internal`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`str` | *string* | string to parse   |

**Returns:** *unknown*

JSON (or YAML) object

Defined in: src/registry.ts:72

___

### reset

▸ **reset**(): *void*

Reset registry

**`example`** 
```ts
registry.reset()
```

**Returns:** *void*

Defined in: src/registry.ts:132
