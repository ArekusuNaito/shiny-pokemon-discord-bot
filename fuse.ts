let fusebox = require('fuse-box').fusebox;
// import {fusebox} from 'fuse-box'; //For some reason the module-resolution doesn't really work
const fuse = fusebox({
  entry: './bot.ts',
  target: 'server',
//   devServer: true,
//   webIndex: true,
});

fuse.runDev();

//This function auto-restarts the node process so we can just hot-reload on dev.
async function startBundling()
{
    const {onComplete} = await fuse.runDev();
    onComplete(foo=>foo.server.start());
}

startBundling();