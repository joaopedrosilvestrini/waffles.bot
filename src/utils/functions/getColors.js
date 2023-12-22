import colors from 'colors';

const log = (message = message.replace(' ', '⠀'), type = types[0]) => {
  
  const types = ['error', 'system', 'commands', 'cache', 'success', 'client', 'notice', 'lavalink', 'database'];

  const colorFormat = {
    error: ['[ ❌ Error ]'.bgRed, 'red'],
    system: ['[ 💻 System ]'.bgBlue, 'blue'],
    commands: ['[ 🤖 Commands ]'.bgCyan, 'cyan'],
    cache: ['[ 📙 Cache ]'.bgGreen, 'green'],
    success: ['[ ✔️ Success ]'.bgGreen, 'green'],
    client: ['[ 💁 Client ]'.bgMagenta, 'magenta'],
    notice: ['[ 🔔 Notice ]'.bgYellow + '⠀➜ '.italic.red, 'yellow'],
    lavalink: ['[🎶 Lavalink]'.bgCyan + '⠀➜ '.italic.red, 'cyan'],
    database: ['[🎲 MongoDB]'.bgMagenta, 'magenta']
  };

  if (!types.includes(type)) {
    type = types[0];
  }

  const [typeString, color] = colorFormat[type];

  console.log(`${typeString}⠀${colors[color](message)}`);
}

export default log;