#!/bin/bash
# courses/ 配下 Markdown のフォーマット検証(講義ノート版)
# usage: tools/check-course-format.sh <file.md|dir> ...
# 検証: 200行上限 / ナビ行(> 親:) / ## 問題 + <details> / 相対リンク切れ
set -u
FAIL=0
err() { echo "  FAIL: $1"; FAIL=1; }

check_file() {
  local f="$1" base dir lines link
  base=$(basename "$f"); dir=$(dirname "$f")
  echo "== $f"
  lines=$(wc -l < "$f")
  [ "$lines" -le 200 ] || err "200行超過 (${lines}行) — 分割が必要"
  if [ "$base" != "README.md" ]; then
    head -5 "$f" | grep -q '^> 親:' || err "ナビ行(> 親: ...)が先頭5行にない"
    grep -q '^## 問題' "$f" || err "「## 問題」セクションがない"
    grep -q '<details>' "$f" || err "問題の <details> 解答がない"
  fi
  while IFS= read -r link; do
    [ -e "$dir/$link" ] || err "リンク切れ: $link"
  done < <(grep -oE '\]\((\./|\.\./)[^)#]+' "$f" | sed 's/^](//' | sort -u)
}

for target in "$@"; do
  if [ -d "$target" ]; then
    while IFS= read -r f; do check_file "$f"; done < <(find "$target" -name '*.md' | sort)
  else
    check_file "$target"
  fi
done

[ "$FAIL" -eq 0 ] && echo "OK: all checks passed"
exit "$FAIL"
