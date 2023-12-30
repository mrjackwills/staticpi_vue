<template>
	<section v-if='logUpdates.length > 0' >
		<v-table v-if='logUpdates.length > 0' >
			<template v-slot:default>
				<tbody>
					<tr v-for='(item, index) in logUpdates' :key='index' >
						<td class='text-left' :class='item.status? "text-primary" : "text-error"'>
							<span class='font-weight-bold'>{{ item.time }} {{ item.server }}</span>
							<br>
							<span class='text-black' >{{ item.message }}</span>
						</td>
					</tr>
				</tbody>
			</template>
		</v-table>
	</section>

	<section v-else>
		<span class='font-weight-bold'> nothing to report</span>
	</section>
</template>

<script setup lang="ts">
import type { TUpdate } from '@/types';

const logUpdates: Ref<Array<TUpdate>> = ref([]);

</script>