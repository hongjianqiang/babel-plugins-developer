<template>
    <div class="page">
        <div class="header">
            <slot name="header"></slot>
        </div>
        <div class="container">
            <div class="left">
                <slot name="left"></slot>
            </div>
            <div class="right">
                <slot name="right"></slot>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .page{
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .container {
            flex: 1;

            .left, .right {
                float: left;
                width: 50%;
                height: 100%;
            }
        }
    }
</style>