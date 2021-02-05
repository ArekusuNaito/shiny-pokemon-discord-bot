let file = require('./secret.json');

import {DidProbabilityHappen} from './virtues/Generation';
import {Client as DiscordClient} from 'discord.js';
const bot = new DiscordClient();
const AGENT = file.AGENT;

bot.login(AGENT);

const foundMessage = 'You Found a Shiny Pokemon!!';
const failMessage = 'Sorry! You will have to try again!'

let resultMap =
{
    "true":foundMessage,
    "false":failMessage
}


bot.on('message',message=>
{
    if(message.content.startsWith('~'))
    {
        if(message.content==='~encounter') //Generation 1-5
        {
            const reply = resultMap[DidProbabilityHappen('1/8192').toString()]
            message.channel.send(reply);
        }
        else if(message.content==='~neoEncounter') //Generation 6++
        {
            const reply = resultMap[DidProbabilityHappen('1/4096').toString()]
            message.channel.send(reply);
        }
        else if(message.content==='~charmEncounter') //Generation 5 Shiny Charm
        {
            const reply = resultMap[DidProbabilityHappen('3/8192').toString()]
            message.channel.send(reply);
        }
        else if(message.content==='~neoCharmEncounter') //Generation 6++ Shiny Charm
        {
            const reply = resultMap[DidProbabilityHappen('3/4096').toString()]
            message.channel.send(reply);
        }
    }
});