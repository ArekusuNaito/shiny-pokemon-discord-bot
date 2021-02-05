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
import {Client as DiscordClient} from 'discord.js';
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

let resultMap:any =
{
    "true":foundMessage,
    "false":failMessage
}

bot.once('ready',()=>
{
    UserTable.sync();
});

bot.on('message',async message=>
{
    if(message.content.startsWith('~'))
    {
        const data = 
        {
            discordID: message.author.id,
            username: message.author.username+message.author.discriminator
        }
        if(message.content==='~encounter') //Generation 1-5
        {
            if(DidProbabilityHappen('1/8192'))
            {
                
                await UpdateOnShinyFound(data);
                message.channel.send(foundMessage);
            }
            else message.channel.send(failMessage);
        }
        
        // neoEncounter
        else if(message.content==='~neoEncounter') //Generation 6++
        {
            if(DidProbabilityHappen('1/4096'))
            {
                
                await UpdateOnShinyFound(data);
                message.channel.send(foundMessage);
            }
            else message.channel.send(failMessage);
        }
        // charmEncounter
        else if(message.content==='~charmEncounter') //Generation 1-5 with Shiny Charm
        {
            if(DidProbabilityHappen('3/8192'))
            {
                
                await UpdateOnShinyFound(data);
                message.channel.send(foundMessage);
            }
            else message.channel.send(failMessage);
        }
        // neoCharmEncounter
        else if(message.content==='~neoCharmEncounter') //Generation 6++ with Shiny Charm
        {
            if(DidProbabilityHappen('3/4096'))
            {
                
                await UpdateOnShinyFound(data);
                message.channel.send(foundMessage);
            }
            else message.channel.send(failMessage);
        }

        //Debug
        else if(message.content==='~debugCheat')
        {
            if(DidProbabilityHappen('9/10'))
            {
                const data = 
                {
                    discordID: message.author.id,
                    username: message.author.username+message.author.discriminator
                }
                await UpdateOnShinyFound(data);
            }    
            
        }
        else if(message.content==="~progress")
        {
            const foundUser = await UserTable.findOne({where:{discordID:message.author.id}})
            if(foundUser)
            {
                message.channel.send(`${foundUser["username"]} you have found ${foundUser['shiniesFound']} Shinies`)
            }
            else
            {
                const data = 
                {
                    discordID: message.author.id,
                    username: message.author.username+message.author.discriminator
                }
                await UserTable.create({discordID:data.discordID,username:data.username});
                message.channel.send(`${data.username} you have found 0 Shinies`)
            }
        }
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