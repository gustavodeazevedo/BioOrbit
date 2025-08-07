#!/bin/bash
# Setup git hooks

chmod +x update-version.sh
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << EOL
#!/bin/bash
./update-version.sh
EOL

chmod +x .git/hooks/pre-commit

echo "Git hooks set up successfully!"