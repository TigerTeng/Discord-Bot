const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ily')
		.setDescription('I love you :D')
        .addUserOption(option =>
            option
                .setName('username')
                .setDescription('The user you love')
                .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.reply(`${interaction.user.username} loves you ${interaction.options.getUser('username')} <3`);
	},
};