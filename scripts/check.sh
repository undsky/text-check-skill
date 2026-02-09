#!/bin/sh

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check for Python
if command -v python3 >/dev/null 2>&1; then
    echo "Using python3..."
    python3 "$SCRIPT_DIR/check_text.py" "$@"
    exit $?
elif command -v python >/dev/null 2>&1; then
    echo "Using python..."
    python "$SCRIPT_DIR/check_text.py" "$@"
    exit $?
fi

# Check for Node.js
if command -v node >/dev/null 2>&1; then
    echo "Using node..."
    node "$SCRIPT_DIR/check_text.js" "$@"
    exit $?
fi

echo "Error: Neither Python nor Node.js found in PATH."
exit 1
