import meow from 'meow';
import * as commands from './commands';

const cli = meow(`
    Usage:
        $ lightning-jackpot [command] [options]
    Commands:
        seed                       # Database seeding
        seedPair                   # Manually add a seed pair
        kpi                        # Manually run KPI
        start <game>               # Start game
        stop <game>                # Stop game
        restart <game>             # Restart game
    Options:
        --help         # Output usage information
        --version      # Output the version number
    Examples:
        $ lightning-jackpot start roulette
        $ lightning-jackpot stats roulette 30
`);

if (!cli.input.length) {
  cli.showHelp();
}

const command: (cli) => void = commands[cli.input[0]];

command(cli);
