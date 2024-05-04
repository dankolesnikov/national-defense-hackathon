import fs from "fs";

type Message = {
  id: string;
  text: string;
  locations: string[];
  tags: string[];
  sentiment: number;
  date: Date;
};

export const getMessages = (): Message[] => {
  const filePath = "src/app/data/messages.json";
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const messages: Message[] = JSON.parse(rawData).map((item: any) => {
      return {
        id: item.id,
        text: item.text,
        locations: item.locations,
        tags: item.tags,
        sentiment: item.sentiment,
        date: new Date(item.date),
      };
    });
    return messages;
  } catch (error) {
    console.error("Error reading messages file:", error);
    return [];
  }
};
