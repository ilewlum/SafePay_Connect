#!/bin/bash

# Get all commits that mention Claude
commits=$(git log --pretty=format:"%H" --grep="Claude" | tac)

if [ -z "$commits" ]; then
    echo "No commits with Claude mentions found."
    exit 0
fi

echo "Found commits with Claude mentions. Starting cleanup..."

# Create a temporary branch for safety
git branch backup-before-clean

# For each commit, amend the message
for commit in $commits; do
    echo "Processing commit $commit"

    # Get the commit message without Claude lines
    msg=$(git log -1 --pretty=format:%B $commit | grep -v "🤖 Generated with" | grep -v "Co-Authored-By: Claude")

    # Get parent commit
    parent=$(git rev-parse $commit^)

    # Create new commit with cleaned message
    git checkout $commit 2>/dev/null
    git commit --amend -m "$msg" --allow-empty-message 2>/dev/null

done

# Return to master
git checkout master

echo "Cleanup completed. Review changes and force push if satisfied."
echo "Backup branch 'backup-before-clean' created for safety."