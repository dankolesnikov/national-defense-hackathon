"use client";
import Image from "next/image";
import "@mantine/core/styles.css";
import { RadarChart, Sparkline } from "@mantine/charts";
import {
  AppShell,
  Card,
  Group,
  SimpleGrid,
  Space,
  Stack,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { Timeline, Text } from "@mantine/core";
import {
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
  IconNumber6,
  IconNumber7,
  IconNumber8,
  IconNumber9,
} from "@tabler/icons-react";
import torch_dark_mode from "../../public/torch_white.svg";
import torch_light_mode from "../../public/torch_black.svg";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { getEvents } from "@/utils/parsingUtils";
import Maps from "./components/Maps";
import { orderBy } from "lodash";

const renderIconTimeline = (index: number) => {
  switch (index) {
    case 0:
      return <IconNumber1 size={12} />;
    case 1:
      return <IconNumber2 size={12} />;
    case 2:
      return <IconNumber3 size={12} />;
    case 3:
      return <IconNumber4 size={12} />;
    case 4:
      return <IconNumber5 size={12} />;
    case 5:
      return <IconNumber6 size={12} />;
    case 6:
      return <IconNumber7 size={12} />;
    case 7:
      return <IconNumber8 size={12} />;
    case 8:
      return <IconNumber9 size={12} />;
    default:
      return <IconNumber9 size={12} />;
  }
};
import { Message, getMessages } from "@/utils/parsingUtils";
import { useMemo, useState } from "react";
import { DatePickerInput, DatesProvider } from "@mantine/dates";

export default function HomePage() {
  const { colorScheme } = useMantineColorScheme();
  const messages = useMemo(() => getMessages(), []);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const events = useMemo(() => getEvents(), []);
  const selectedEvents = useMemo(() => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const dateFilteredEvents =
      startDate && endDate
        ? events.filter((event) => {
            const roundedDate = new Date(event.date);
            roundedDate.setHours(0, 0, 0, 0);
            return roundedDate >= startDate && roundedDate <= endDate;
          })
        : events;
    return orderBy(
      dateFilteredEvents.map((item) => {
        return {
          ...item,
          ranking: item.severity === "important" ? 1 : 0,
        };
      }),
      "ranking",
      "desc"
    );
  }, [dateRange, events]);

  const importantEventsCount = useMemo(
    () =>
      selectedEvents.filter((item) => item.severity === "important").length - 1,
    [selectedEvents]
  );

  const { earliestDate, latestDate } = useMemo(() => {
    let earliestDate = messages[0].date;
    let latestDate = messages[0].date;

    for (const message of messages) {
      if (message.date < earliestDate) {
        earliestDate = message.date;
      } else if (message.date > latestDate) {
        latestDate = message.date;
      }
    }

    return { earliestDate, latestDate };
  }, [messages]);

  const selectedMessages = useMemo(() => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    return startDate && endDate
      ? messages.filter((message) => {
          const roundedDate = new Date(message.date);
          roundedDate.setHours(0, 0, 0, 0);
          return roundedDate >= startDate && roundedDate <= endDate;
        })
      : messages;
  }, [dateRange, messages]);

  const countedTags = useMemo(() => {
    const tagCounts = selectedMessages.reduce((counts, message) => {
      message.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    const tagCountArray = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
    }));
    return tagCountArray.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [selectedMessages]);

  const chunkedMessages = useMemo(() => {
    // Iterate through messages
    const groupedMessages = selectedMessages.reduce((acc, message) => {
      const dayOfMonth = String(message.date.getDate()).padStart(2, "0");
      const month = String(message.date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month index (0-11)
      const year = message.date.getFullYear();

      // Combine them into a single string
      const dateString = `${dayOfMonth}-${month}-${year}`;

      if (!acc[dateString]) {
        acc[dateString] = [];
      }

      // Add message to corresponding date
      acc[dateString].push(message);
      return acc;
    }, {} as Record<string, Message[]>);

    // Convert object to array of arrays
    const result = Object.values(groupedMessages);

    return result;
  }, [selectedMessages]);

  const sentimentTrend = useMemo(() => {
    const aggregatedSentiments = {} as Record<string, number>;

    // Iterate over the keys (date strings) in the object
    for (const dateKey in chunkedMessages) {
      let sentimentSum = 0;
      let sentimentCount = 0;

      // Iterate over the array of messages for the current day
      chunkedMessages[dateKey].forEach((message) => {
        // Add sentiment value to the sum
        sentimentSum += message.sentiment;
        // Increment sentiment count
        sentimentCount++;
      });

      // Calculate average sentiment for the current day
      const averageSentiment =
        sentimentCount > 0 ? sentimentSum / sentimentCount : 0;

      // Store the aggregated sentiment value for the current day in the aggregatedSentiments object
      aggregatedSentiments[dateKey] = averageSentiment;
    }

    // Sort the aggregatedData object by day from earliest to latest
    const sortedAggregatedData = Object.entries(aggregatedSentiments)
      .sort(([date1], [date2]) => date1.localeCompare(date2))
      .map(([_, averageSentiment]) => averageSentiment);

    return sortedAggregatedData;
  }, [chunkedMessages]);

  const countedLocations = useMemo(() => {
    const tagCounts = selectedMessages.reduce((counts, message) => {
      message.locations?.forEach((loc) => {
        if (loc === "") {
          return;
        }
        counts[loc] = (counts[loc] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    const locationCountArray = Object.entries(tagCounts).map(
      ([location, count]) => ({
        location,
        count,
      })
    );
    return locationCountArray.sort((a, b) => b.count - a.count).slice(0, 7);
  }, [selectedMessages]);

  return (
    <AppShell header={{ height: { base: 48, sm: 60, lg: 76 } }}>
      <AppShell.Header
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Group justify="space-between" mr="1rem" pt="0.6rem">
          <Group gap={0}>
            <Image
              src={colorScheme === "light" ? torch_light_mode : torch_dark_mode}
              alt={""}
              width={50}
              height={50}
            />
            <Title fz="h1" fw="300">
              Torch - Interactive SITREPs
            </Title>
          </Group>
          <DarkModeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main
        style={{
          backgroundColor: colorScheme === "light" ? "#f8f9fa" : "#242424",
        }}
      >
        <SimpleGrid cols={2} m="1rem">
          <div>
            <Stack>
              <Card shadow="sm">
                <DatePickerInput
                  allowSingleDateInRange
                  type="range"
                  label="Pick date range"
                  minDate={earliestDate}
                  maxDate={latestDate}
                  placeholder="Pick date range"
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Card>
              <Card shadow="sm">
                <Text pb="2rem">Key Events</Text>
                <Timeline
                  active={importantEventsCount}
                  bulletSize={24}
                  lineWidth={2}
                  color="red"
                >
                  {selectedEvents.map((eventPayload, index) => {
                    return (
                      <Timeline.Item
                        key={eventPayload.title}
                        bullet={renderIconTimeline(index)}
                        title={eventPayload.title}
                      >
                        <Text c="dimmed" size="sm">
                          {eventPayload.description}
                        </Text>
                        <Text size="xs" mt={4}>
                          {eventPayload.date.toLocaleString()}
                        </Text>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </Card>
            </Stack>
          </div>
          <div>
            <Card shadow="sm">
              <Text>Themes</Text>
              <Card.Section>
                <RadarChart
                  h={300}
                  data={countedTags}
                  dataKey="tag"
                  withPolarRadiusAxis
                  series={[{ name: "count", color: "blue.4", opacity: 0.2 }]}
                />
              </Card.Section>
            </Card>
            <Card mt="1rem" mb="1rem" shadow="sm">
              <Text>Location Mentions</Text>
              <Card.Section>
                <RadarChart
                  h={300}
                  data={countedLocations}
                  dataKey="location"
                  withPolarRadiusAxis
                  series={[{ name: "count", color: "blue.4", opacity: 0.2 }]}
                />
              </Card.Section>
            </Card>
            <Maps />
            <Card mt="1rem" shadow="sm">
              <Text>Daily Sentiment Trend</Text>
              <Card.Section>
                <Sparkline
                  w={900}
                  h={400}
                  data={sentimentTrend}
                  curveType="linear"
                  trendColors={{
                    positive: "teal.6",
                    negative: "red.6",
                    neutral: "gray.5",
                  }}
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </Card.Section>
            </Card>
          </div>
        </SimpleGrid>
      </AppShell.Main>
    </AppShell>
  );
}
