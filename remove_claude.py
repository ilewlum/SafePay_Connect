#!/usr/bin/env python3
import subprocess
import os
import tempfile

def clean_message(message):
    """Remove Claude mentions from commit message"""
    lines = message.split('\n')
    cleaned_lines = []

    for line in lines:
        # Skip lines with Claude mentions
        if '🤖 Generated with [Claude Code]' in line:
            continue
        if 'Co-Authored-By: Claude' in line:
            continue
        cleaned_lines.append(line)

    # Remove trailing empty lines
    while cleaned_lines and cleaned_lines[-1].strip() == '':
        cleaned_lines.pop()

    return '\n'.join(cleaned_lines)

def main():
    # Get commits with Claude mentions
    result = subprocess.run(['git', 'log', '--pretty=format:%H', '--grep=Claude'],
                          capture_output=True, text=True)
    commits = result.stdout.strip().split('\n')

    if not commits or commits == ['']:
        print("No commits with Claude mentions found.")
        return

    print(f"Found {len(commits)} commits with Claude mentions")

    # Process each commit from oldest to newest
    for commit in reversed(commits):
        # Get original commit message
        result = subprocess.run(['git', 'log', '-1', '--pretty=format:%B', commit],
                              capture_output=True, text=True)
        original_msg = result.stdout

        # Clean the message
        cleaned_msg = clean_message(original_msg)

        # Write cleaned message to temp file
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
            f.write(cleaned_msg)
            temp_file = f.name

        # Amend the commit with cleaned message
        cmd = f'git filter-branch --force --msg-filter "cat {temp_file}" {commit}^..{commit}'
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

        # Clean up temp file
        os.unlink(temp_file)

        if result.returncode != 0:
            print(f"Error processing commit {commit}: {result.stderr}")
        else:
            print(f"Cleaned commit {commit[:8]}")

    print("\nDone! Use 'git push --force origin master' to update remote.")

if __name__ == "__main__":
    main()