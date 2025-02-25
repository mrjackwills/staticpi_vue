<template>
	<ThePage
		:justify='"center"'
		:fillHeight='true'
	>
		<template v-slot:body>
			<AppCard
				heading=''
				sm='12'
				md='12'
				lg='11'
				xl='11'
			>
				<template v-slot:body>

					<v-row justify='space-between'>
						<v-col cols='auto' class='mb-0 pb-0 text-h5 text-pi'>
							Terms & Conditions
						</v-col>
						<v-col cols='auto'>
							Last updated February 07, 2023
						</v-col>
					</v-row>

					<v-row>
						<v-col class='' cols='12' v-for='(item, index) in privacy' :key='index'>
							<v-row class='no-gutters py-0 my-0'>
								<v-col cols='12' class='font-weight-bold text-primary'>
									{{ zero_pad(index +1) }}. {{ item.title }}
								</v-col>
							</v-row>
							<v-row class='no-gutters my-0 py-0'>
								<v-col class='py-0 my-0' cols='12' v-for='(i, index) in item.cols' :key='index'>
									<span class=''>{{ i }}</span>
								</v-col>
							</v-row>
						</v-col>

					</v-row>
					<v-row >
						<v-col cols='12' class=''>
							<hr color='secondary'>
						</v-col>
					</v-row>
					<v-row justify='space-between'>
						<v-col cols='auto' class='mb-0 pb-0 text-h5 text-pi'>
							Privacy Policy
						</v-col>
						<v-col cols='auto'>
							Last updated February 07, 2023
						</v-col>
					</v-row>
					<v-row class='my-6' justify='center'>
						<v-col cols=''>
							This privacy notice for staticPi ('Company', 'we', 'us', or 'our'), describes how and why we might collect, store, use, and/or share ('process')
							your information when you use our services ('Services'), such as when you:
							<br>
							Visit our website at https://www.staticpi.com, or any website of ours that links to this privacy notice.
							<br>
							Engage with us in other related ways, including any sales, marketing, or events.
							<br>
							Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices.
							If you do not agree with our policies and practices, please do not use our Services.
							If you still have any questions or concerns, <router-link :to='FrontEndRoutes.CONTACT' target='_blank' class='ml-1 text-primary'>please contact us</router-link>
							<br><br>
							
							<v-row class='no-gutters'>
								<v-col cols='12' class='py-0 my-0'>
									<span class='font-weight-bold text-primary'>Summary</span>
								</v-col>

								<v-col class='py-0 my-0' cols='12' v-for='(item, index) in summary' :key='index'>
									{{ item }}
								</v-col>
							</v-row>

							<v-row>
								<v-col class='' cols='12' v-for='(item, index) in sections' :key='index'>
									<v-row class='no-gutters py-0 my-0'>
										<v-col cols='12' class='font-weight-bold text-primary'>
											{{ zero_pad(index +1) }}. {{ item.title }}
										</v-col>
									</v-row>
									<v-row class='no-gutters my-0 py-0'>
										<v-col class='py-0 my-0' cols='12' v-for='(i, index) in item.cols' :key='index'>
											{{ i }}
										</v-col>
									</v-row>
								</v-col>

							</v-row>
						</v-col>
					</v-row>
				
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
/* eslint-disable max-len */
import { FrontEndRoutes } from '@/types/const_routes';
import { zero_pad } from '@/vanillaTS/convert_seconds';

onMounted(() => {
	browserModule().set_description(`staticPi Terms & Conditions, and Privacy Policy`);
	browserModule().set_title(pageTitle);
});

const pageTitle = 'Terms & Conditions, Privacy Policy';

