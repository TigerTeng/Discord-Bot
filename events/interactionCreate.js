const { Events, MessageFlags } = require('discord.js');
const { request } = require('undici');

require('dotenv').config();
API_KEY = process.env.API_KEY;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (interaction.commandName === 'summoner-stats')
                {
                    const ign = interaction.options.getString('ign');
                    const tag = interaction.options.getString('tagline');
                    const ign_search = ign.replace(/ /g,"%20");
                    const tag_search = tag.replace(/ /g,"%20");
                    const accountRaw = await request(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${ign_search}/${tag_search}?api_key=${API_KEY}`);
                    const accountPuuid = await accountRaw.body.json();
                    if (accountPuuid.status !== undefined)
                    {
                        await interaction.reply(accountPuuid.status.message);
                        return;
                    }
                    else
                    {
                        const puuid = accountPuuid.puuid;
                        const summonerLevelRaw = await request(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}/?api_key=${API_KEY}`);
                        const summonerLevelJSON = await summonerLevelRaw.body.json();
                        const summonerLevel = summonerLevelJSON.summonerLevel;
                        await interaction.reply(`Your summoner level is **${summonerLevel}**`);
                        return;
                    }
                }
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};
