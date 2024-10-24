type Separator = ".";

type KeysOrNamespaces<TStr extends string> = TStr extends `${infer Head}${Separator}${infer Tail}`
	? Head | `${Head}${Separator}${KeysOrNamespaces<Tail>}`
	: TStr;

type AllKeysOrNamespaces<TObject extends object> = {
	[K in keyof TObject]: KeysOrNamespaces<string & K>;
}[keyof TObject];

export type IntlNamespaceKeys = AllKeysOrNamespaces<IntlMessages>;

export type NamespacedKeys<TObject extends object, TNamespace extends string> = {
	[K in keyof TObject]: K extends `${TNamespace}${Separator}${infer Tail}` ? Tail : never;
}[keyof TObject];
