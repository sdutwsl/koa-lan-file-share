const serve = require('koa-static');
const Koa = require('koa');
const mount = require("koa-mount");
const Router = require('koa-router');
const app = new Koa();


const router = new Router();
//route
router.get('/ListDir', (ctx, next) => {
    // ctx.router available
    ctx.request.query.dir
});
//Static file path
app.use(mount("/public", serve("./public"))).use(router.routes());

app.listen(3000)

console.log('listening on port 3000');