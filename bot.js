require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`✅ Bot eingeloggt als ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const links = message.content.match(/https?:\/\/[\w./-]+/g);
    if (links) {
        for (const link of links) {
            console.log(`📡 Sende Link an n8n: ${link}`);
            try {
                await axios.post(N8N_WEBHOOK_URL, {
                    link: link,
                    user: message.author.username
                });
                console.log(`✅ Link erfolgreich an n8n gesendet: ${link}`);
            } catch (error) {
                console.error('❌ Fehler beim Senden an n8n:', error.message);
            }
        }
    }
});

client.login(DISCORD_BOT_TOKEN);
