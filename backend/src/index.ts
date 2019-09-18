import * as Koa from 'koa';
import Routes from './routes';

const app = new Koa();

const PORT = process.env.PORT || 3001;

app.use(Routes);

app.listen(PORT);
