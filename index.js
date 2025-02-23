const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const axios = require('axios');


const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});

client.once(Events.ClientReady, readyClient => {
console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => {
    
})

let gamesList = [];


client.on('ready', async () => {
    const channel = client.channels.cache.find(ch => ch.name.includes('실시간'));
    if (!channel) return console.error('Channel not found');

    const messages = await channel.messages.fetch({ limit: 10 });
    let existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === '실시간 축구 방 목록');

    if (!existingMessage) {
        existingMessage = channel.send({ embeds: [createEmbed()] })
    }

    setInterval(async () => {
        const allRooms = await getRooms();
        //console.log(allRooms)
        gamesList = allRooms.filter(room => room.country == 'KR' && room.mode_ga == 'f');

        existingMessage.edit({ embeds: [createEmbed()] });
    }, 1000*5);
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
        .setTitle('실시간 축구 방 목록')
        .setDescription('실시간 한국 축구 방 목록을 나타냅니다')
        .setTimestamp();

    gamesList.forEach(game => {
        embed.addFields({ 
            name: game.roomname+(game.password == 1 ? ' (locked)' : ''), 
            value: `Player **${game.players}/${game.maxplayers}**`, 
            inline: false 
        });
    });

    return embed;
}

client.login(token);