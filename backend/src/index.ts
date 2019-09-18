import * as Koa from 'koa';
import routes from './routes';

const app = new Koa();

const PORT = process.env.PORT || 3001;

app.use(routes);

app.listen(PORT);
