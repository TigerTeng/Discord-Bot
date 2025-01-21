// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
DISCORD_TOKEN = process.env.DISCORD_TOKEN;
CLIENT_ID = process.env.CLIENT_ID;
GUILD_ID = process.env.GUILD_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Read and Loand commands from directory
console.log("---------------------------------------");
console.log("Loading commands in directory");
console.log("---------------------------------------");

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) 
{
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) 
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) 
        {
            client.commands.set(command.data.name, command);
        } 
        else 
        {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
console.log("---------------------------------------");
console.log("Completed loading commands in directory");
console.log("---------------------------------------");

// Read and load event
console.log("---------------------------------------");
console.log("Loading events in directory");
console.log("---------------------------------------");

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

console.log("---------------------------------------");
console.log("Completed loading events in directory");
console.log("---------------------------------------");

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);

