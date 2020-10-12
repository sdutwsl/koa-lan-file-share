const serve = require('koa-static');
const Koa = require('koa');
const mount = require("koa-mount");
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const fs = require('fs');

const root = "./public/"

//route
router.get('/ListDir', (ctx, next) => {
    // ctx.router available
    let files = []
    innerFiles = fs.readdirSync(root+ctx.request.query.path, { withFileTypes: true })
    for (let f in innerFiles) {
        console.log(innerFiles[f].name)
        files.push({ name: innerFiles[f].name, dir: innerFiles[f].isDirectory() })
    }
    console.log(files)
    ctx.response.body = JSON.stringify(files)
});

//Static file path
app.use(mount("/public", serve(root))).use(router.routes());

app.listen(3000)

console.log('listening on port 3000');