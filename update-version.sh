#!/bin/bash
# Script to update version.json on each commit

# Get current date in ISO format
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# You can use git commit hash as version or manage your own versioning
VERSION=$(git rev-parse --short HEAD)

# Create JSON content
cat > public/version.json << EOL
{
  "version": "${VERSION}",
  "buildTime": "${BUILD_DATE}"
}
EOL

# Add the updated file to the current commit
git add public/version.json