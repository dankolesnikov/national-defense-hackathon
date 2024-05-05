import data from "../app/data/messages.json";
import eventsData from "../app/data/events.json";
import { omit } from "lodash";

export type Message = {
  id: string;
  text: string;
  locations: string[];
  tags: string[];
  sentiment: number;
  date: Date;
};

type Event = {
  title: string;
  description: string;
  severity: string;
  date: Date;
  locations: string[];
};

export const getMessages = (): Message[] => {
  try {
    const messages: Message[] = data.map((item: any) => {
      return {
        id: item.id,
        text: item.text,
        locations: item.locations,
        tags: item.tags,
        sentiment: Number(item.sentiment),
        date: new Date(item.date),
      };
    });
    return messages;
  } catch (error) {
    console.error("Error reading messages file:", error);
    return [];
  }
};

export const getEvents = (): Event[] => {
  try {
    const events: Event[] = eventsData.map((item: any) => {
      return {
        ...omit(item, "date"),
        date: new Date(item.date),
      };
    });
    return events;
  } catch (error) {
    console.error("Error reading events file:", error);
    return [];
  }
};
