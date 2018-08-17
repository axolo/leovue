import LeoDialog from './components/LeoDialog'
import LeoLodop from './components/LeoLodop'

const components = [
  LeoDialog,
  LeoLodop
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
  LeoLodop
}
