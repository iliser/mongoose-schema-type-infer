import { typedObjectId as tob } from "./mongoose_types";
import * as mongoose from "mongoose";
// TODO ObjectID support
// TODO ref support
// TODO enum improvment

/// utility to build type and convert it to plain ts type support primitives, arrays, objects and required props
export namespace SchemaDeclaration {
	const _Primitive = Symbol();
	export type PrimitiveType<T> = { [_Primitive]: T };

	export type StringType = PrimitiveType<string>;
	export type NumberType = PrimitiveType<number>;
	export type DateType = PrimitiveType<Date>;

	const _Array = Symbol();
	export type ArrayType<T extends Schema<any, boolean>> = { [_Array]: T };

	const _Object = Symbol();
	export type ObjectType<T extends Record<string, Schema<any, boolean>>> = {
		[_Object]: T;
	};

	export type SchemaType =
		| PrimitiveType<any>
		| ArrayType<any>
		| ObjectType<any>;

	export type Schema<T extends SchemaType, Required extends boolean = false> =
		{
			underlying: T;
			required: Required;
		};

	type RequiredKeys<T> = {
		[K in keyof T]: T[K] extends Schema<any, true> ? K : never;
	}[keyof T];
	type OptionalKeys<T> = {
		[K in keyof T]: T[K] extends Schema<any, false> ? K : never;
	}[keyof T];

	export type Strip<T extends Schema<any, boolean>> =
		T["underlying"] extends PrimitiveType<infer E>
			? E
			: T["underlying"] extends ArrayType<infer E>
			? Strip<E>[]
			: T["underlying"] extends ObjectType<infer O>
			? { [K in RequiredKeys<O>]: Strip<O[K]> } &
					{ [K in OptionalKeys<O>]?: Strip<O[K]> }
			: never;
}

namespace SchemaParser {
	type SchemaType = SchemaDeclaration.SchemaType;
	type Schema<T extends SchemaType, Required extends boolean = false> =
		SchemaDeclaration.Schema<T, Required>;
	type AnySchema = SchemaDeclaration.Schema<any, boolean>;

	export const None = Symbol();
	export type None = typeof None;

	const Succ = Symbol();
	type Succ<T extends AnySchema> = { [Succ]: T };

	// hello either my func friend
	type Res<T extends AnySchema | None> = T extends None
		? None
		: Succ<Exclude<T, None>>;

	// parse declaration if fail try parse type
	type Parser<T> = Res<DeclarationParser<T>> extends Succ<infer E>
		? E
		: Schema<TypeParser<T>>;

	type Declaration<T, Required, Enum> = {
		type: T;
		required?: Required;
		enum?: Enum;
	};

	type EnumOrType<T, Enum> = Enum extends readonly (infer E)[]
		? SchemaDeclaration.PrimitiveType<E>
		: T;

	type DeclarationParser<T> = T extends Declaration<
		infer E,
		infer R,
		infer Enum
	>
		? R extends true
			? Schema<EnumOrType<TypeParser<E>, Enum>, true>
			: Schema<EnumOrType<TypeParser<E>, Enum>, false>
		: None;

	const tSucc = Symbol();
	type tSucc<T extends SchemaType> = { [tSucc]: T };
	// dunnno how create high kind either with constraints
	type tRes<T extends SchemaType | None> = T extends None
		? None
		: tSucc<Exclude<T, None>>;

	type TypeParser<T> = tRes<PrimitiveTypeParser<T>> extends tSucc<infer E>
		? E
		: tRes<ArrayTypeParser<T>> extends tSucc<infer E>
		? E
		: tRes<ObjectTypeParser<T>> extends tSucc<infer E>
		? E
		: None;

	type ObjectTypeParser<T> = SchemaDeclaration.ObjectType<
		{
			[K in keyof T]: Parser<T[K]>;
		}
	>;
	type PrimitiveTypeParser<T> = [T] extends [StringConstructor]
		? SchemaDeclaration.StringType
		: [T] extends [NumberConstructor]
		? SchemaDeclaration.NumberType
		: [T] extends [DateConstructor]
		? SchemaDeclaration.DateType
		: TypeFromExtension.TypeFromExtension<T, None>;

	type ArrayTypeParser<T> = T extends readonly [infer E]
		? SchemaDeclaration.ArrayType<Parser<E>>
		: T extends readonly (infer E)[]
		? SchemaDeclaration.ArrayType<Parser<E>>
		: T extends readonly []
		? SchemaDeclaration.ArrayType<Schema<any, false>>
		: T extends ArrayConstructor
		? SchemaDeclaration.ArrayType<Schema<any, false>>
		: None;

	export type StrippedType<SchemaType> = SchemaDeclaration.Strip<
		Parser<SchemaType>
	>;
}

export namespace TypeFromExtension {
	const succ = Symbol();
	type Succ<T> = { [succ]: T };
	type Res<T extends SchemaDeclaration.SchemaType | None, None> =
		T extends None ? None : Succ<T>;

	type _GetTypeFromHKT<T, None> =
		| {
				[key in UriToKindKeys]: Res<UriToKind<T, None>[key], None>;
		  }[UriToKindKeys];

	type _ExtractResult<T, None> = Exclude<T, None> extends Succ<infer R>
		? Exclude<R, None> extends SchemaDeclaration.SchemaType
			? Exclude<R, None>
			: None
		: None;

	export type TypeFromExtension<T, None> = _ExtractResult<
		_GetTypeFromHKT<T, None>,
		None
	>;
}

type TimestampsMixin<Enable extends boolean> = Enable extends true
	? { createdAt?: Date; updatedAt?: Date }
	: {};

export const typedObjectId = tob;

export type TsType<SchemaType, EnableTimestamps extends boolean> =
	SchemaParser.StrippedType<SchemaType> &
		TimestampsMixin<EnableTimestamps> &
		mongoose.Document;
export type None = SchemaParser.None;

export type UriToKindKeys = keyof UriToKind<{}, never>;
export interface UriToKind<A, None> {}
