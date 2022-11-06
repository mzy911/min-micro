// 通过入口，加载子应用的所有资源
export const fetchResource = (url) => fetch(url).then( res => res.text())
