const serve = require('koa-static');
const Koa = require('koa');
const mount = require("koa-mount");
const Router = require('koa-router');

const fs = require('fs');
const path = require('path');
const app = new Koa();
const router = new Router();


const root = { name: path.resolve(__dirname, "public"), dir: true, subs: [] }


const walkDir = dir => {
    //获取目录下所有文件
    let innerFiles = fs.readdirSync(dir.name, { withFileTypes: true })
    dir.subs = []

    for (let f in innerFiles) {
        // console.log(innerFiles[f])
        if (innerFiles[f].isDirectory()) {
            let sub = { name: path.resolve(dir.name, innerFiles[f].name), dir: true, subs: [] }
            dir.subs.push(sub)
            walkDir(sub)
        }
        else {
            dir.subs.push({ name: path.resolve(dir.name, innerFiles[f].name), dir: false })
        }
    }
    //将绝对路径改为相对路径
    let abs2rel = f => {
        names = f.name.split(path.sep)
        f.name = names[names.length - 1]
        if (f.dir) {
            for(let s in f.subs) {
                abs2rel(f.subs[s])
            }
        }
        return f
    }
    dir = abs2rel(dir)
    return dir
}




//route
router.get('/ListFiles', (ctx) => {
    // ctx.router available
    ctx.response.body = walkDir(root)
});

//Static file path
app.use(mount("/public", serve(root.name))).use(router.routes());

app.listen(3000)

console.log('listening on port 3000');