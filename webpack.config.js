module.exports = {
  entry: {
    init:"./dist/app/init.js"
  },
  output: {
    path:  "./dist/",
    filename: "rx.min.js",
    library: "rxjs",
    publicPath: '/'
  }
}
