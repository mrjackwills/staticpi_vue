
<template>

	<DocumentationCard heading='Examples' >
		<template v-slot:doc-body>
			For examples and inspiration for projects utilizing the <StaticPi /> service, please refer to the following GitHub repositories.
			<v-row v-for='(item, index) in examples' :key='index' class='ma-0 pa-0 mt-2'>
				<v-col cols='12' class='ma-0 pa-0 mt-2'>
					<a :href='item.href' target='_blank' rel='noopener noreferrer' class='text-primary font-weight-bold'>{{ item.title }}</a>: {{ item.description }}
				</v-col>
			</v-row>

		</template>
	</DocumentationCard>

</template>

<script setup lang='ts'>
import DocumentationCard from '@/components/Card/DocumentationCard.vue';
import StaticPi from '@/components/StaticPi.vue';

const examples = [
	{
		title: 'belugasnooze website',
		description: 'The frontend for a sunrise alarm clock',
		href: 'https://www.github.com/mrjackwills/belugasnooze_vue'
	},
	{
		title: 'belugasnooze backend',
		description: 'The backend client controlling the sunrise alarm clock',
		href: 'https://www.github.com/mrjackwills/belugasnooze_pi'
	},

	{
		title: 'leafcast website',
		description: 'The frontend for a live plant camera feed',
		href: 'https://www.github.com/mrjackwills/leafcast_vue'
	},
	{
		title: 'leafcast backend',
		description: `The client for the camera feed's backend`,
		href: 'https://www.github.com/mrjackwills/leafcast_pi'
	},

	{
		title: 'flightbox vue',
		description: `A PWA for viewing live data from a home flight tracker`,
		href: 'https://www.github.com/mrjackwills/flightbox_vue'
	},

	{
		title: 'mealpedant_backup',
		description: `An automated, simple, backup client`,
		href: 'https://github.com/mrjackwills/mealpedant_backup_pi'
	},
];

</script>