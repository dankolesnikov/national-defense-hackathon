"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "@mantine/core/styles.css";
import { AppShell, Group, Title, useMantineColorScheme } from "@mantine/core";
import { RadarChart, Sparkline } from "@mantine/charts";
import { Timeline, Text } from "@mantine/core";
import {
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
} from "@tabler/icons-react";
import torch_dark_mode from "../../public/torch_white.svg";
import torch_light_mode from "../../public/torch_black.svg";
import { DarkModeToggle } from "./components/DarkModeToggle";
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

  const selectedMessages = useMemo(() => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    return startDate && endDate
      ? messages.filter(
          (message) => message.date >= startDate && message.date <= endDate
        )
      : messages;
  }, [dateRange, messages]);

  const countedTags = useMemo(() => {
    const tagCounts = selectedMessages.reduce((counts, message) => {
      message.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    const tagCountArray = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
    }));
    return tagCountArray;
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

  return (
    <AppShell header={{ height: { base: 48, sm: 60, lg: 76 } }}>
      <AppShell.Header
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Group justify="space-between" pr="0.5rem" pt="0.6rem">
          <Group gap={0}>
            <Image
              src={colorScheme === "light" ? torch_light_mode : torch_dark_mode}
              alt={""}
              width={50}
              height={50}
            />
            <Title fz="h1" fw="300">
              Torch
            </Title>
          </Group>
          <DarkModeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <DatePickerInput
          type="range"
          label="Pick date range"
          placeholder="Pick date range"
          value={dateRange}
          onChange={setDateRange}
        />
        <Sparkline
          w={200}
          h={60}
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
        <RadarChart
          h={300}
          data={countedTags}
          dataKey="tag"
          withPolarRadiusAxis
          series={[{ name: "count", color: "blue.4", opacity: 0.2 }]}
        />
        <Timeline active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item bullet={<IconNumber1 size={12} />} title="New branch">
            <Text c="dimmed" size="sm">
              You&apos;ve created new branch{" "}
              <Text variant="link" component="span" inherit>
                fix-notifications
              </Text>{" "}
              from master
            </Text>
            <Text size="xs" mt={4}>
              2 hours ago
            </Text>
          </Timeline.Item>

          <Timeline.Item bullet={<IconNumber2 size={12} />} title="Commits">
            <Text c="dimmed" size="sm">
              You&apos;ve pushed 23 commits to
              <Text variant="link" component="span" inherit>
                fix-notifications branch
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              52 minutes ago
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconNumber3 size={12} />}
            title="Pull request"
          >
            <Text c="dimmed" size="sm">
              You&apos;ve submitted a pull request
              <Text variant="link" component="span" inherit>
                Fix incorrect notification message (#187)
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              34 minutes ago
            </Text>
          </Timeline.Item>

          <Timeline.Item bullet={<IconNumber4 size={12} />} title="Code review">
            <Text c="dimmed" size="sm">
              <Text variant="link" component="span" inherit>
                Robert Gluesticker
              </Text>{" "}
              left a code review on your pull request
            </Text>
            <Text size="xs" mt={4}>
              12 minutes ago
            </Text>
          </Timeline.Item>
        </Timeline>
      </AppShell.Main>
      {/* <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/app/page.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>Explore starter templates for Next.js.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL with Vercel.
            </p>
          </a>
        </div>
      </main> */}
    </AppShell>
  );
}
