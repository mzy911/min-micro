
import {handleRouter} from './handle-router'


// 手动记录：上次加载过的路由
let prevRoute = ''
let nextRoute = window.location.pathname


export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute


// 监听路由的变化
//    hash路由：
//       window.onhashchange
//    history路由：
//       a、浏览器前进、后退、go、back、forward 触发 window.onpopstate 事件
//       b、pushState、replaceState 需要重写函数进行拦截
export const rewriteRouter = () => {

  // 1、监听hash值的变化（go、back、forward...）
  // 2、popstate触发的时候，此时路由已经完成的导航
  // 3、需要手动更新：prevRoute、nextRoute
  window.addEventListener('popstate', ()=>{
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })

  // 拦截路由变化(vue、react路由切换)
  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    console.log('监听到pushState变化');

    // 记录路由前后的变化
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    nextRoute = window.location.pathname

    handleRouter()
  }
  
  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    console.log('监听到replaceState变化');

    prevRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    nextRoute = window.location.pathname

    handleRouter()
  }

}