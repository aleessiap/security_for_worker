<template>
    <div class="col-12 lg:col-6 xl:col-2">
        <router-link :to="{ name: routeName }">
            <div class="card p-3 hover:shadow-4 ">
                <img :src="imagePath" class="w-full border-round" />
                <div class="flex justify-content-between mt-3">
                    <div class="text-900 font-medium align-content-center text-xl">{{ name }}</div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi text-primary text-xl" :class="icon"></i>
                    </div>
                </div>  
            </div>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DashboardCard',
    props: {
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        imagePath: {
            type: String,
            required: true
        },
        routeName: {
            type: String,
            required: true
        }
    }
})
</script>