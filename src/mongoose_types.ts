import * as mongoose from "mongoose";
const objectIdSymbol = Symbol();
export type objectIdMixin = { [objectIdSymbol]: any };

type ObjectId = mongoose.Types.ObjectId;
type typeObjectId = ObjectId & objectIdMixin;

export const typedObjectId: typeObjectId = mongoose.Types.ObjectId as any; // forgive me

declare module "./index" {
	interface UriToKind<A, None> {
		objectId: A extends typeObjectId
			? SchemaDeclaration.PrimitiveType<ObjectId | string>
			: None;
	}
}