const privacy = [
	{
		title: 'Agreement',
		cols: [
			'These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and staticPi ("Company", “we”, “us”, or “our”), concerning your access to and use of the staticPi website, and service, as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”). You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.',
			'Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Use at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of these Terms of Use, and you waive any right to receive specific notice of each such change. Please ensure that you check the applicable Terms every time you use our Site so that you understand which Terms apply. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Use by your continued use of the Site after the date such revised Terms of Use are posted.',
			'The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Site from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.'
		]
	},
	{
		title: 'User representation',
		cols: [
			'By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Use; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose; and (5) your use of the Site will not violate any applicable law or regulation.',
			'If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).'
		]
	},
	{
		title: 'Prohibited activity',
		cols: [
			'You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.',
			'As a user of the Site, you agree not to:',
			'• Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.',
			'• Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
			'• Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.',
			'• Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.',
			'• Use any information obtained from the Site in order to harass, abuse, or harm another person.',
			'• Make improper use of our support services or submit false reports of abuse or misconduct.',
			'• Use the Site in a manner inconsistent with any applicable laws or regulations.',
			'• Engage in unauthorized framing of or linking to the Site.',
			'• Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site.',
			'• Attempt to impersonate another user or person or use the username of another user.',
			'• Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.',
			'• Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.',
			'• Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.',
			'• Use a buying agent or purchasing agent to make purchases on the Site.',
			'• Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.',
			'• Use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.'
		]
	},
	{
		title: 'Contact Submissions',
		cols: [
			'You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other information regarding the Site ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you. You hereby waive all moral rights to any such Submissions, and you hereby warrant that any such Submissions are original with you or that you have the right to submit such Submissions. You agree there shall be no recourse against us for any alleged or actual infringement or misappropriation of any proprietary right in your Submissions.'
		]
	},
	{
		title: 'Site management',
		cols: [
			'We reserve the right, but not the obligation, to: (1) monitor the Site for violations of these Terms of Use; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Use, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Site or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site.'
		]
	},
	{
		title: 'Term and termination',
		cols: [
			'These Terms of Use shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF USE OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SITE OR DELETE ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.',
			'If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.'
		]
	},
	{
		title: 'Modifications and interruptions',
		cols: [
			'We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.',
			'We cannot guarantee the Site will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Site, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Site at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site during any downtime or discontinuance of the Site. Nothing in these Terms of Use will be construed to obligate us to maintain and support the Site or to supply any corrections, updates, or releases in connection therewith.'
		]
	},
	{
		title: 'Corrections',
		cols: [
			'There may be information on the Site that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Site at any time, without prior notice.'
		]
	},
	{
		title: 'Disclaimer',
		cols: [
			'THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.'
		]
	},
	{
		title: 'Limitations of liability',
		cols: [
			'IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.'
		]
	},
	{
		title: 'Indemnification',
		cols: [
			'You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) use of the Site; (2) breach of these Terms of Use; (3) any breach of your representations and warranties set forth in these Terms of Use; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Site with whom you connected via the Site. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.'
		]
	},
	{
		title: 'User data',
		cols: [
			'We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.'
		]
	},
	{
		title: 'Electronic communications, transactions, and signatures',
		cols: [
			'Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.'
		]
	},
	{
		title: 'Miscellaneous',
		cols: [
			'These Terms of Use and any policies or operating rules posted by us on the Site or in respect to the Site constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms of Use shall not operate as a waiver of such right or provision. These Terms of Use operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Terms of Use is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Terms of Use and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Terms of Use or use of the Site. You agree that these Terms of Use will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Terms of Use and the lack of signing by the parties hereto to execute these Terms of Use.'
		]
	}

];

const summary = [
	'This summary provides key points from our privacy notice, but you can find out more information is available below.',
	'What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with staticPi and the Services, the choices you make, and the products and features you use.',
	'Do we process any sensitive personal information? We do not process sensitive personal information.',
	'Do we receive any information from third parties? We do not receive any information from third parties.',
	'How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.',
	'In what situations and with which parties do we share personal information? We may share information in specific situations and with specific third parties.',
	'How do we keep your information safe? We have organisational and technical processes and procedures in place to protect your personal information.',
	'However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals,',
	'or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.',
	'What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.',
	'How do you exercise your rights? The easiest way to exercise your rights is by filling out our data subject request form available at https://www.staticpi.com/user/settings, or by contacting us.',
	'We will consider and act upon any request in accordance with applicable data protection laws.'
];

