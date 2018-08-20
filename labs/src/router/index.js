import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import LeovueCmpt from '@/components/LeovueCmpt'
import LabsLeoDialog from '@/components/LabsLeoDialog'
import LabsLeoLodop from '@/components/LabsLeoLodop'
import LabsLeoExport from '@/components/LabsLeoExport'
import LabsLeoImport from '@/components/LabsLeoImport'
import LabsLeoUpload from '@/components/LabsLeoUpload'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',  name: 'Index',  component: Index },
    { path: '/leovue-cmpt',  name: 'LeovueCmpt',  component: LeovueCmpt },
    { path: '/leo-dialog', name: 'LabsLeoDialog', component: LabsLeoDialog },
    { path: '/leo-lodop', name: 'LabsLeoLodop', component: LabsLeoLodop },
    { path: '/leo-export', name: 'LabsLeoExport', component: LabsLeoExport },
    { path: '/leo-import', name: 'LabsLeoImport', component: LabsLeoImport },
    { path: '/leo-upload', name: 'LabsLeoUpload', component: LabsLeoUpload }
  ]
})
