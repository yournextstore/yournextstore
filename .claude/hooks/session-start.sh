#!/bin/bash
set -euo pipefail

# Only run in remote/web environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install dependencies using Bun
bun install
