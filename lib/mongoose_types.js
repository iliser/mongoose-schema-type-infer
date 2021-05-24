"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedObjectId = void 0;
const mongoose = require("mongoose");
const objectIdSymbol = Symbol();
exports.typedObjectId = mongoose.Types.ObjectId; // forgive me
