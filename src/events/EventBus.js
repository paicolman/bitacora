const eventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    // ...
  },
  remove(event, callback) {
    // ...
  },
};