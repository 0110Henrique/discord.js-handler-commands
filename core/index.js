const fs = require('fs');
const { Client, Collection, Intents, MessageButton } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS",  "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS",] })

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`../commands/${file}`)
	client.commands.set(command.data.name, command)
}

client.once('ready', () => {
	client.user.setActivity('JavaScript', { type: 'PLAYING' })
	console.log(`Online no cliente ${client.user.tag}`)
})

client.on('messageCreate', message => {

	const commandName = message.content

	if(commandName === "hello"){
		message.reply("Hello Discord.Js!")
	}
	
})


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName)
	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
	}
})

client.login(token)
