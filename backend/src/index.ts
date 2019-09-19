import * as Koa from 'koa';
import Routes from './routes';

declare global {
    interface String {
        reverse(): string;
    }
}

if(!String.prototype.reverse){
    String.prototype.reverse = function() {
        return Array.prototype.reverse.apply(this.split('')).join('');
    }
}

const app = new Koa();

const PORT = process.env.PORT || 3001;

app.use(Routes);

app.listen(PORT);
