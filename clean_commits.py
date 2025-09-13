#!/usr/bin/env python3
import subprocess
import sys
import re

def get_commits_with_claude():
    """Get list of commits that mention Claude"""
    result = subprocess.run(['git', 'log', '--pretty=format:%H', '--grep=Claude'],
                          capture_output=True, text=True)
    return result.stdout.strip().split('\n') if result.stdout else []

def clean_commit_message(commit_hash):
    """Get commit message without Claude mentions"""
    # Get the original commit message
    result = subprocess.run(['git', 'log', '-1', '--pretty=format:%B', commit_hash],
                          capture_output=True, text=True)
    original_msg = result.stdout

    # Remove Claude mentions
    cleaned_msg = re.sub(r'\n*🤖 Generated with \[Claude Code\].*\n*', '', original_msg)
    cleaned_msg = re.sub(r'\n*Co-Authored-By: Claude.*\n*', '', cleaned_msg)
    cleaned_msg = cleaned_msg.strip()

    return cleaned_msg

def main():
    commits = get_commits_with_claude()

    if not commits or commits == ['']:
        print("No commits with Claude mentions found.")
        return

    print(f"Found {len(commits)} commits with Claude mentions")

    # Find the parent of the oldest commit with Claude
    oldest_commit = commits[-1]
    parent_result = subprocess.run(['git', 'rev-parse', f'{oldest_commit}^'],
                                 capture_output=True, text=True)
    parent_commit = parent_result.stdout.strip()

    print(f"Will rebase from commit: {parent_commit}")

    # Create a script for git filter-branch
    for commit in reversed(commits):
        cleaned_msg = clean_commit_message(commit)
        print(f"\nCommit {commit[:8]}:")
        print(f"Cleaned message:\n{cleaned_msg}\n")

    # Ask for confirmation
    response = input("Proceed with rewriting history? (yes/no): ")
    if response.lower() != 'yes':
        print("Aborted.")
        return

    # Use git filter-repo or filter-branch to clean messages
    print("\nRewriting commit history...")

    # Create a sed script to clean messages
    sed_script = r"sed -e '/🤖 Generated with \[Claude Code\]/d' -e '/Co-Authored-By: Claude/d'"

    cmd = f'git filter-branch --force --msg-filter "{sed_script}" HEAD~10..HEAD'

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.returncode == 0:
        print("Successfully cleaned commit messages!")
        print("\nTo push changes to remote, run:")
        print("git push --force origin master")
    else:
        print(f"Error: {result.stderr}")

if __name__ == "__main__":
    main()