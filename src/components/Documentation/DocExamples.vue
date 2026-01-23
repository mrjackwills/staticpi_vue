<template>

	<DocumentationCard heading='Examples'>
		<template #doc-body>
			For examples and inspiration for projects utilizing the <StaticPi /> service, feel free to explore some of these projects
			<v-row v-for='(item, index) in examples' :key='index' class='ma-0 pa-0 mt-2'>
				<v-col class='ma-0 pa-0 mt-2' cols='12'>
					<a class='text-primary font-weight-bold' :href='item.href' rel='noopener noreferrer' target='_blank'>{{ item.title }}</a>: {{ item.description }}
				</v-col>
			</v-row>

		</template>
	</DocumentationCard>

</template>

<script setup lang='ts'>
const examples = [

	{
		title: 'leafcast',
		description: 'A website for a live plant camera feed',
		href: 'https://www.github.com/mrjackwills/leafcast_vue',
	},
	{
		title: 'leafcast backend',
		description: `The backend client for the camera feed's backend`,
		href: 'https://www.github.com/mrjackwills/leafcast_pi',
	},

	{
		title: 'belugasnooze',
		description: 'A website for a sunrise alarm clock',
		href: 'https://www.github.com/mrjackwills/belugasnooze_vue',
	},
	{
		title: 'belugasnooze backend',
		description: 'The backend client controlling the sunrise alarm clock',
		href: 'https://www.github.com/mrjackwills/belugasnooze_pi',
	},

	{
		title: 'flightbox',
		description: `A website for viewing live data from a home flight tracker`,
		href: 'https://www.github.com/mrjackwills/flightbox_vue',
	},

	{
		title: 'mealpedant_backup',
		description: `An automated, simple, backup client`,
		href: 'https://github.com/mrjackwills/mealpedant_backup_pi',
	},
]

</script>
