import { Client } from 'discord.js';
import { Container } from 'typedi';

const discord = new Client();

export function Discord() {
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => discord,
    });
  };
}


export function DiscordChannel() {
  const channel = discord.channels.get(
    String(process.env.DISCORD_CHANNEL_ID),
  );
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => channel
    });
  };
}
