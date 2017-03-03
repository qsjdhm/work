<template>
	<div>
		<h2>About22</h2>
        <el-switch
            v-model="value2"
            on-color="#13ce66"
            off-color="#ff4949">
        </el-switch>
	</div>
</template>

<script>

    export default {
        data() {
        return {
                value2: true
            }
        }
    };
</script>

<style>
    .error {
        color: red;
    }
</style>
