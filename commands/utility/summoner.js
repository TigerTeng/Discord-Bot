const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
require('dotenv').config();
API_KEY = process.env.API_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summoner-stats')
		.setDescription('Display your League of Legends stats')
        .addStringOption(option =>
            option
                .setName('ign')
                .setDescription('what comes before the #')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('tagline')
                .setDescription('what comes after the #')
                .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.deferReply();
        const ign = interaction.options.getString('ign');
        const tag = interaction.options.getString('tagline');
        const ign_search = ign.replace(/ /g,"%20");
        const tag_search = tag.replace(/ /g,"%20");
        const summonerResult = await request(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${ign_search}/${tag_search}?api_key=${API_KEY}`);
        const summonerStat = await summonerResult.body.json();

	},
};