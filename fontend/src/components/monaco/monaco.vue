<template>
    <div class="editor" ref="editor" :data-content="content"></div>
</template>

<script>
    import MonacoRequire from 'monaco-require';

    export default {
        props: {
            lang: {
                type: String,
                default: 'javascript'
            },
            minimap: {
                type: Object,
                default: ()=>{
                    return {
                        enabled: false
                    }
                }
            },
            readOnly: {
                type: Object,
                default: false
            },
            value: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                monaco: null,
                editor: null,
            };
        },

        methods: {
            layout() {
                this.$nextTick(()=>{
                    this.editor && this.editor.layout();
                });
            },
            loadMonaco() {
                return new Promise((resolve, reject) => {
                    MonacoRequire.config({ paths: { 'vs': '/static/monaco-editor/0.18.0/min/vs' }});
                    MonacoRequire(['vs/editor/editor.main'], () => {
                        resolve(window.monaco);
                    });
                });
            },
            async init() {
                this.monaco = await this.loadMonaco();

                this.editor = this.monaco.editor.create(this.$refs.editor, {
                    language: this.language,
                    minimap: this.minimap,
                    readOnly: this.readOnly,
                    value: this.value,
                });

                // 监听编辑器的输入事件
                this.editor.onDidChangeModelContent(() => {
                    let value = this.editor.getValue();
                    this.$emit('input', value);
                });

                this.editor.onDidBlurEditorText(() => {
                    let value = this.editor.getValue();
                    this.$emit('blur', value);
                });
            }
        },

        computed: {
            content() {
                this.$nextTick(()=>{
                    this.editor && this.editor.setValue(this.value);
                });
                return this.value;
            }
        },

        mounted() {
            this.init();
        },

        beforeDestroy() {
            this.editor && this.editor.dispose();
        },

        resize(e) {
            this.layout();
        },
    }
</script>

<style lang="scss" scoped>
    .editor {
        width: 100%;
        height: 100%;
    }
</style>