const sections = [
	{
		title: 'What information do we collect',
		cols: [
			'Personal information you disclose to us',
			'In Short: We collect personal information that you provide to us.',
			'We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
			'Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:',
			'• name',
			'• email addresses',
			'• passwords',
			'• ip addresses',
			'• user agent',
			'Sensitive Information. We do not process sensitive information.',
			'All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.\''
		]

	},
	{
		title: 'How do we process your information',
		cols: [
			'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.',
			'We process your personal information for a variety of reasons, depending on how you interact with our Services, including:',
			'•To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.',
			'•To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.',
			'•To save or protect an individual\'s vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.'
		]
	},
	{
		title: 'What legal bases do we rely on to process your information',
		cols: [
			'In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfil our contractual obligations, to protect your rights, or to fulfil our legitimate business interests.',
			'If you are located in the EU or UK, this section applies to you.',
			'The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:',
			'• Consent. We may process your information if you have given us permission (i.e. consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Click here to learn more.',
			'• Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:',
			'• Diagnose problems and/or prevent fraudulent activities',
			'• Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.',
			'•	Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.',
			'In legal terms, we are generally the \'data controller\' under European data protection laws of the personal information described in this privacy notice, since we determine the means and/or purposes of the data processing we perform. This privacy notice does not apply to the personal information we process as a \'data processor\' on behalf of our customers. In those situations, the customer that we provide services to and with whom we have entered into a data processing agreement is the \'data controller\' responsible for your personal information, and we merely process your information on their behalf in accordance with your instructions. If you want to know more about our customers\' privacy practices, you should read their privacy policies and direct any questions you have to them.',
			'If you are located in Canada, this section applies to you.',
			'We may process your information if you have given us specific permission (i.e. express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e. implied consent). You can withdraw your consent at any time. Click here to learn more.',
			'In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:',
			'• If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way',
			'• For investigations and fraud detection and prevention',
			'• For business transactions provided certain conditions are met',
			'• If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim',
			'• For identifying injured, ill, or deceased persons and communicating with next of kin',
			'• If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse',
			'• If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province',
			'• If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records',
			'• If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced',
			'• If the collection is solely for journalistic, artistic, or literary purposes',
			'• If the information is publicly available and is specified by the regulations'
		]
	},
	{
		title: 'When and with whom do we share your personal information',
		cols: [
			'In Short: We may share information in specific situations described in this section and/or with the following third parties.',
			'We may need to share your personal information in the following situations:',
			'• Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.'
		]
	},
	{
		title: 'How long do we keep your information',
		cols: [
			'In Short: We keep your information for as long as necessary to fulfil the purposes outlined in this privacy notice unless otherwise required by law.',
			'We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.',
			'When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.'

		]
	},
	{
		title: 'How do we keep your information safe',
		cols: [
			'In Short: We aim to protect your personal information through a system of organisational and technical security measures.',
			'We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.'
		]
	},
	{
		title:	'do we collect information from minors',
		cols: [
			'In Short: We do not knowingly collect data from or market to children under 18 years of age.',
			'We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at terms@staticpi.com.'
		]
	},
	{
		title: 'What are your privacy rights',
		cols: [
			'In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.',
			'In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "How can you contact us about this notice?" below.',
			'We will consider and act upon any request in accordance with applicable data protection laws.',
			'If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm',
			'If you are located in Switzerland, the contact details for the data protection authorities are available here: https://www.edoeb.admin.ch/edoeb/en/home.html.',
			'Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "How can you contact us about this notice?" below.',
			'However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.',
			'Account Information',
			'If you would at any time like to review or change the information in your account or terminate your account, you can:',
			'Log in to your account settings and update your user account.',
			'Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.',
			'If you have questions or comments about your privacy rights, you may email us at terms@staticpi.com.'
		]
	},
	{
		title: 'Controls for do-not-track features',
		cols: [
			'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.'
		]
	},
	
	{
		title: 'Do we make updates to this notice?',
		cols: [
			'In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.',
			'We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.'
		]
	},
	{
		title: 'How can you contact us about this notice?',
		cols: [ 'If you have questions or comments about this notice, you may contact us by email at terms@staticpi.com' ]
	},
	{
		title: 'How can you review, update, or delete the data we collect from you?',
		cols: [
			'You have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please visit: http://www.staticpi.com/user/settings'
		]
	}

];

</script>