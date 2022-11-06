import {importHtml} from './import-html'
import {getPrevRoute, getNextRoute} from './rewrite-router'
import {getApps} from './index'

// 处理路由的变化

export const handleRouter = async () => {
  const apps = getApps();

  // 加载之前先验证是否已经存在子应用
  const prevApp = apps.find(item => getPrevRoute().startsWith(item.activeRule))
  const app = apps.find(item => getNextRoute().startsWith(item.activeRule))

  // 存在旧的子程序，先卸载
  if(prevApp) await unmount(prevApp)


  // 2、匹配子应用
  if(!app) return

  // 3、加载子应用
  // 3.1 获取子应用的资源：HTML、CSS、JS（ 子应用脚本不能直接插入主程序需要处理 ）
  const container = document.querySelector(app.container)
  const {template, execScripts} = await importHtml(app.entry)
  container.appendChild(template)


  // 配置全局变量，避免子应用挂载到自己的 app 上，然后让主程序去挂载
  window.__POWERED_BY_QIANKUN__ = true

  // 给子应用设置静态资源的公共路径，主程序中可以访问到
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN = app.entry

  // 获取当前子应用被打包出来的 libirary
  const appExports = execScripts()
  app.bootstrap = appExports.bootstrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount


  // 最后挂载子应用
  await bootstrap(app)
  await mount(app)
  // await unmount(app)
}



async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap())
}
async function mount(app) {
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }))
}
async function unmount(app) {
  app.unmount && (await app.unmount())
}
