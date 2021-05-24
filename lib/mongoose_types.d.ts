import * as mongoose from "mongoose";
declare const objectIdSymbol: unique symbol;
export declare type objectIdMixin = {
    [objectIdSymbol]: any;
};
declare type ObjectId = mongoose.Types.ObjectId;
declare type typeObjectId = ObjectId & objectIdMixin;
export declare const typedObjectId: typeObjectId;
declare module "./index" {
    interface UriToKind<A, None> {
        objectId: A extends typeObjectId ? SchemaDeclaration.PrimitiveType<ObjectId | string> : None;
    }
}
export {};
