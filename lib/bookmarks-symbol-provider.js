const { CompositeDisposable, Emitter } = require('atom');

const SUPPORTED_MODES = new Set(['file']);

class BookmarksSymbolProvider {
  constructor() {
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();
    this.packageName = 'symbol-provider-bookmarks';
    this.name = 'Bookmarks';
    this.watchedEditors = new WeakSet();
  }

  setBookmarks (bookmarks) {
    this.bookmarks = bookmarks;
  }

  destroy () {
    this.subscriptions.dispose();
    this.bookmarks = null;
  }

  onShouldClearCache(callback) {
    return this.emitter.on('should-clear-cache', callback);
  }

  canProvideSymbols (meta) {
    if (!this.bookmarks) return false;
    return SUPPORTED_MODES.has(meta.type);
  }

  getSymbols(meta) {
    if (!this.bookmarks) return [];
    let { editor } = meta;
    let bookmarksManager = this.bookmarks.getInstanceForEditor(editor);
    if (!this.watchedEditors.has(editor)) {
      this.watchedEditors.add(editor);
      this.subscriptions.add(
        bookmarksManager.onDidChangeBookmarks(() => {
          this.emitter.emit('should-clear-cache', editor);
        })
      );
    }
    let allBookmarksForEditor = bookmarksManager.getAllBookmarks();
    let results = this.makeSymbolsForBookmarks(allBookmarksForEditor, editor);
    return results;
  }

  makeSymbolsForBookmarks (bookmarks, editor) {
    let results = [];
    let buffer = editor.getBuffer();
    for (let bookmark of bookmarks) {
      let range = bookmark.getBufferRange();
      let nameRow = range.start.row - 1;
      let name = '';
      // The symbol's name should be the first non-blank line of text
      // represented in the range. In theory, we'd want to exclude any text
      // that falls outside the range, but if we did that, we'd never be able
      // to give a name to any bookmark that was created from an empty
      // selection (i.e., an ordinary cursor).
      while (!/\S/.test(name) && nameRow <= range.end.row) {
        nameRow++;
        name = buffer.lineForRow(nameRow);
      }
      name = `Bookmark: ${name.trim()}`;
      results.push({
        name,
        position: range.start,
        path: editor.getBuffer().getPath(),
        providerName: this.name,
        providerKey: this.packageName
      });
    }
    return results;
  }
}

module.exports = BookmarksSymbolProvider;
