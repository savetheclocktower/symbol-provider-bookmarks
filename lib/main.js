const { Disposable } = require('atom');
const BookmarksSymbolProvider = require('./bookmarks-symbol-provider');

module.exports = {
  activate () {
    this.provider = new BookmarksSymbolProvider();
  },

  deactivate () {
    this.provider?.destroy();
    this.provider = null;
  },

  consumeBookmarks (bookmarks) {
    this.bookmarks = bookmarks;
    if (this.provider) this.provider.setBookmarks(this.bookmarks);
    return new Disposable(() => {
      this.bookmarks = null;
      this.provider.setBookmarks(null);
    });
  },

  provideSymbols () {
    if (this.bookmarks) this.provider.setBookmarks(this.bookmarks);
    return this.provider;
  }
};
