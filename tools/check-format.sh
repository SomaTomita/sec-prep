#!/bin/bash
# topics/ 配下 Markdown のフォーマット検証
# usage: tools/check-format.sh <file.md|dir> ...
# 種別自動判定: index.md/README.md → map ／ 同階層に README.md → concept ／ それ以外 → flat
set -u
FAIL=0

err() { echo "  FAIL: $1"; FAIL=1; }

kind_of() {
  local base dir
  base=$(basename "$1"); dir=$(dirname "$1")
  if [ "$base" = "00_index.md" ] || [ "$base" = "README.md" ] || [ "$base" = "index.md" ]; then echo map
  elif [ "$(basename "$dir")" = "00_overview" ]; then echo map
  elif [ -f "$dir/README.md" ]; then echo concept
  else echo flat
  fi
}

check_file() {
  local f="$1" kind lines dir link base
  kind=$(kind_of "$f")
  base=$(basename "$f")
  echo "== $f ($kind)"

  lines=$(wc -l < "$f")
  [ "$lines" -le 200 ] || err "200行超過 (${lines}行) — 分割が必要"

  if [ "$base" != "index.md" ]; then
    head -5 "$f" | grep -q '^> .*層:' || err "ナビ行（> ... 層: ...）が先頭5行にない"
  fi

  if [ "$kind" = "concept" ] || [ "$kind" = "flat" ]; then
    grep -q '^## 演習' "$f" || err "「## 演習」セクションがない"
    grep -q '<details>' "$f" || err "演習の <details> 解答がない"
    grep -Eq '^## (次への接続|暗号での出口)' "$f" || err "「次への接続」がない"
  fi

  dir=$(dirname "$f")
  while IFS= read -r link; do
    [ -e "$dir/$link" ] && continue
    # 計画上まだ作成されていない領域への forward reference は許容する
    if echo "$link" | grep -Eq '/(02_cryptography|03_privacy|04_hardware-security|05_software-security|06_systems-security|07_legal|08_management-governance)/?$'; then
      echo "  NOTE: 未作成領域への forward reference（許容）: $link"
      continue
    fi
    err "リンク切れ: $link"
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
