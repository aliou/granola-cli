#!/usr/bin/env nix-shell
#! nix-shell -i bash
# Version script that:
# 1. Runs changeset version (bumps version, updates changelog)
# 2. Builds binaries
# 3. Computes hashes
# 4. Updates flake.nix and src/constants.ts

set -euo pipefail

# Run changeset version
pnpm changeset version

# Get new version
VERSION=$(jq -r '.version' package.json)
echo "Version: ${VERSION}"

# Build binaries
echo "Building binaries..."
nix develop --command pnpm build

# Compute hashes
echo "Computing hashes..."
DARWIN_ARM_HASH=$(nix hash file --sri dist/granola-darwin-arm64)
LINUX_ARM_HASH=$(nix hash file --sri dist/granola-linux-arm64)
echo "Darwin ARM64 hash: ${DARWIN_ARM_HASH}"
echo "Linux ARM64 hash: ${LINUX_ARM_HASH}"

# Update flake.nix
sed -i "s|version = \"[^\"]*\";|version = \"${VERSION}\";|" flake.nix
sed -i "s|hash = \"sha256-[^\"]*\"; # darwin|hash = \"${DARWIN_ARM_HASH}\"; # darwin|" flake.nix
sed -i "s|hash = \"sha256-[^\"]*\"; # linux-arm64|hash = \"${LINUX_ARM_HASH}\"; # linux-arm64|" flake.nix
echo "Updated flake.nix"

# Update src/constants.ts version
sed -i "s|export const VERSION = \"[^\"]*\";|export const VERSION = \"${VERSION}\";|" src/constants.ts
echo "Updated src/constants.ts"

# Clean up dist (don't commit binaries)
rm -rf dist

echo "Ready to release v${VERSION}"
