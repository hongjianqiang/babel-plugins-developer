<template>
    <v-layout>
        <el-tabs type="border-card" slot="left" class="tabs" 
            v-model="activeLeftTab" 
            @tab-click="selectLeftTab"
        >
            <el-tab-pane label="代码" name="code">
                <v-monaco ref="leftCode" 
                    @input="onInput"
                ></v-monaco>
            </el-tab-pane>
            <el-tab-pane label="AST" name="ast">
                <v-monaco ref="leftAst"
                    :value="leftAst"
                    lang="json"
                ></v-monaco>
            </el-tab-pane>
        </el-tabs>

        <el-tabs type="border-card" slot="right" class="tabs" 
            v-model="activeRightTab" 
            @tab-click="selectRightTab"
        >
            <el-tab-pane label="代码" name="code">
                <v-monaco ref="rightCode"
                    :value="rightCode"
                ></v-monaco>
            </el-tab-pane>
            <el-tab-pane label="AST" name="ast">
                <v-monaco ref="rightAst"
                    :value="rightAst"
                ></v-monaco>
            </el-tab-pane>
        </el-tabs>
    </v-layout>
</template>

<script>
    import { Tabs, TabPane } from 'element-ui';

    import utils from '@/utils';

    export default {
        components: {
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
            'v-layout': ()=>import('./layout/layout.vue'),
            'v-monaco': ()=>import('./monaco/monaco.vue'),
        },

        data() {
            return {
                activeLeftTab: 'code',
                activeRightTab: 'code',

                leftAst: '',
                rightCode: '',
                rightAst: ''
            }
        },

        methods: {
            async onInput(val) {
                let res = await utils.fetch('/api/input/code', {
                    body: val,
                }).then((resp)=>resp.json());

                console.log(res);
                this.leftAst = res.data.inputAst;
                this.rightCode = res.data.outputCode;
                this.rightAst  = res.data.outputAst;
            },

            selectLeftTab({name} = e) {
                name = name[0].toUpperCase()+name.slice(1);
                this.$refs['left'+name].layout();
            },
            selectRightTab({name} = e) {
                name = name[0].toUpperCase()+name.slice(1);
                this.$refs['right'+name].layout();
            },
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
