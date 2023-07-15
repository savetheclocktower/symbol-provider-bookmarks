# symbol-provider-bookmarks package

Represents editor bookmarks as symbols in [symbols-view-plus](https://web.pulsar-edit.dev/packages/symbols-view-plus).

Each distinct bookmark will appear as its own symbol. The symbol’s name will begin with `Bookmark: ` and end with the entire line of text on the first non-empty row touched by the bookmark.

Keep in mind that a bookmark can span multiple lines and be represented by several icons in the editor gutter, but still be only one bookmark.

This is a “supplementary” provider and will contribute symbols for the command **Symbols View: Toggle File Symbols** in addition to whatever symbols may be suggested by other providers. It _will not_ currently suggest symbols for **Symbols View: Toggle Project Symbols**, but this could be added in the future. It also _will not_ try to contribute symbols to **Symbols View: Go To Declaration**.
