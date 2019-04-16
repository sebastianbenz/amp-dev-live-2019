function defaultTask(cb) {
  require('./copyImages.js');
  cb();
}


exports.default = defaultTask
