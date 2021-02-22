import {Sequelize,STRING,TEXT,INTEGER} from 'sequelize';

const sequelizeInstance = new Sequelize('database','champion','generation5',
{
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'users.sqlite'
});

let file = require('./secret.json');

import {DidProbabilityHappen} from './virtues/Generation';
import {Channel, Client as DiscordClient, TextChannel, User} from 'discord.js';
const bot = new DiscordClient();
const AGENT = file.AGENT;

bot.login(AGENT);

const foundMessage = 'You Found a Shiny Pokemon!!';
const failMessage = 'Sorry! You will have to try again!'
const UserTable = sequelizeInstance.define('users',
{
    discordID:
    {
        type: INTEGER,
        unique:true
    },
    username:
    {
        type:STRING
    },
    shiniesFound:
    {
        type:INTEGER,
        defaultValue: 0,
        allowNull: false
    }

});



async function ExecuteCommand(command:string,messageAuthor:User,channel:TextChannel)
{
    let probabilityMap:{[commandName:string]:string}
    probabilityMap["~encounter"]='1/8192'
    probabilityMap["~neoEncounter"]='1/4096'
    probabilityMap["~charmEncounter"]='3/8192'
    probabilityMap["~neoCharmEncounter"]='3/4096'
    if(command in probabilityMap && DidProbabilityHappen(probabilityMap[command]))
    {
        const data = 
        {
            discordID: messageAuthor.id,
            // username: messageAuthor.username+messageAuthor.discriminator
            username: `${messageAuthor.username}#${messageAuthor.discriminator}`
        }
        await UpdateOnShinyFound(data);
        channel.send(foundMessage);
    }
    else channel.send(failMessage);
    
    
}

bot.once('ready',()=>
{
    UserTable.sync();
});

bot.on('message',async message=>
{
    if(message.content.startsWith('~'))
    {
        ExecuteCommand(message.content,message.author,message.channel as TextChannel);
    }
});

async function UpdateOnShinyFound(data)
{
    const foundUser = await UserTable.findOne({where:{discordID:data.discordID}})
    if(foundUser) //
    {
        // Tags.update({description:value},{where:{name:id}})
        await UserTable.update({shiniesFound:foundUser["shiniesFound"]+1},{where:{discordID:data.discordID}})
    }
    else //create it
    {    
        await UserTable.create({discordID:data.discordID,username:data.username})
    }
}