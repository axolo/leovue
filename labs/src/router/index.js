import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import LabsLeoDialog from '@/components/LabsLeoDialog'
import LabsLeoLodop from '@/components/LabsLeoLodop'
import LabsLeoExport from '@/components/LabsLeoExport'
import LabsLeoImport from '@/components/LabsLeoImport'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',  name: 'Index',  component: Index },
    { path: '/leo-dialog', name: 'LabsLeoDialog', component: LabsLeoDialog },
    { path: '/leo-lodop', name: 'LabsLeoLodop', component: LabsLeoLodop },
    { path: '/leo-export', name: 'LabsLeoExport', component: LabsLeoExport },
    { path: '/leo-import', name: 'LabsLeoImport', component: LabsLeoImport }
  ]
})
