#!/usr/bin/env bash
# must-b installer for Linux / macOS
# https://must-b.com

set -e

MUSTB_VERSION="1.2.2"
NPM_PACKAGE="@must-b/must-b@${MUSTB_VERSION}"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║        must-b Installer v${MUSTB_VERSION}        ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "  ✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "  ✗ Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi

echo "  ✓ Node.js $(node -v) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
  echo "  ✗ npm not found. Please install npm."
  exit 1
fi

echo "  ↳ Installing ${NPM_PACKAGE}..."
npm install -g "${NPM_PACKAGE}"

echo ""
echo "  ✓ must-b v${MUSTB_VERSION} installed successfully."
echo ""
echo "  Run the following to start your agent:"
echo "    must-b gateway"
echo ""
