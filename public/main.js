  //服务端地址
  const server_url = "http://localhost:3000"
  //服务端文件夹树
  let server_dirs = null

  //获取浏览器路径
  const get_hash_dirs = () => {
      let dirs = window.location.hash.substr(1, window.location.hash.length).split("/")
      //多输入了/的情况
      for (let d = 0; d < dirs.length; d++) {
          if (dirs[d] === "") {
              dirs.splice(d, 1)
              d--
          }
      }
      return dirs
  }

  //根据浏览器的文件夹获取服务器的文件夹及子文件
  const get_current_dir = (server_dir, dirs) => {
      let not_found = false
      for (let dir in dirs) {
          let aim_dir = server_dir.subs.find(d => d.name === dirs[dir])
          if (aim_dir) {
              server_dir = aim_dir
              continue
          } else {
              not_found = true
              break
          }
      }
      if (!not_found) {
          return server_dir
      } else {
          return undefined
      }
  }

  //绑定hash改变事件
  window.onhashchange = () => {
      let current_dir = get_current_dir(server_dirs, get_hash_dirs())
      //服务端没有输入的文件夹
      if (!current_dir) {
          console.log("Not Found!")
      } else {
          render_lists(current_dir)
      }
  }

  //将文件夹渲染到列表上
  const render_lists = dir => {
      //修改标题
      document.title = dir.name
      //清空列表
      let explorer = document.querySelector("#Explorer")
      explorer.innerHTML = ""
      //插入新节点
      let t = document.querySelector("#FileItem")
      let a = t.content.querySelector("#FileName")
      let s = t.content.querySelector("#FileType")
      let svg_dir = t.content.querySelector("#SvgDir")
      let svg_file = t.content.querySelector("#SvgFile")
      //不是根目录添加返回上级
      if (window.location.hash !== "") {
          a.innerText = ".."
          let hash = window.location.hash
          let macher = new RegExp("/+" + dir.name)
          hash = hash.replace(macher, '')
          a.removeAttribute("download")
          a.setAttribute('href', hash)
          s.innerText = "dir"
          svg_dir.setAttribute("style", "display:inline;")
          svg_file.setAttribute("style", "display:none;")
          let clone = document.importNode(t.content, true)
          explorer.appendChild(clone)
      }
      dir.subs.forEach(element => {
          a.innerText = element.name
          if (element.dir) {
              a.href = window.location + "/" + element.name
              a.removeAttribute("download")
              s.innerText = "dir"
              svg_dir.setAttribute("style", "display:inline;")
              svg_file.setAttribute("style", "display:none;")
          } else {
              let href = window.location.toString().replace("#", "/") + "/" + element.name
              //各种/////换成/
              href = href.replace(/\/+/g, "/")
              //去掉f**king http(s)
              a.setAttribute("href", "/" + href.replace(/https?:/, ""))
              a.setAttribute("download", element.name)
              s.innerText = "file"
              svg_dir.setAttribute("style", "display:none;")
              svg_file.setAttribute("style", "display:file;")
          }
          let clone = document.importNode(t.content, true)
          explorer.appendChild(clone)
          return true
      });
  }
  //获取服务端文件树
  fetch(server_url + "/ListFiles").then(res => {
      if (res.status == 200) {
          res.json().then(obj => {
              server_dirs = obj
              //触发一次渲染
              window.onhashchange()
              //如果没有# 则加上 否则点击链接就会生成错误的地址
              if (window.location.href.toString().indexOf("#") === -1)
                  window.location.href = window.location.href + "#"
          })
      }
  })