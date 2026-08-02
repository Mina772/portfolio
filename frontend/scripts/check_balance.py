#!/usr/bin/env python3
"""Lightweight structural checker for JS/JSX files.

Strips strings (single, double, template) and comments, then verifies that
(), [] and {} are balanced. Catches the most common structural typos that a
bundler would reject. Not a full parser, but a useful smoke test when no
transpiler is available.
"""
import os
import sys

PAIRS = {')': '(', ']': '[', '}': '{'}
OPEN = set('([{')


def strip_and_check(code):
    i, n = 0, len(code)
    stack = []
    while i < n:
        c = code[i]
        nxt = code[i + 1] if i + 1 < n else ''
        # line comment
        if c == '/' and nxt == '/':
            while i < n and code[i] != '\n':
                i += 1
            continue
        # block comment
        if c == '/' and nxt == '*':
            i += 2
            while i < n - 1 and not (code[i] == '*' and code[i + 1] == '/'):
                i += 1
            i += 2
            continue
        # strings
        if c in ('"', "'", '`'):
            quote = c
            i += 1
            while i < n:
                if code[i] == '\\':
                    i += 2
                    continue
                if code[i] == quote:
                    break
                # template literals can nest ${ ... } with braces/strings,
                # but treating the whole literal as opaque is fine for balance.
                i += 1
            i += 1
            continue
        if c in OPEN:
            stack.append((c, i))
        elif c in PAIRS:
            if not stack or stack[-1][0] != PAIRS[c]:
                return (c, i)
            stack.pop()
        i += 1
    if stack:
        return ('EOF-unclosed ' + stack[-1][0], stack[-1][1])
    return None


def line_of(code, idx):
    return code.count('\n', 0, idx) + 1


def main(root):
    problems = 0
    for dirpath, _, files in os.walk(root):
        if 'node_modules' in dirpath:
            continue
        for f in files:
            if not f.endswith(('.js', '.jsx', '.mjs')):
                continue
            p = os.path.join(dirpath, f)
            with open(p, encoding='utf-8') as fh:
                code = fh.read()
            res = strip_and_check(code)
            if res:
                problems += 1
                sym, idx = res
                print(f"UNBALANCED {sym!r} at line {line_of(code, idx)} in {p}")
    print("All files structurally balanced." if problems == 0
          else f"{problems} file(s) with balance issues.")
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'src'))
