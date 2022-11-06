import {fetchResource} from './fetch-resource'

export const importHtml = async (url) => {
  const html = await fetchResource(url)
  const template = document.createElement('div')
  template.innerHTML = html


  // 获取应用所有script标签
  const scripts = template.querySelector('script')


  // 递归获取 script 标签里的内容
  function getExternalScripts (){
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('scr')
      if(!src){
        // 文档内单纯的script
        return Promise.resolve(script.innerHTML)
      }else{
        // 外链的script
        return fetchResource(
          src.startsWith('http') ?  src : `${url}${src}`
        )
      }
    }))
  }


  // 执行 scripts 脚本：使用 eval 函数执行script脚本
  async function execScripts (){
    const scripts = await getExternalScripts()

    // 1、由于子程序，打包出的是 UMD 格式的libriry库（兼容esm、commonjs、AMD）
    // 2、为了获取当前的子应用，手动构造 commonjs 环境 (libriry库的判断依据：module、exports)
    const module = {exports:{}}
    const exports = module.exports

    // 使用eval执行js脚本
    scripts.map(code => {
      eval(code)
    })

    // 获取子应用（ commonjs格式 ）
    return module.exports
  }

  return {
    template, 
    execScripts
  } 
}