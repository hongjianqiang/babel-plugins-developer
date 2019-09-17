<template>
    <v-layout>
        <el-tabs type="border-card" slot="left" class="tabs">
            <el-tab-pane label="代码">
                <v-monaco></v-monaco>
            </el-tab-pane>
            <el-tab-pane label="AST">
                <v-monaco></v-monaco>
            </el-tab-pane>
        </el-tabs>

        <el-tabs type="border-card" slot="right" class="tabs">
            <el-tab-pane label="代码">
                <v-monaco></v-monaco>
            </el-tab-pane>
            <el-tab-pane label="AST">
                <v-monaco></v-monaco>
            </el-tab-pane>
        </el-tabs>
    </v-layout>
</template>

<script>
    import { Tabs, TabPane } from 'element-ui';

    export default {
        components: {
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
            'v-layout': ()=>import('./layout/layout.vue'),
            'v-monaco': ()=>import('./monaco/monaco.vue'),
        }
    }
</script>

<style lang="scss" scoped>
    .tabs {
        height: 100%;
        
        /deep/ {
            .el-tabs__item.is-active {
                border-bottom-color: #DCDFE6;
            }
            .el-tabs__content {
                padding: 0;
                height: 100%;
                position: relative;
            }
            .el-tab-pane {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
        } 
    }
</style>