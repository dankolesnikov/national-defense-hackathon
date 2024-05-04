import data from "../app/data/messages_subset.json";

type Message = {
  id: string;
  text: string;
  locations: string[];
  tags: string[];
  sentiment: number;
  date: Date;
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
