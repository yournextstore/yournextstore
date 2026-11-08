#!/usr/bin/env bash
# main c87eddf (November 2026) declares the shop's own language on <html>: the locale
# the store config resolves (the default language once it is on, else the store's),
# instead of `me.store.settings.defaultLanguage` falling back to "en". Rewrites a
# `getHtmlLang` still in its old shape and imports `getStoreConfig`; Biome then drops
# a `meGetCached` import left unused and sorts the imports.
exec perl -0pi -e '
	my $old = qr/^async function getHtmlLang\(\): Promise<string> \{\n\ttry \{\n\t\tconst me = await meGetCached\(\);\n\t\treturn me\.store\.settings\?\.defaultLanguage\?\.split\("-"\)\[0\] \?\? "en";\n\t\} catch \{\n\t\treturn "en";\n\t\}\n\}\n/m;
	next unless /$old/;
	s/$old/\/\/ The shop\x27s language, as the platform decides it: the default language once it is switched on, else the store\x27s own.\nasync function getHtmlLang(): Promise<string> {\n\tconst { locale } = await getStoreConfig();\n\treturn locale.split("-")[0] || "en";\n}\n/;
	s/^/import { getStoreConfig } from "\@\/lib\/store-config";\n/ unless /\bimport \{[^}]*\bgetStoreConfig\b[^}]*\} from/;
' "$@"
