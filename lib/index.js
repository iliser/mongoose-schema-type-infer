"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedObjectId = exports.TypeFromExtension = exports.SchemaDeclaration = void 0;
const mongoose_types_1 = require("./mongoose_types");
// TODO ObjectID support
// TODO ref support
// TODO enum improvment
/// utility to build type and convert it to plain ts type support primitives, arrays, objects and required props
var SchemaDeclaration;
(function (SchemaDeclaration) {
    const _Primitive = Symbol();
    const _Array = Symbol();
    const _Object = Symbol();
})(SchemaDeclaration = exports.SchemaDeclaration || (exports.SchemaDeclaration = {}));
var SchemaParser;
(function (SchemaParser) {
    SchemaParser.None = Symbol();
    const Succ = Symbol();
    const tSucc = Symbol();
})(SchemaParser || (SchemaParser = {}));
var TypeFromExtension;
(function (TypeFromExtension) {
    const succ = Symbol();
})(TypeFromExtension = exports.TypeFromExtension || (exports.TypeFromExtension = {}));
exports.typedObjectId = mongoose_types_1.typedObjectId;
