#!/usr/bin/env bash
# Fetch the shared Shipfront capability stills into assets/images/.
#
# The frames live on the sibling Shipfront site and are used here as is. Each
# one is pinned to a sha1 so the bytes are provably identical and never
# recoded. Already correct files are left untouched.
#
# Usage: scripts/fetch-stills.sh   (from the repo root)

set -euo pipefail

SRC="https://davidtphung.github.io/shipfront-the-sheet/images"
DEST="assets/images"

# name sha1 bytes
STILLS=(
  "fulfillment.jpg 238ec32fdede338cdcbf1a80750df501ba47afff 236192"
  "procurement.jpg af399d3ccae1fe6beadca14f3bb22e62f4d9d7e2 288810"
  "integration.jpg dcb6b57acc3b0a95f2db3c33d66d56e7fa672c6b 198616"
  "logistics-usa.jpg 01268520751d59bf9762d2d7d7c3e1555ba60c8d 376501"
)

mkdir -p "$DEST"
changed=0

for entry in "${STILLS[@]}"; do
  read -r name want_sha want_bytes <<<"$entry"
  target="$DEST/$name"

  if [ -f "$target" ] && [ "$(sha1sum "$target" | cut -d' ' -f1)" = "$want_sha" ]; then
    echo "ok       $name"
    continue
  fi

  echo "fetching $name"
  curl -fsSL --retry 4 --retry-delay 3 "$SRC/$name" -o "$target"

  got_sha="$(sha1sum "$target" | cut -d' ' -f1)"
  got_bytes="$(stat -c%s "$target")"

  if [ "$got_sha" != "$want_sha" ] || [ "$got_bytes" != "$want_bytes" ]; then
    echo "FAIL     $name" >&2
    echo "  expected sha1 $want_sha at $want_bytes bytes" >&2
    echo "  got      sha1 $got_sha at $got_bytes bytes" >&2
    exit 1
  fi

  echo "verified $name"
  changed=1
done

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "changed=$changed" >>"$GITHUB_OUTPUT"
fi

echo "all four stills present and verified"
