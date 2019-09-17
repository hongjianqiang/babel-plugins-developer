import Vue from 'vue';
import VueRouter from 'vue-router';

const routes = [{ 
    path: '/', 
    component: ()=>import('@/components/index.vue')
}, {
    path: '/index', 
    component: ()=>import('@/components/index.vue')
}];

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes
});

export default router;
