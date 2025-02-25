const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const axios = require('axios');


const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});
 
client.once(Events.ClientReady, readyClient => {
console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => {
    
})

let gamesList = [];
const title = '실시간 방 목록';

client.on('ready', async () => {
    const channel = client.channels.cache.find(ch => ch.name.includes('실시간'));
    if (!channel) return console.error('Channel not found');

    const messages = await channel.messages.fetch({ limit: 30 });
    let existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);

    if (!existingMessage) {
        channel.send({ embeds: [createEmbed()] })
        messages = await channel.messages.fetch({ limit: 3 });
        existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);
    }

    setInterval(async () => {
        const allRooms = await getRooms();
        //console.log(allRooms)
        gamesList = allRooms.filter(room => room.country == 'KR');

        existingMessage.edit({ embeds: [createEmbed()] });
    }, 1000*15);

    setInterval(async () => {
        channel.send({ embeds: [createEmbed()] });
        messages = await channel.messages.fetch({ limit: 3 });
        existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);
    }, 1000 * 60 * 60 * 5);
});

 async function getRooms() {
    var url = "https://bonk2.io/scripts/getrooms.php";
    var data = `version=49&gl=y&token=`;  
    return new Promise((resolve, reject) => {
        axios.post(url, data)
        .then(function (response) {
            var roomdata = response.data;
            resolve(roomdata.rooms);
        }).catch(function (error) {
            console.log(error);
        });
    });
}

function createEmbed() {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setDescription('실시간 방 목록을 나타냅니다')
        .setTimestamp();

        gamesList.forEach(game => {
            embed.addFields({
                name: game.roomname+` (${formatGamemode(game.mode_ga)})`+(game.password == 1 ? ' (잠김)' : ''),
                value: `Player **${game.players}/${game.maxplayers}**`,
                inline: false
            });
        });

    return embed;
}

function formatGamemode(gamemode) {
    switch(gamemode) {
        case 'f':
            return 'Football';
        case 'bs':
            return 'Simple';
        case 'ard':
            return 'Death Arrows';
        case 'ar':
            return 'Arrows';
        case 'sp':
            return 'Grapple';
        case 'v':
            return 'VTOL';
        case 'b':
            return 'Classic';
        default:
            return 'Unknown';
    }
}

client.login(token);