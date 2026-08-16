import re
from typing import Any

# markdown 属性の無い <details> にだけ markdown="1" を注入する
_DETAILS = re.compile(r'<details(?![^>]*\bmarkdown\b)([^>]*)>')

# courses/ 配下は topics/ の外にあり、リポジトリ上の相対リンクは `../../topics/...` になる。
# ビルド時は topics/courses シンボリックリンク経由で docs_dir の中に入るため、
# docs ルート＝topics/ となり `topics/` の一段ぶんが余る。ここで落として両立させる。
# （GitHub 上のファイル表示ではリンクをそのまま使いたいので、原文は書き換えない）
_COURSE_TOPICS_LINK = re.compile(r'\]\(((?:\.\./)+)topics/')


def on_page_markdown(markdown: str, *, page: Any, config: Any, files: Any) -> str:
    """<details> 内の解答を Markdown として描画させ、courses/ のリンクをサイト用に補正する。"""
    markdown = _DETAILS.sub(r'<details markdown="1"\1>', markdown)
    if page.file.src_uri.startswith('courses/'):
        markdown = _COURSE_TOPICS_LINK.sub(r'](\1', markdown)
    return markdown
