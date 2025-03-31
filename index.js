const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const axios = require('axios');
const BonkBot = require('./bonkbot');

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

let bot = null;

let gamesList = [];
const title = '실시간 Bonk 방 목록';

client.on('ready', async () => {
    const channels = client.channels.cache.filter(ch => ch.name.includes('실시간'));
    if(channels.size > 0) {
        for(const channel of channels.values()) {
            let messages = await channel.messages.fetch({ limit: 3 });
            let existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);

            if (!existingMessage) {
                channel.send({ embeds: [createEmbed()] })
                messages = await channel.messages.fetch({ limit: 3 });
                existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);
            }

            setInterval(async () => {
                channel.send({ embeds: [createEmbed()] });
                messages = await channel.messages.fetch({ limit: 3 });
                existingMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === title);
            }, 1000 * 60 * 60 * 5);

            setInterval(async () => {
                existingMessage.edit({ embeds: [createEmbed()] });
            }, 1000 * 20);
        }

        setInterval(async () => {
            const allRooms = await getRooms();
            gamesList = allRooms.filter(room => room.country == 'KR');
        }, 1000*30);

        setInterval(async () => {
            try {
                const allRooms = await getRooms();
                gamesList = allRooms.filter(room => room.country == 'KR');
                await updatePlayers();
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        }, 1000*60*3);
    }
});

async function updatePlayers() {
    if(gamesList.length > 0) {
        for (let i = 0; i < gamesList.length; i++) {
            const room = gamesList[i];
            if (room.players < room.maxplayers && room.password == 0) {
            await getRoomData(room);
            await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
}

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
            let usersString = game.users ? `\n${game.users}` : '';
            embed.addFields({
                name: game.roomname + ` (${formatGamemode(game.mode_ga)})` + (game.password == 1 ? ' (잠김)' : ''),
                value: `Player **${game.players}/${game.maxplayers}**`+usersString,
                inline: false
            });
        });

    return embed;
}

async function getRoomData(room) {
    bot = BonkBot.createBot({
        account: {
            username: "Gemini",
            password: "",
            guest: true,
        },
        skin: `{"id":76,"scale":0.04285714402794838,"angle":0,"x":-5.142857074737549,"y":5.099999904632568,"flipX":false,"flipY":false,"color":5606191},{"id":85,"scale":0.09095136821269989,"angle":-0.20369121432304382,"x":8.057143211364746,"y":-1.8428571224212646,"flipX":false,"flipY":false,"color":0},{"id":85,"scale":0.09149999916553497,"angle":-0.2419230341911316,"x":-1.8428571224212646,"y":-1.6714285612106323,"flipX":false,"flipY":false,"color":0},{"id":72,"scale":0.07770431041717529,"angle":89.43303680419922,"x":5.699999809265137,"y":-1.8428571224212646,"flipX":false,"flipY":false,"color":16448250},{"id":72,"scale":0.07570995390415192,"angle":89.24301147460938,"x":-4.157142639160156,"y":-1.6714285612106323,"flipX":false,"flipY":false,"color":16448250},{"id":75,"scale":0.15073302388191223,"angle":89.48831176757812,"x":1.9285714626312256,"y":4.842857360839844,"flipX":false,"flipY":false,"color":10836790},{"id":75,"scale":0.3474140167236328,"angle":89.55939483642578,"x":-10.928571701049805,"y":13.114285469055176,"flipX":false,"flipY":false,"color":410109},{"id":75,"scale":0.2138778269290924,"angle":88.95581817626953,"x":-1.2857142686843872,"y":2.7857143878936768,"flipX":false,"flipY":false,"color":5606191},{"id":76,"scale":0.06719996780157089,"angle":-1.0120599269866943,"x":10.5,"y":-3.557142972946167,"flipX":false,"flipY":false,"color":5606191},{"id":76,"scale":0.09333346039056778,"angle":-0.84217768907547,"x":6.085714340209961,"y":-5.657142639160156,"flipX":false,"flipY":false,"color":5606191},{"id":76,"scale":0.0926438570022583,"angle":-0.9198663830757141,"x":-3.9000000953674316,"y":-5.5714287757873535,"flipX":false,"flipY":false,"color":5606191},{"id":72,"scale":0.1974431723356247,"angle":89.34436798095703,"x":-0.5142857432365417,"y":-2.8714284896850586,"flipX":false,"flipY":false,"color":5606191},{"id":76,"scale":0.10280731320381165,"angle":-1.2803078889846802,"x":-9.899999618530273,"y":1.7571429014205933,"flipX":false,"flipY":false,"color":5606191},{"id":75,"scale":0.40840944647789,"angle":89.5798568725586,"x":-14.057143211364746,"y":7.285714149475098,"flipX":false,"flipY":false,"color":5606191},{"id":13,"scale":1.1610832214355469,"angle":-0.4676530063152313,"x":0,"y":0,"flipX":false,"flipY":false,"color":16777215}`,
        basecolor: 3426653,
    });
    bot.events.on("connect", () => {
        bot.events.on("packet", async (packet) => { 
            bot.autoHandlePacket(packet)

            if (packet.type == "timesync") return;
            if (packet.type == "ping") return;
        });

        bot.events.on("roomjoin", async () =>{
            const existingRoom = gamesList.find(g => g.roomname === room.roomname);
            if (existingRoom) {
                existingRoom.users = bot.game.players.filter(player => player.here && player.username).map(player => player.username);
                //console.log(gamesList.find(g => g.roomname === room.roomname));
            }
            bot.disconnect();
        })
    })
    connect(room)
}

async function connect(room) {
    const addr = await bot.getRoomAddress(room.id) 

    let serv = {}
    serv.roomname = room.roomname;
    serv.address = addr.address;
    serv.server = addr.server;
    serv.passbypass = "";

    bot.setAddress(serv)
    bot.connect();
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