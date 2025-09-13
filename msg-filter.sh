#!/bin/bash
# Filter script to remove Claude mentions from commit messages
grep -v "🤖 Generated with" | grep -v "Co-Authored-By: Claude" | sed '/^[[:space:]]*$/d'