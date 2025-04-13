//
// BonkBot Framework
//  - Version: 3.0.0 by Pix@7008
//

const WebSocket = require('ws');
const axios = require('axios');
const EventEmitter = require('events');

const LZString = require('lz-string');
const PSON = require('pson');
const bytebuffer = require('bytebuffer');
const { start } = require('repl');

bytebuffer.prototype.writeUint = bytebuffer.prototype.writeUint32
bytebuffer.prototype.toBase64 = function() {
  var P4$ = [arguments];
  P4$[4] = "";
  P4$[9] = new Uint8Array(this.buffer);
  P4$[8] = this.offset;
  for (P4$[7] = 0; P4$[7] < P4$[8]; P4$[7]++) {
    P4$[4] += String.fromCharCode(P4$[9][P4$[7]]);
  }
  return btoa(P4$[4]);
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const createBot = function(options) {
    options = options || {};
    return {
        protocol_version: 49,
        skin: options.skin || ``,
        basecolor: options.basecolor || 0,
        server: options.server || `b2ny2`,
        passbypass: options.passbypass || undefined,
        token: "a",
        peerID: options.peerid || undefined,
        account: options.account || {
            username: `BonkBotV3-${Math.random().toString().substr(2, 5)}`,
            guest: true,
        },
        game: {
            players: [],
            bots: [],
        },
        mapdata: {
            map: [],
            gt:2,
            wl:3,
            q:false,
            tl:true,
            tea:false,
            ga:"b",
            mo:"b",
            bal:[]
        },
        events: new EventEmitter(),
        timesync: function(){
            this.socket.send(`429[18,{"jsonrpc":"2.0","id":9,"method":"timesync"}]`);
        },
        sendInput: function(input){
            this.socket.send(`42[4,{"i":${input.input},"f":${input.frame},"c":${input.sequence}}]`);
        },
        joinTeam: function(team){
            this.socket.send(`42[6,{"targetTeam":${team}}]`);
        },
        toggleTeams: function(locked){
            this.socket.send(`42[7,{"teamLock":${locked}}]`);
        },
        banPlayer: function(player){
            this.socket.send(`42[9,{"banshortid":${player}}]`);
        },
        startGame: function(){
            this.socket.send(`42[5,{"is":"jWCW9ahaqG6GsGbWmycybYaVyafa7GAqc0bXagWWe0agouIGdtGhSKWavaAGefSlIWqacsOcamIjdyjBcFqKukaGe4IUCdirGa1anYc0AFn5c0AWwAmxAKpQwJi4K0G753ACNiAMQCshegCksDAAzXAhsABEw3gBhO38EQi4laEFaChgqGPConOjcyPyivJLC0oKK4rLC0FEILlNSHTc8AFFLLQALNwBFOqgAOzQAKzcAZn9SViQx0q4ucqrKxZXq5bWl3B5cVrdBEaQhDgBZADcKTzBO"
                ,"gs":{"map":"${this.mapEncode(this.mapdata.map)}"
                ,"gt":${this.mapdata.gt},"wl":${this.mapdata.wl},"q":${this.mapdata.q},"tl":${this.tl}
                ,"tea":${this.mapdata.tea},"ga":"${this.mapdata.ga}","mo":"${this.mapdata.mo}","bal":[]}}]`);
        },
        leaveGame: function(){
            this.socket.send(`42[14]`);
        },
        ready: function(ready){
            this.socket.send(`42[16,{"ready":${ready}}]`);
        },
        gainXP: function(){
            this.socket.send(`42[38]`);
        },
        giveHost: function(newhost){
            this.socket.send(`42[34,{"id":${newhost}}]`);
        },
        friendRequest: function(friendID){
            this.socket.send(`42[35,{"id":${friendID}}]`);
        },
        record: function(){
            this.socket.send(`42[33]`);
        },
        changeMap: function(mapdata) {
            this.socket.send(`42[23,{"m":"${mapdata}"}]`)
        },
        setRounds: function(rounds){
            this.socket.send(`42[21,{"w":${rounds}}]`);
        },
        chat: function(message){
            this.socket.send(`42[10,{"message":"${message}"}]`);
        },
        stateDecode: function(rawdata) {
            let ISpsonpair = new PSON.StaticPair(["physics", "shapes", "fixtures", "bodies", "bro", "joints", "ppm", "lights", "spawns", "lasers", "capZones", "type", "w", "h", "c", "a", "v", "l", "s", "sh", "fr", "re", "de", "sn", "fc", "fm", "f", "d", "n", "bg", "lv", "av", "ld", "ad", "fr", "bu", "cf", "rv", "p", "d", "bf", "ba", "bb", "aa", "ab", "axa", "dr", "em", "mmt", "mms", "ms", "ut", "lt", "New body", "Box Shape", "Circle Shape", "Polygon Shape", "EdgeChain Shape", "priority", "Light", "Laser", "Cap Zone", "BG Shape", "Background Layer", "Rotate Joint", "Slider Joint", "Rod Joint", "Gear Joint", 65535, 16777215])
            rawdata_caseflipped = ""
            for (i = 0; i < rawdata.length; i++) {
                if (i <= 100 && rawdata.charAt(i) === rawdata.charAt(i).toLowerCase()) {
                    rawdata_caseflipped += rawdata.charAt(i).toUpperCase();
                } else if (i <= 100 && rawdata.charAt(i) === rawdata.charAt(i).toUpperCase()) {
                    rawdata_caseflipped += rawdata.charAt(i).toLowerCase();
                } else {
                    rawdata_caseflipped += rawdata.charAt(i);
                }
            }
            data_deLZd = LZString.decompressFromEncodedURIComponent(rawdata_caseflipped);
            databuffer = bytebuffer.fromBase64(data_deLZd);
            data = ISpsonpair.decode(databuffer.buffer)
            return data

            
        },
        stateEncode: function(rawdata) {
            let ISpsonpair = new PSON.StaticPair(["physics", "shapes", "fixtures", "bodies", "bro", "joints", "ppm", "lights", "spawns", "lasers", "capZones", "type", "w", "h", "c", "a", "v", "l", "s", "sh", "fr", "re", "de", "sn", "fc", "fm", "f", "d", "n", "bg", "lv", "av", "ld", "ad", "fr", "bu", "cf", "rv", "p", "d", "bf", "ba", "bb", "aa", "ab", "axa", "dr", "em", "mmt", "mms", "ms", "ut", "lt", "New body", "Box Shape", "Circle Shape", "Polygon Shape", "EdgeChain Shape", "priority", "Light", "Laser", "Cap Zone", "BG Shape", "Background Layer", "Rotate Joint", "Slider Joint", "Rod Joint", "Gear Joint", 65535, 16777215])
            
            rawdata = ISpsonpair.encode(rawdata) //이 기능은 index.js와 유사 추정. 고치면 될거같긴함
            b64 = rawdata.toBase64()
            lzd = LZString.compressToEncodedURIComponent(b64)
            caseflipped = ""
            for (i = 0; i < lzd.length; i++) {
                if (i <= 100 && lzd.charAt(i) === lzd.charAt(i).toLowerCase()) {
                    caseflipped += lzd.charAt(i).toUpperCase();
                } else if (i <= 100 && lzd.charAt(i) === lzd.charAt(i).toUpperCase()) {
                    caseflipped += lzd.charAt(i).toLowerCase();
                } else {
                    caseflipped += lzd.charAt(i);
                }
            }
            return caseflipped
        },
        mapDecode: function(rawdata) {
            bytebuffer.prototype.readBoolean = function() {
                return this.readByte() > 0
            }
            bytebuffer.prototype.readUTF = function() {
                return this.readString(this.readShort())
            }
            bytebuffer.prototype.readUint = bytebuffer.prototype.readUint32
            decodeFromDatabase = function(map) {
                var thingie = [arguments];
                b64mapdata = LZString.decompressFromEncodedURIComponent(map);
                binaryReader = bytebuffer.fromBase64(b64mapdata, false);
                map = { "v": 1, "s": { "re": false, "nc": false, "pq": 1, "gd": 25, "fl": false }, "physics": { "shapes": [], "fixtures": [], "bodies": [], "bro": [], "joints": [], "ppm": 12 }, "spawns": [], "capZones": [], "m": { "a": "noauthor", "n": "noname", "dbv": 2, "dbid": -1, "authid": -1, "date": "", "rxid": 0, "rxn": "", "rxa": "", "rxdb": 1, "cr": [], "pub": false, "mo": "" } }
                map.v = binaryReader.readShort();
                if (map.v > 13) {
                    throw new Error("New map format, this script needs to be updated.");
                }
                map.s.re = binaryReader.readBoolean();
                map.s.nc = binaryReader.readBoolean();
                if (map.v >= 3) {
                    map.s.pq = binaryReader.readShort();
                }
                if (map.v >= 4 && map.v <= 12) {
                    map.s.gd = binaryReader.readShort();
                } else if (map.v >= 13) {
                    map.s.gd = binaryReader.readFloat();
                }
                if (map.v >= 9) {
                    map.s.fl = binaryReader.readBoolean();
                }
                map.m.rxn = binaryReader.readUTF();
                map.m.rxa = binaryReader.readUTF();
                map.m.rxid = binaryReader.readUint();
                map.m.rxdb = binaryReader.readShort();
                map.m.n = binaryReader.readUTF();
                map.m.a = binaryReader.readUTF();
                if (map.v >= 10) {
                    map.m.vu = binaryReader.readUint();
                    map.m.vd = binaryReader.readUint();
                }
                if (map.v >= 4) {
                    cr_count = binaryReader.readShort();
                    for (cr_iterator = 0; cr_iterator < cr_count; cr_iterator++) {
                        map.m.cr.push(binaryReader.readUTF());
                    }
                }
                if (map.v >= 5) {
                    map.m.mo = binaryReader.readUTF();
                    map.m.dbid = binaryReader.readInt();
                }
                if (map.v >= 7) {
                    map.m.pub = binaryReader.readBoolean();
                }
                if (map.v >= 8) {
                    map.m.dbv = binaryReader.readInt();
                }
                map.physics.ppm = binaryReader.readShort();
                bro_count = binaryReader.readShort();
                for (bro_iterator = 0; bro_iterator < bro_count; bro_iterator++) {
                    map.physics.bro[bro_iterator] = binaryReader.readShort();
                }
                shape_count = binaryReader.readShort();
                for (shape_iterator = 0; shape_iterator < shape_count; shape_iterator++) {
                    shape_type = binaryReader.readShort();
                    if (shape_type == 1) {
                        map.physics.shapes[shape_iterator] = {"type":"bx","w":10,"h":40,"c":[0,0],"a":0,"sk":false}
                        map.physics.shapes[shape_iterator].w = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].h = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].c = [binaryReader.readDouble(), binaryReader.readDouble()];
                        map.physics.shapes[shape_iterator].a = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].sk = binaryReader.readBoolean();
                    }
                    if (shape_type == 2) {
                        map.physics.shapes[shape_iterator] = {"type":"ci","r":25,"c":[0,0],"sk":false}
                        map.physics.shapes[shape_iterator].r = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].c = [binaryReader.readDouble(), binaryReader.readDouble()];
                        map.physics.shapes[shape_iterator].sk = binaryReader.readBoolean();
                    }
                    if (shape_type == 3) {
                        map.physics.shapes[shape_iterator] = {"type":"po","v":[],"s":1,"a":0,"c":[0,0]}
                        map.physics.shapes[shape_iterator].s = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].a = binaryReader.readDouble();
                        map.physics.shapes[shape_iterator].c = [binaryReader.readDouble(), binaryReader.readDouble()];
                        point_count = binaryReader.readShort();
                        map.physics.shapes[shape_iterator].v = [];
                        for (point_iterator = 0; point_iterator < point_count; point_iterator++) {
                            map.physics.shapes[shape_iterator].v.push([binaryReader.readDouble(), binaryReader.readDouble()]);
                        }
                    }
                }
                fixtureCount = binaryReader.readShort();
                for (i = 0; i < fixtureCount; i++) {
                    map.physics.fixtures[i] = {"n":"Def Fix","fr":0.3,"fp":null,"re":0.8,"de":0.3,"f":5209260,"d":false,"np":false,"ng":false}
                    map.physics.fixtures[i].sh = binaryReader.readShort();
                    map.physics.fixtures[i].n = binaryReader.readUTF();
                    map.physics.fixtures[i].fr = binaryReader.readDouble();
                    if (map.physics.fixtures[i].fr == Number.MAX_VALUE) {
                        map.physics.fixtures[i].fr = null;
                    }
                    fixture = binaryReader.readShort();
                    if (fixture == 0) {
                        map.physics.fixtures[i].fp = null;
                    }
                    if (fixture == 1) {
                        map.physics.fixtures[i].fp = false;
                    }
                    if (fixture == 2) {
                        map.physics.fixtures[i].fp = true;
                    }
                    map.physics.fixtures[i].re = binaryReader.readDouble();
                    if (map.physics.fixtures[i].re == Number.MAX_VALUE) {
                        map.physics.fixtures[i].re = null;
                    }
                    map.physics.fixtures[i].de = binaryReader.readDouble();
                    if (map.physics.fixtures[i].de == Number.MAX_VALUE) {
                        map.physics.fixtures[i].de = null;
                    }
                    map.physics.fixtures[i].f = binaryReader.readUint();
                    map.physics.fixtures[i].d = binaryReader.readBoolean();
                    map.physics.fixtures[i].np = binaryReader.readBoolean();
                    if (map.v >= 11) {
                        map.physics.fixtures[i].ng = binaryReader.readBoolean();
                    }
                    if (map.v >= 12) {
                        map.physics.fixtures[i].ig = binaryReader.readBoolean();
                    }
                }
                thingie[41] = binaryReader.readShort();
                for (x = 0; x < thingie[41]; x++) {
                    map.physics.bodies[x] = {"type":"s","n":"Unnamed","p":[0,0],"a":0,"fric":0.3,"fricp":false,"re":0.8,"de":0.3,"lv":[0,0],"av":0,"ld":0,"ad":0,"fr":false,"bu":false,"cf":{"x":0,"y":0,"w":true,"ct":0},"fx":[],"f_c":1,"f_p":true,"f_1":true,"f_2":true,"f_3":true,"f_4":true}
                    map.physics.bodies[x].type = binaryReader.readUTF();
                    map.physics.bodies[x].n = binaryReader.readUTF();
                    map.physics.bodies[x].p = [binaryReader.readDouble(), binaryReader.readDouble()];
                    map.physics.bodies[x].a = binaryReader.readDouble();
                    map.physics.bodies[x].fric = binaryReader.readDouble();
                    map.physics.bodies[x].fricp = binaryReader.readBoolean();
                    map.physics.bodies[x].re = binaryReader.readDouble();
                    map.physics.bodies[x].de = binaryReader.readDouble();
                    map.physics.bodies[x].lv = [binaryReader.readDouble(), binaryReader.readDouble()];
                    map.physics.bodies[x].av = binaryReader.readDouble();
                    map.physics.bodies[x].ld = binaryReader.readDouble();
                    map.physics.bodies[x].ad = binaryReader.readDouble();
                    map.physics.bodies[x].fr = binaryReader.readBoolean();
                    map.physics.bodies[x].bu = binaryReader.readBoolean();
                    map.physics.bodies[x].cf.x = binaryReader.readDouble();
                    map.physics.bodies[x].cf.y = binaryReader.readDouble();
                    map.physics.bodies[x].cf.ct = binaryReader.readDouble();
                    map.physics.bodies[x].cf.w = binaryReader.readBoolean();
                    map.physics.bodies[x].f_c = binaryReader.readShort();
                    map.physics.bodies[x].f_1 = binaryReader.readBoolean();
                    map.physics.bodies[x].f_2 = binaryReader.readBoolean();
                    map.physics.bodies[x].f_3 = binaryReader.readBoolean();
                    map.physics.bodies[x].f_4 = binaryReader.readBoolean();
                    if (map.v >= 2) {
                        map.physics.bodies[x].f_p = binaryReader.readBoolean();
                    }
                    thingie[50] = binaryReader.readShort();
                    for (thingie[66] = 0; thingie[66] < thingie[50]; thingie[66]++) {
                        map.physics.bodies[x].fx.push(binaryReader.readShort());
                    }
                }
                thingie[48] = binaryReader.readShort();
                for (thingie[36] = 0; thingie[36] < thingie[48]; thingie[36]++) {
                    map.spawns[thingie[36]] = {"x":400,"y":300,"xv":0,"yv":0,"priority":5,"r":true,"f":true,"b":true,"gr":false,"ye":false,"n":"Spawn"};
                    thingie[80] = map.spawns[thingie[36]];
                    thingie[80].x = binaryReader.readDouble();
                    thingie[80].y = binaryReader.readDouble();
                    thingie[80].xv = binaryReader.readDouble();
                    thingie[80].yv = binaryReader.readDouble();
                    thingie[80].priority = binaryReader.readShort();
                    thingie[80].r = binaryReader.readBoolean();
                    thingie[80].f = binaryReader.readBoolean();
                    thingie[80].b = binaryReader.readBoolean();
                    thingie[80].gr = binaryReader.readBoolean();
                    thingie[80].ye = binaryReader.readBoolean();
                    thingie[80].n = binaryReader.readUTF();
                }
                thingie[40] = binaryReader.readShort();
                for (thingie[18] = 0; thingie[18] < thingie[40]; thingie[18]++) {
                    map.capZones[thingie[18]] = {"n":"Cap Zone","ty":1,"l":10,"i":-1}
                    map.capZones[thingie[18]].n = binaryReader.readUTF();
                    map.capZones[thingie[18]].l = binaryReader.readDouble();
                    map.capZones[thingie[18]].i = binaryReader.readShort();
                    if (map.v >= 6) {
                        map.capZones[thingie[18]].ty = binaryReader.readShort();
                    }
                }
                thingie[39] = binaryReader.readShort();
                for (thingie[94] = 0; thingie[94] < thingie[39]; thingie[94]++) {
                    thingie[75] = binaryReader.readShort();
                    if (thingie[75] == 1) {
                        map.physics.joints[thingie[94]] = {"type":"rv","d":{"la":0,"ua":0,"mmt":0,"ms":0,"el":false,"em":false,"cc":false,"bf":0,"dl":true},"aa":[0,0]}
                        thingie[53] = map.physics.joints[thingie[94]];
                        thingie[53].d.la = binaryReader.readDouble();
                        thingie[53].d.ua = binaryReader.readDouble();
                        thingie[53].d.mmt = binaryReader.readDouble();
                        thingie[53].d.ms = binaryReader.readDouble();
                        thingie[53].d.el = binaryReader.readBoolean();
                        thingie[53].d.em = binaryReader.readBoolean();
                        thingie[53].aa = [binaryReader.readDouble(), binaryReader.readDouble()];
                    }
                    if (thingie[75] == 2) {
                        map.physics.joints[thingie[94]] = {"type":"d","d":{"fh":0,"dr":0,"cc":false,"bf":0,"dl":true},"aa":[0,0],"ab":[0,0]}
                        thingie[27] = map.physics.joints[thingie[94]];
                        thingie[27].d.fh = binaryReader.readDouble();
                        thingie[27].d.dr = binaryReader.readDouble();
                        thingie[27].aa = [binaryReader.readDouble(), binaryReader.readDouble()];
                        thingie[27].ab = [binaryReader.readDouble(), binaryReader.readDouble()];
                    }
                    if (thingie[75] == 3) {
                        map.physics.joints[thingie[94]] = {"type":"lpj","d":{"cc":false,"bf":0,"dl":true},"pax":0,"pay":0,"pa":0,"pf":0,"pl":0,"pu":0,"plen":0,"pms":0}
                        thingie[23] = map.physics.joints[thingie[94]];
                        thingie[23].pax = binaryReader.readDouble();
                        thingie[23].pay = binaryReader.readDouble();
                        thingie[23].pa = binaryReader.readDouble();
                        thingie[23].pf = binaryReader.readDouble();
                        thingie[23].pl = binaryReader.readDouble();
                        thingie[23].pu = binaryReader.readDouble();
                        thingie[23].plen = binaryReader.readDouble();
                        thingie[23].pms = binaryReader.readDouble();
                    }
                    if (thingie[75] == 4) {
                        map.physics.joints[thingie[94]] = {"type":"lsj","d":{"cc":false,"bf":0,"dl":true},"sax":0,"say":0,"sf":0,"slen":0}
                        thingie[47] = map.physics.joints[thingie[94]];
                        thingie[47].sax = binaryReader.readDouble();
                        thingie[47].say = binaryReader.readDouble();
                        thingie[47].sf = binaryReader.readDouble();
                        thingie[47].slen = binaryReader.readDouble();
                    }
                    map.physics.joints[thingie[94]].ba = binaryReader.readShort();
                    map.physics.joints[thingie[94]].bb = binaryReader.readShort();
                    map.physics.joints[thingie[94]].d.cc = binaryReader.readBoolean();
                    map.physics.joints[thingie[94]].d.bf = binaryReader.readDouble();
                    map.physics.joints[thingie[94]].d.dl = binaryReader.readBoolean();
                    ;
                }
                return map;
            }
            return decodeFromDatabase(rawdata);
        },
        mapEncode: function(mapObject) {
            var H_B = [arguments];
            H_B[2] = new bytebuffer;
            H_B[2].writeBoolean = (x) => H_B[2].writeByte(x ? 1 : 0)
            bytebuffer.prototype.writeUTF = function(x) {
                this.writeShort(x.length)
                this.writeString(x)
            }
            H_B[5] = mapObject.physics;
            mapObject.v = 13;
            H_B[2].writeShort(mapObject.v);
            H_B[2].writeBoolean(mapObject.s.re);
            H_B[2].writeBoolean(mapObject.s.nc);
            H_B[2].writeShort(mapObject.s.pq);
            H_B[2].writeFloat(mapObject.s.gd);
            H_B[2].writeBoolean(mapObject.s.fl);
            H_B[2].writeUTF(mapObject.m.rxn);
            H_B[2].writeUTF(mapObject.m.rxa);
            H_B[2].writeUint(mapObject.m.rxid);
            H_B[2].writeShort(mapObject.m.rxdb);
            H_B[2].writeUTF(mapObject.m.n);
            H_B[2].writeUTF(mapObject.m.a);
            H_B[2].writeUint(mapObject.m.vu);
            H_B[2].writeUint(mapObject.m.vd);
            H_B[2].writeShort(mapObject.m.cr.length);
            for (
                H_B[62] = 0;
                H_B[62] < mapObject.m.cr.length;
                H_B[62]++
            ) {
                H_B[2].writeUTF(mapObject.m.cr[H_B[62]]);
            }
            H_B[2].writeUTF(mapObject.m.mo);
            H_B[2].writeInt(mapObject.m.dbid);
            H_B[2].writeBoolean(mapObject.m.pub);
            H_B[2].writeInt(mapObject.m.dbv);
            H_B[2].writeShort(H_B[5].ppm);
            H_B[2].writeShort(H_B[5].bro.length);
            for (H_B[31] = 0; H_B[31] < H_B[5].bro.length; H_B[31]++) {
                H_B[2].writeShort(H_B[5].bro[H_B[31]]);
            }
            H_B[2].writeShort(H_B[5].shapes.length);
            for (H_B[61] = 0; H_B[61] < H_B[5].shapes.length; H_B[61]++) {
                H_B[3] = H_B[5].shapes[H_B[61]];
                if (H_B[3].type == "bx") {
                H_B[2].writeShort(1);
                H_B[2].writeDouble(H_B[3].w);
                H_B[2].writeDouble(H_B[3].h);
                H_B[2].writeDouble(H_B[3].c[0]);
                H_B[2].writeDouble(H_B[3].c[1]);
                H_B[2].writeDouble(H_B[3].a);
                H_B[2].writeBoolean(H_B[3].sk);
                }
                if (H_B[3].type == "ci") {
                H_B[2].writeShort(2);
                H_B[2].writeDouble(H_B[3].r);
                H_B[2].writeDouble(H_B[3].c[0]);
                H_B[2].writeDouble(H_B[3].c[1]);
                H_B[2].writeBoolean(H_B[3].sk);
                }
                if (H_B[3].type == "po") {
                H_B[2].writeShort(3);
                H_B[2].writeDouble(H_B[3].s);
                H_B[2].writeDouble(H_B[3].a);
                H_B[2].writeDouble(H_B[3].c[0]);
                H_B[2].writeDouble(H_B[3].c[1]);
                H_B[2].writeShort(H_B[3].v.length);
                for (H_B[45] = 0; H_B[45] < H_B[3].v.length; H_B[45]++) {
                    H_B[2].writeDouble(H_B[3].v[H_B[45]][0]);
                    H_B[2].writeDouble(H_B[3].v[H_B[45]][1]);
                }
                }
            }
            H_B[2].writeShort(H_B[5].fixtures.length);
            for (H_B[88] = 0; H_B[88] < H_B[5].fixtures.length; H_B[88]++) {
                H_B[4] = H_B[5].fixtures[H_B[88]];
                H_B[2].writeShort(H_B[4].sh);
                H_B[2].writeUTF(H_B[4].n);
                if (H_B[4].fr === null) {
                H_B[2].writeDouble(Number.MAX_VALUE);
                } else {
                H_B[2].writeDouble(H_B[4].fr);
                }
                if (H_B[4].fp === null) {
                H_B[2].writeShort(0);
                }
                if (H_B[4].fp === false) {
                H_B[2].writeShort(1);
                }
                if (H_B[4].fp === true) {
                H_B[2].writeShort(2);
                }
                if (H_B[4].re === null) {
                H_B[2].writeDouble(Number.MAX_VALUE);
                } else {
                H_B[2].writeDouble(H_B[4].re);
                }
                if (H_B[4].de === null) {
                H_B[2].writeDouble(Number.MAX_VALUE);
                } else {
                H_B[2].writeDouble(H_B[4].de);
                }
                H_B[2].writeUint(H_B[4].f);
                H_B[2].writeBoolean(H_B[4].d);
                H_B[2].writeBoolean(H_B[4].np);
                H_B[2].writeBoolean(H_B[4].ng);
                H_B[2].writeBoolean(H_B[4].ig);
            }
            H_B[2].writeShort(H_B[5].bodies.length);
            for (H_B[41] = 0; H_B[41] < H_B[5].bodies.length; H_B[41]++) {
                H_B[9] = H_B[5].bodies[H_B[41]];
                H_B[2].writeUTF(H_B[9].type);
                H_B[2].writeUTF(H_B[9].n);
                H_B[2].writeDouble(H_B[9].p[0]);
                H_B[2].writeDouble(H_B[9].p[1]);
                H_B[2].writeDouble(H_B[9].a);
                H_B[2].writeDouble(H_B[9].fric);
                H_B[2].writeBoolean(H_B[9].fricp);
                H_B[2].writeDouble(H_B[9].re);
                H_B[2].writeDouble(H_B[9].de);
                H_B[2].writeDouble(H_B[9].lv[0]);
                H_B[2].writeDouble(H_B[9].lv[1]);
                H_B[2].writeDouble(H_B[9].av);
                H_B[2].writeDouble(H_B[9].ld);
                H_B[2].writeDouble(H_B[9].ad);
                H_B[2].writeBoolean(H_B[9].fr);
                H_B[2].writeBoolean(H_B[9].bu);
                H_B[2].writeDouble(H_B[9].cf.x);
                H_B[2].writeDouble(H_B[9].cf.y);
                H_B[2].writeDouble(H_B[9].cf.ct);
                H_B[2].writeBoolean(H_B[9].cf.w);
                H_B[2].writeShort(H_B[9].f_c);
                H_B[2].writeBoolean(H_B[9].f_1);
                H_B[2].writeBoolean(H_B[9].f_2);
                H_B[2].writeBoolean(H_B[9].f_3);
                H_B[2].writeBoolean(H_B[9].f_4);
                H_B[2].writeBoolean(H_B[9].f_p);
                H_B[2].writeShort(H_B[9].fx.length);
                for (H_B[78] = 0; H_B[78] < H_B[9].fx.length; H_B[78]++) {
                H_B[2].writeShort(H_B[9].fx[H_B[78]]);
                }
            }
            H_B[2].writeShort(mapObject.spawns.length);
            for (
                H_B[74] = 0;
                H_B[74] < mapObject.spawns.length;
                H_B[74]++
            ) {
                H_B[6] = mapObject.spawns[H_B[74]];
                H_B[2].writeDouble(H_B[6].x);
                H_B[2].writeDouble(H_B[6].y);
                H_B[2].writeDouble(H_B[6].xv);
                H_B[2].writeDouble(H_B[6].yv);
                H_B[2].writeShort(H_B[6].priority);
                H_B[2].writeBoolean(H_B[6].r);
                H_B[2].writeBoolean(H_B[6].f);
                H_B[2].writeBoolean(H_B[6].b);
                H_B[2].writeBoolean(H_B[6].gr);
                H_B[2].writeBoolean(H_B[6].ye);
                H_B[2].writeUTF(H_B[6].n);
            }
            H_B[2].writeShort(mapObject.capZones.length);
            for (
                H_B[48] = 0;
                H_B[48] < mapObject.capZones.length;
                H_B[48]++
            ) {
                H_B[1] = mapObject.capZones[H_B[48]];
                H_B[2].writeUTF(H_B[1].n);
                H_B[2].writeDouble(H_B[1].l);
                H_B[2].writeShort(H_B[1].i);
                H_B[2].writeShort(H_B[1].ty);
            }
            H_B[2].writeShort(H_B[5].joints.length);
            for (H_B[69] = 0; H_B[69] < H_B[5].joints.length; H_B[69]++) {
                H_B[8] = H_B[5].joints[H_B[69]];
                if (H_B[8].type == "rv") {
                H_B[2].writeShort(1);
                H_B[2].writeDouble(H_B[8].d.la);
                H_B[2].writeDouble(H_B[8].d.ua);
                H_B[2].writeDouble(H_B[8].d.mmt);
                H_B[2].writeDouble(H_B[8].d.ms);
                H_B[2].writeBoolean(H_B[8].d.el);
                H_B[2].writeBoolean(H_B[8].d.em);
                H_B[2].writeDouble(H_B[8].aa[0]);
                H_B[2].writeDouble(H_B[8].aa[1]);
                }
                if (H_B[8].type == "d") {
                H_B[2].writeShort(2);
                H_B[2].writeDouble(H_B[8].d.fh);
                H_B[2].writeDouble(H_B[8].d.dr);
                H_B[2].writeDouble(H_B[8].aa[0]);
                H_B[2].writeDouble(H_B[8].aa[1]);
                H_B[2].writeDouble(H_B[8].ab[0]);
                H_B[2].writeDouble(H_B[8].ab[1]);
                }
                if (H_B[8].type == "lpj") {
                H_B[2].writeShort(3);
                H_B[2].writeDouble(H_B[8].pax);
                H_B[2].writeDouble(H_B[8].pay);
                H_B[2].writeDouble(H_B[8].pa);
                H_B[2].writeDouble(H_B[8].pf);
                H_B[2].writeDouble(H_B[8].pl);
                H_B[2].writeDouble(H_B[8].pu);
                H_B[2].writeDouble(H_B[8].plen);
                H_B[2].writeDouble(H_B[8].pms);
                }
                if (H_B[8].type == "lsj") {
                H_B[2].writeShort(4);
                H_B[2].writeDouble(H_B[8].sax);
                H_B[2].writeDouble(H_B[8].say);
                H_B[2].writeDouble(H_B[8].sf);
                H_B[2].writeDouble(H_B[8].slen);
                }
                H_B[2].writeShort(H_B[8].ba);
                H_B[2].writeShort(H_B[8].bb);
                H_B[2].writeBoolean(H_B[8].d.cc);
                H_B[2].writeDouble(H_B[8].d.bf);
                H_B[2].writeBoolean(H_B[8].d.dl);
            }
            H_B[15] = H_B[2].toBase64();
            H_B[30] = LZString.compressToEncodedURIComponent(H_B[15]);
            return H_B[30];
        },
        setAddress: function(gameInfo){
            if(gameInfo.address == undefined || gameInfo.roomname == undefined || gameInfo.server == undefined || gameInfo.passbypass == undefined){
                console.log("Room not found");
                return false;
            }
            this.address = gameInfo.address;
            this.roomname = gameInfo.roomname;
            this.server = gameInfo.server;
            this.passbypass = gameInfo.passbypass;
        },
        getAddressFromRoomName: async function(name){
            let response = await this.getRoomByName(name);
            let serv = {}
            let addr = await this.getRoomAddress(response.id);
            serv.roomname = response.roomname;
            serv.address = addr.address;
            serv.server = addr.server;
            serv.passbypass = "";
            return serv;
        },
        sendRoomInfo2: function(id, username){
            let welcomemsg = `Hello`
            if(username != undefined || username != null){
                welcomemsg = `Hello ${username}!`
            }
            let msg = [11,{
                    "sid": id,
                    "gs": {
                        "map": {
                            "v": 13,
                            "s": {
                                "re": false,
                                "nc": false,
                                "pq": 1,
                                "gd": 25,
                                "fl": false
                            },
                            "physics": {
                                "shapes": [],
                                "fixtures": [],
                                "bodies": [],
                                "bro": [],
                                "joints": [],
                                "ppm": 12
                            },
                            "spawns": [],
                            "capZones": [],
                            "m": {
                                "a": "🤓",
                                "n": welcomemsg,
                                "dbv": 2,
                                "dbid": 742086,
                                "authid": -1,
                                "date": "2022-07-29 17:46:46",
                                "rxid": 0,
                                "rxn": "",
                                "rxa": "",
                                "rxdb": 1,
                                "cr": [
                                    "🤓"
                                ],
                                "pub": true,
                                "mo": "",
                                "vu": 0,
                                "vd": 0
                            }
                        },
                        "gt": 2,
                        "wl": "21!?!",
                        "q": false,
                        "tl": false,
                        "tea": false,
                        "ga": "b",
                        "mo": "b",
                        "bal": [],
                        "GMMode": ""
                    }
                }]
            return `42${JSON.stringify(msg)}`
        },
        sendRoomInfo: function(id, username){
            let welcomemsg = `Welcome`
            if(username != undefined || username != null){
                welcomemsg = `Welcome ${username}`
            }
            let msg = [11,{
                    "sid": id,
                    "gs": {
                        "map": {
                            "v": 13,
                            "s": {
                                "re": false,
                                "nc": false,
                                "pq": 1,
                                "gd": 25,
                                "fl": false
                            },
                            "physics": {
                                "shapes": [],
                                "fixtures": [],
                                "bodies": [],
                                "bro": [],
                                "joints": [],
                                "ppm": 12
                            },
                            "spawns": [],
                            "capZones": [],
                            "m": {
                                "a": "GaIio",
                                "n": welcomemsg,
                                "dbv": 2,
                                "dbid": 742086,
                                "authid": -1,
                                "date": "2022-07-29 17:46:46",
                                "rxid": 0,
                                "rxn": "",
                                "rxa": "",
                                "rxdb": 1,
                                "cr": [
                                    "🤓"
                                ],
                                "pub": true,
                                "mo": "",
                                "vu": 0,
                                "vd": 0
                            }
                        },
                        "gt": 2,
                        "wl": "N",
                        "q": false,
                        "tl": false,
                        "tea": false,
                        "ga": "b",
                        "mo": "b",
                        "bal": [],
                        "GMMode": ""
                    }
                }]
            return `42${JSON.stringify(msg)}`
        },
        getSocketID: async function(server){
            var url = `https://${server}.bonk.io/socket.io/?EIO=3&transport=polling&t=OB8AH_b`;
            return new Promise((resolve, reject) => {
                axios.get(url)
                .then(function (response) {
                    var socketid = response.data.substring(12,32)
                    resolve(socketid)
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        getAddressFromLink: async function(link){
            // make an http request to the link and pull out the room address from the html
            return new Promise((resolve, reject) => {
                axios.get(link)
                .then(function (response) {
                    let gameInfo = response.data.match(/autoJoin = {"address":"(.*?)","roomname":"(.*?)","server":"(.*?)","passbypass":"(.*?)","r":"success"}/);
                    gameInfo = {
                        address: gameInfo[1],
                        roomname: gameInfo[2],
                        server: gameInfo[3],
                        passbypass: gameInfo[4]
                    }
                    resolve(gameInfo)
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        getToken: async function(){
            var url = "https://bonk2.io/scripts/login_legacy.php";
            return new Promise((resolve, reject) => {
                var headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                var data = `username=${this.account.username}&password=${this.account.password}&remember=true`
                axios.post(url, data, {headers: headers})
                    .then(function (response) {
                        resolve(response.data.token)
                    });
            })
        },
        joinRoom: function(options){
            if(options.address == undefined){ throw new Error("address is undefined") }
            if(options.account.guest == undefined){ options.account.guest = true }

            if(options.account.token == undefined){ if(options.account.guest != true){ throw new Error(`No token provided and is not a guest!`)} }
            options.peerid = Math.random().toString(36).substr(2, 10) + 'v00000'
            if(options.account.username == undefined){options.account.username = `Robot${Math.random().toString().substr(2, 5)}`}
            if(options.roompassword == undefined){options.roompassword = "";}
            if(options.basecolor == undefined){options.basecolor = 16448250}
            if(options.skin == undefined){options.skin = `{"id":30,"scale":0.30000001192092896,"angle":0,"x":0,"y":0,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.07894168794155121,"angle":231.9313201904297,"x":-9.684389114379883,"y":2.921388626098633,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08011436462402344,"angle":246.96766662597656,"x":-7.4090142250061035,"y":6.844449520111084,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08011436462402344,"angle":-69.44682312011719,"x":7.4201555252075195,"y":6.805218696594238,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08325429260730743,"angle":-53.76435089111328,"x":9.440908432006836,"y":3.1005043983459473,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08254065364599228,"angle":7.713021755218506,"x":-1.975311517715454,"y":-9.978830337524414,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08310862630605698,"angle":-6.316278457641602,"x":2.2820658683776855,"y":-9.94627857208252,"flipX":false,"flipY":false,"color":16777215},{"id":13,"scale":0.3945557773113251,"angle":0.04141417145729065,"x":-0.0322730652987957,"y":-0.060396190732717514,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.21413731575012207,"angle":419.81427001953125,"x":-2.4916510581970215,"y":1.3715696334838867,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.21413731575012207,"angle":120.56624603271484,"x":2.608327865600586,"y":1.3715696334838867,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.21413731575012207,"angle":0.39198538661003113,"x":0,"y":-3.107584238052368,"flipX":false,"flipY":false,"color":0},{"id":30,"scale":1.0002638101577759,"angle":-1.4328136444091797,"x":-0.04256964847445488,"y":0,"flipX":false,"flipY":false,"color":16777215},{"id":13,"scale":0.5588991045951843,"angle":-0.6648434996604919,"x":0,"y":0,"flipX":false,"flipY":false,"color":16777215},{"id":34,"scale":0.759579062461853,"angle":124.82804870605469,"x":-10.603617668151855,"y":-4.556829929351807,"flipX":false,"flipY":false,"color":0},{"id":34,"scale":0.7667332887649536,"angle":-3.340736150741577,"x":-0.7606570720672607,"y":11.768919944763184,"flipX":false,"flipY":false,"color":0},{"id":34,"scale":0.7913457751274109,"angle":241.08135986328125,"x":9.895292282104492,"y":-6.6403703689575195,"flipX":false,"flipY":false,"color":0}`}
            if(options.account.guest == true){
                let joinPacket = `42[13,{"joinID":"${options.address}","roomPassword":"${options.roompassword}","guest":true,"dbid":2,"version":44,"peerID":"${options.peerid}","bypass":"","guestName":"${options.account.username}","avatar":{"layers":[${options.skin}],"bc":${options.basecolor}}}]`
                this.socket.send(joinPacket)
            } else {
                let joinPacket = `42[13,{"joinID":"${options.address}","roomPassword":"${options.roompassword}","guest":false,"dbid":2,"version":44,"peerID":"${options.peerid}","bypass":"","token":"${options.account.token}","avatar":{"layers":[${options.skin}],"bc":${options.basecolor}}}]`
                this.socket.send(joinPacket)
            }
        },
        createRoom: function(options){
            if(options.roomname == undefined){ options.roomname = `Super cool room` }
            if(options.maxplayers == undefined){ options.maxplayers = 8 }
            if(options.account.guest == undefined){ options.account.guest = true }
            if(options.token == undefined){ if(options.account.guest != true){ throw new Error(`No token provided and is not a guest!`)} }
            if(options.peerid == undefined){options.peerid = Math.random().toString(36).substr(2, 10) + 'v00000'}
            if(options.username == undefined){options.username = `Robot${Math.random().toString().substr(2, 5)}`}
            if(options.roompassword == undefined){options.roompassword = ""}
            if(options.basecolor == undefined){options.basecolor = 0}
            if(options.skin == undefined){options.skin = `{"id":30,"scale":0.30000001192092896,"angle":0,"x":0,"y":0,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.07894168794155121,"angle":231.9313201904297,"x":-9.684389114379883,"y":2.921388626098633,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08011436462402344,"angle":246.96766662597656,"x":-7.4090142250061035,"y":6.844449520111084,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08011436462402344,"angle":-69.44682312011719,"x":7.4201555252075195,"y":6.805218696594238,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08325429260730743,"angle":-53.76435089111328,"x":9.440908432006836,"y":3.1005043983459473,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08254065364599228,"angle":7.713021755218506,"x":-1.975311517715454,"y":-9.978830337524414,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.08310862630605698,"angle":-6.316278457641602,"x":2.2820658683776855,"y":-9.94627857208252,"flipX":false,"flipY":false,"color":16777215},{"id":13,"scale":0.3945557773113251,"angle":0.04141417145729065,"x":-0.0322730652987957,"y":-0.060396190732717514,"flipX":false,"flipY":false,"color":16777215},{"id":75,"scale":0.21413731575012207,"angle":419.81427001953125,"x":-2.4916510581970215,"y":1.3715696334838867,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.21413731575012207,"angle":120.56624603271484,"x":2.608327865600586,"y":1.3715696334838867,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.21413731575012207,"angle":0.39198538661003113,"x":0,"y":-3.107584238052368,"flipX":false,"flipY":false,"color":0},{"id":30,"scale":1.0002638101577759,"angle":-1.4328136444091797,"x":-0.04256964847445488,"y":0,"flipX":false,"flipY":false,"color":16777215},{"id":13,"scale":0.5588991045951843,"angle":-0.6648434996604919,"x":0,"y":0,"flipX":false,"flipY":false,"color":16777215},{"id":34,"scale":0.759579062461853,"angle":124.82804870605469,"x":-10.603617668151855,"y":-4.556829929351807,"flipX":false,"flipY":false,"color":0},{"id":34,"scale":0.7667332887649536,"angle":-3.340736150741577,"x":-0.7606570720672607,"y":11.768919944763184,"flipX":false,"flipY":false,"color":0},{"id":34,"scale":0.7913457751274109,"angle":241.08135986328125,"x":9.895292282104492,"y":-6.6403703689575195,"flipX":false,"flipY":false,"color":0}`}
            if(options.account.guest == true){
                this.socket.send(`42[12,{"peerID":"${options.peerid}","roomName":"${options.roomname}","maxPlayers":${options.maxplayers},"password":"${options.roompassword}","dbid":11822936,"guest":true,"minLevel":0,"maxLevel":999,"latitude":41.7227,"longitude":-72.2196,"country":"KO","version":${this.protocol_version},"hidden":0,"quick":false,"mode":"custom","token":"${options.token}","avatar":{"layers":[${options.skin}],"bc":${options.basecolor}}}]`)
            }else{
                this.socket.send(`42[12,{"peerID":"${options.peerid}","roomName":"${options.roomname}","maxPlayers":${options.maxplayers},"password":"${options.roompassword}","dbid":11822936,"guest":false,"minLevel":0,"maxLevel":999,"latitude":41.7227,"longitude":-72.2196,"country":"KO","version":44,"hidden":0,"quick":false,"mode":"custom","token":"${options.token}","avatar":{"layers":[${options.skin}],"bc":${options.basecolor}}}]`)
            }
            return true
        },
        getRoomByName: async function(roomname) {
            return new Promise(async (resolve, reject) => {
                try {
                    var rooms = await this.getRooms();
                    for (var i = rooms.length - 1; i >= 0; i--) {
                        if (roomname != undefined) {
                            console.log(rooms[i].roomname)
                            if (rooms[i].roomname == roomname) {
                                resolve(rooms[i]);  
                            }
                        }
                    }
                    resolve(false);
                } catch (error) {
                    console.log(error);
                }
            });
        },
        getRooms: async function() {
            var url = "https://bonk2.io/scripts/getrooms.php";
            var data = `version=${this.protocol_version}&gl=y&token=`;  
            return new Promise((resolve, reject) => {
                axios.post(url, data)
                .then(function (response) {
                    var roomdata = response.data;
                    resolve(roomdata.rooms);
                }).catch(function (error) {
                    console.log(error);
                });
            });
        },
        getRoomAddress: async function(id) {

            var url = "https://bonk2.io/scripts/getroomaddress.php";
            var data = `id=${id}`;
            
            return new Promise((resolve, reject) => {
                axios.post(url, data)
                .then(function (response) {
                    var roomjoinid = response.data
                    resolve(roomjoinid)
                });
            })
        },
        getPlayerByID: function(id) {
            for (var i = this.game.players.length - 1; i >= 0; i--) {
                if(this.game.players[i] != undefined || this.game.players[i] != null){
                    if (this.game.players[i].id == id) {
                        return this.game.players[i]
                    }
                }
            }
            return false
        },
        parseSocket: function(message) {
            let numToTeam = {
                0: `spectator`,
                1: `ffa`,
                2: `red`,
                3: `blue`,
                4: `green`,
                5: `yellow`,
            }
            if (message == "3probe") {
                return `{"type":"3probe"}`
            }
            if (message == "40") {
                return `{"type":"40"}`
            }
            if (message == "41") {
                return `{"type":"41"}`
            }
            if (JSON.parse(message.substring(2))) {
                var message = JSON.parse(message.substring(2))
                try {
                    function switchyswitch(message){
                        switch (message[0]) {
                            case 1:
                                return `{"type":"ping"}`
                            case 2:
                                return `{"type":"roomaddr","roomaddr":"${message[1]}"}`
                            case 3:
                                return `{"type":"roomjoin","roombypass":"${message[7]}","roomid":"${message[6]}","teamslocked":"${message[5]}","myid":"${message[1]}","hostid":"${message[2]}","playerdata":${JSON.stringify(message[3])}}`
                            case 4:
                                if (message[4] == true) {
                                    return `{"type":"playerjoin","id":"${message[1]}","peerid":"${message[2]}","username":"${message[3]}","level":"0","guest":true,"skin":${JSON.stringify(message[7])},"tabbed":${message[6]}}`
                                }else{
                                    return `{"type":"playerjoin","id":"${message[1]}","peerid":"${message[2]}","username":"${message[3]}","level":"${message[5]}","guest":false,"skin":${JSON.stringify(message[7])},"tabbed":${message[6]}}`
                                }
                            case 5:
                                return `{"type":"playerleave","id":"${message[1]}"}`
                            case 6:
                                if(message[2] == `-1`){
                                    return `{"type":"gameclose"}`
                                }else{
                                    return `{"type":"hostleave","oldid":"${message[1]}","newid":"${message[2]}"}`
                                }
                            case 7:
                                if(!message[2].hasOwnProperty("f") || !message[2].hasOwnProperty("c") || !message[2].hasOwnProperty("i")){
                                    return `{"type":"playerinputerror"}`
                                }
                                return `{"type":"playerinput","id":"${message[1]}","input":${message[2][`i`]},"frame":${message[2][`f`]},"sequence":${message[2][`c`]}}`
                            case 8:
                                return `{"type":"playerready","id":"${message[1]}","ready":${message[2]}}`
                            case 13:
                                return `{"type":"gamecancel"}`
                            case 15:
                                return `{"type":"gamestart"}`
                            case 16:
                                return `{"type":"ratelimit","limit":"${message[1]}"}`
                            case 18:
                                return `{"type":"playermove","id":"${message[1]}","team":${message[2]}}`
                            case 19:
                                return `{"type":"teamslock","teamslocked":${message[1]}}`
                            case 20:
                                return `{"type":"chatmessage","id":"${message[1]}","message":"${message[2].replace(/"/g, '\\"')}"}`
                            case 21:
                                //console.log(message[1][`map`]) //bal과 GMMode는 제외

                                let jsonMap = JSON.stringify(message[1][`map`]);

                                let json =  `{"type":"mapdata","map":`+jsonMap+`,"gt":"${message[1][`gt`]}","ga":"${message[1][`ga`]}"
                                ,"mo":"${message[1][`mo`]}","q":"${message[1][`q`]}","tea":"${message[1][`tea`]}","tl":"${message[1][`tl`]}","wl":"${message[1][`wl`]}"}`
                                return json
                            case 23:
                                return `{"type":"timesync","time":"${message[1].result}","id":"${message[1].id}"}`
                            case 24:
                                return `{"type":"playerkick","id":"${message[1]}"}`
                            case 26:
                                return `{"type":"modechange","mode":"${message[2]}","rootmode":"${message[1]}"}`
                            case 27:
                                return `{"type":"roundschange","rounds":${message[1]}}`
                            case 29:
                                return `{"type":"mapswap","data":"${message[1]}"}`
                            case 33:
                                return `{"type":"hostmaprequest","mapdata":"${message[1]}","id":"${message[2]}"}`
                            case 34:
                                return `{"type":"maprequest","map":"${message[1]}","author":"${message[2]}","id":"${message[3]}"}`
                            case 36:
                                return `{"type":"changebalance","id":"${message[1]}","balance":"${message[2]}"}`
                            case 40:
                                return `{"type":"savereplay","id":"${message[1]}"}`
                            case 41:
                                return `{"type":"hosttransfer","oldHost":"${message[1][`oldHost`]}","newHost":"${message[1][`newHost`]}"}`
                            case 42:
                                return `{"type":"friend","id":"${message[1]}"}`
                            case 43:
                                return `{"type":"countdown","countdown":"${message[1]}"}`
                            case 44:
                                return `{"type":"countdownabort"}`
                            case 45:
                                return `{"type":"playerlevelup","id":"${message[1]}","level":"${message[2]}"}`
                            case 46:
                                if(message[1][`newLevel`] != undefined){
                                    return `{"type":"levelup","xp":${message[1][`newXP`]},"level":${message[1][`newLevel`]},"token","${message[1][`newToken`]}"}`
                                }else{
                                    return `{"type":"xp","xp":${message[1][`newXP`]}}`
                                }
                            case 48:
                                return `{"type":"none"}`
                                message = message[1];
                                let decodedState = this.stateDecode(message.state);
                                let decodedMap = this.mapDecode(message.gs.map);
                                return `{"type":"state","gt":${message.gt},"rounds":${message.wl},"quickplay":${message.q},"teamsLocked":${message.tl},"teams":${message.tea},"gameType":"${message.ga}","mode":"${message.mo}","balance":${JSON.stringify(message.bal)}, "inputs":${JSON.stringify(message.inputs)}, "framecount":${message.fc}, "stateID":${message.stateID}, "admin":${JSON.stringify(message.admin)}, "map":${JSON.stringify(message.gs.map)}, "mapDecoded":${JSON.stringify(decodedMap)}, "state":${JSON.stringify(message.state)}, "stateDecoded":${JSON.stringify(decodedState)} "random":${JSON.stringify(message.random)}}`;
                            case 52:
                                return `{"type":"playertabbed","id":"${message[1]}","tabbed":${message[2]}}`
                            case 58:
                                return `{"type":"roomnamechange","name":"${message[1]}"}`
                            case 59:
                                if(message[1] == `1`){
                                    return `{"type":"roompassword","password":true}`
                                }else{
                                    return `{"type":"roompassword","password":false}`
                                }
                            case 39:
                                return `{"type":"teamtoggle","teams":"${message[1]}"}`
                        }
                        console.log(`BonkBot could not identify => `)
                        return `{"type":"none"}`
                    }
                    return JSON.parse(switchyswitch(message))
                } catch (error) {
                    console.log(switchyswitch(message))
                    console.log(`Err: ${error}\nBonkbot: Probably just a json parsing error, you can ignore this.`)
                    return `{"type":"none"}`
                }
            }
        },
        autoHandlePacket: function (data) {
            switch (data.type) {
                case "none":
                    break;
                case "ping":
                    if(this.connected == true) {
                        this.socket.send(this.timesync());
                    }
                    break;
                case "mapdata":
                    this.mapdata.ga = data.ga
                    this.mapdata.gt = data.gt
                    this.mapdata.map = data.map
                    this.mapdata.mo = data.mo
                    this.mapdata.q = data.q
                    this.mapdata.tea = data.tea
                    this.mapdata.tl = data.tl
                    this.mapdata.wl = data.wl
                    
                    break;
                case "hostmaprequest":
                    console.log(data)
                    this.events.emit("maprequest", data.m)
                    break;
                case "xp":
                    this.events.emit("xp", data.xp)
                    break;
                case "roomjoin":
                    this.id = data.myid
                    this.team = data.myteam
                    this.game.host = data.hostid
                    this.game.roomid = data.roomid
                    this.game.roombypass = data.roombypass
                    this.game.teamslocked = data.teamslocked
                    for (let i = 0; i < data.playerdata.length; i++) {
                        let player = data.playerdata[i]
                        if(player != undefined || player != null){
                            player.id = i
                            player.username = player.userName
                            delete player.userName
                            player.here = true
                            this.game.players[player.id] = player
                        }
                    }
                    this.events.emit("roomjoin")
                    break;
                case "playerjoin":
                    this.game.players[data.id] = {
                        id: data.id,
                        username: data.username,
                        peerID: data.peerid,
                        level: data.level,
                        guest: data.guest,
                        tabbed: data.tabbed,
                        skin: data.skin,
                        ready: false,
                        here: true,
                    }
                    if(this.game.host == this.id){
                        this.socket.send(this.sendRoomInfo(data.id, data.username))
                    }
                    break;
                case "playerleave":
                    // delete this.game.players[data.id]
                    this.game.players[data.id].here = false
                    break;
                case "hosttransfer":
                    this.game.host = data.newHost
                    break;
                case "playerready":
                    this.game.players[data.id].ready = data.ready
                    break;
                case "teamslock":
                    this.game.teamslocked = data.teamslocked
                    break;
                case "tabbed":
                    this.game.players[data.id].tabbed = data.tabbed
                    break;
                case "roomnamechange":
                    this.game.roomname = data.name
                    break;
                case "roundschange":
                    this.game.rounds = data.rounds
                    break;
                case "hostleave":
                    this.game.host = data.newid
                    break;
                case "playerkick":
                    if (data.id == this.id) {
                        this.banned = true
                    }
                    break;
                case "ratelimit":
                    if(data.limit == "banned"){
                        bot.events.emit("banned")
                    } else {
                        console.log("limited, "+data.limit)
                        this.events.emit("ratelimit", data.limit)
                    }
                    break;
            }
        },
        keepAlive: function () {
            // send timesync every 5 seconds
            this.keepAliveLoop = setInterval(() => {
                if(this.connected == true) {
                    this.socket.send(this.timesync())
                }
            }, 5000)
        },
        init: async function(){
            this.token = await this.getToken()
            this.events.emit('ready')
        },
        connect: async function() {
            let self = this;

            // clear previous events
            // this.events.removeAllListeners()

            this.socketid = await self.getSocketID(this.server);
            this.socketAddr = `wss://${this.server}.bonk.io/socket.io/?EIO=3&transport=websocket&sid=${this.socketid}`
            this.socket = new WebSocket(this.socketAddr);

            this.socket.addEventListener("open", () => {
                this.connected = true;
                this.events.emit('connect');
                this.keepAlive();

                // Ensure messages are sent only after the connection is open
                setTimeout(() => {
                    self.socket.send(`2probe`);
                    self.socket.send(`5`);
                    self.socket.send(self.timesync());
                    self.joinRoom(self);
                }, 0);
            });
            this.socket.addEventListener("message", (e) => {
                let message = self.parseSocket(e.data)
                self.events.emit('packet', message)
                if(message.type == "chatmessage"){
                    for (let i = 0; i < self.game.players.length; i++) {
                        let player = self.game.players[i]
                        if(player != undefined || player != null){
                            if(player.here == true){
                                if(player.id == message.id){
                                    message.username = player.username
                                    message.peerID = player.peerID
                                    message.level = player.level
                                    message.guest = player.guest
                                    message.tabbed = player.tabbed
                                    message.skin = player.avatar
                                    message.ready = player.ready
                                    message.team = player.team
                                    message.id = player.id
                                    message.here = player.here
                                }
                            }
                        }
                    }
                    self.events.emit('chatmessage', message)
                }
                if(message.type == "playerkick"){
                    if(message.id == self.id){
                        self.events.emit('banned')
                        self.events.removeAllListeners()
                        self.socket.close()
                    }
                }
                if(message.type == "playerleave"){
                    self.events.emit('leave', message)
                }
                if(message.type == "playerjoin"){
                    self.events.emit('join', message)
                }
                if(message.type == "playerinput"){
                    self.events.emit('input', message)
                }
                if(message.type == "gamecancel"){
                    self.events.emit('end', message)
                }
            });
            this.socket.addEventListener("close", (e) => {
                self.events.emit('disconnect')
                this.connected = false
            });
        },
        disconnect: async function() {
            this.connected = false;
            //this.socket.removeAllListeners();
            if (this.socket) {
                //this.socket.send("42[14]")
                this.socket.close();
            }
        },
        clearListeners: function() {
            this.events.removeAllListeners();
        }
    }
}
module.exports = {
    createBot: createBot
}