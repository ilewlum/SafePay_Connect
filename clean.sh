#!/bin/bash

# This script removes Claude mentions from git commit messages

echo "Starting to clean commit messages..."

# Create backup branch
git branch -f backup-original HEAD

# Get the hash of the oldest commit with Claude mentions
FIRST_COMMIT=$(git log --pretty=format:%H --grep="Claude" --reverse | head -n1)

if [ -z "$FIRST_COMMIT" ]; then
    echo "No commits with Claude mentions found."
    exit 0
fi

# Get parent of first commit
PARENT=$(git rev-parse ${FIRST_COMMIT}^)

echo "Will rebase from: $PARENT"

# Export a function to clean messages
export -f clean_msg() {
    grep -v "🤖 Generated with" | grep -v "Co-Authored-By: Claude"
}

# Use filter-branch with proper escaping for Windows Git Bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force \
    --msg-filter 'grep -v "Generated with" | grep -v "Co-Authored"' \
    ${PARENT}..HEAD

echo "Cleaning complete!"
echo "Backup saved in branch: backup-original"
echo "To push changes: git push --force origin master"