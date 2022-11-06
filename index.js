
import { rewriteRouter } from './rewrite-router'
import { handleRouter } from './handle-router'


// {name, activeRule, entry, container, bootscript, mount}
const _apps = []
export const getApps = () => _apps

export default registerMicroApps = (apps) => {
  _apps = apps
}



export const start = () => {
  // 原理 
  // 1、监视路由变化 
  // 2、匹配子应用 
  // 3、加载子应用 
  // 4、渲染子应用
  rewriteRouter()

  // 首次或刷新加载
  handleRouter()
} 