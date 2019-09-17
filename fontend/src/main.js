import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false; // 不显示启动时生成的生产提示
Vue.config.devtools = true;

const hooksPlugin = {
    install(Vue, options) {
        const win = window;
        const defer = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.setTimeout;
    
        let onResize = [];
    
        let ticking  = false;
    
        window.addEventListener('resize', (e) => {
            if(!ticking) {
                defer(()=>{
                    onResize.map(obj => {
                        obj.func.call(obj.self, e);
                    });
                    ticking = false;
                });
            }
            ticking = true;
        });
    
        Vue.mixin({
            beforeCreate() {
                {
                    let resize = this.$options.resize;
    
                    'function'===typeof(resize) && onResize.push({
                        _uid: this._uid,
                        self: this,
                        func: resize
                    });
                };
            },
    
            destroyed() {
                {
                    onResize = onResize.filter(resize => resize._uid !== this._uid);
                };
            }
        });
    }
};

Vue.use(hooksPlugin);

new Vue({
    el: '#App',
    router,
    template: '<App/>',
    components: {
        App
    }
});
