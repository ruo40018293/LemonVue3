const print = {
  install(app) {
    app.config.globalProperties.$print = function(option) {
      console.log('Print function called with:', option)
    }
  }
}

export default print
