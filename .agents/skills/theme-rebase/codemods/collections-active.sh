#!/usr/bin/env bash
# main c02951d (October 2026) asks for active collections only, so hidden ones stay out
# of the header and footer and the read can be cached keyless. Adds `active: true` to
# every `collectionBrowse({ … })` call that does not set `active` yet, the way that
# commit rewrote app/layout.tsx and app/footer.tsx.
exec perl -0pi -e '
	s/\bcollectionBrowse\(\{ (?![^}]*\bactive\b)/collectionBrowse({ active: true, /g;
' "$@"
