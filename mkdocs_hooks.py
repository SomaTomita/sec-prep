import re

# markdown 属性の無い <details> にだけ markdown="1" を注入する
_DETAILS = re.compile(r'<details(?![^>]*\bmarkdown\b)([^>]*)>')


def on_page_markdown(markdown, *, page, config, files):
    """<details> 内の演習解答を Markdown として描画させる（md_in_html と併用）。"""
    return _DETAILS.sub(r'<details markdown="1"\1>', markdown)
