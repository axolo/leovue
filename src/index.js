import LeoDialog from './components/LeoDialog'
import LeoLodop from './components/LeoLodop'
import LeoExport from './components/LeoExport'
import LeoImport from './components/LeoImport'

const components = [
  LeoDialog,
  LeoLodop,
  LeoExport,
  LeoImport
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}


export {
  LeoDialog,
  LeoLodop,
  LeoExport,
  LeoImport
}
