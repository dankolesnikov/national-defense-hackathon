"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "@mantine/core/styles.css";
import { AppShell, Title } from "@mantine/core";
import { RadarChart } from "@mantine/charts";
import { Timeline, Text } from "@mantine/core";
import {
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
} from "@tabler/icons-react";
import { getMessages } from "@/utils/parsingUtils";
import { useMemo, useState } from "react";
import { DatePickerInput } from "@mantine/dates";

export default function HomePage() {
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

  return (
    <AppShell header={{ height: { base: 48, sm: 60, lg: 76 } }}>
      <AppShell.Header
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Title order={1}>Torch</Title>
      </AppShell.Header>
      <AppShell.Main>
        <DatePickerInput
          type="range"
          label="Pick date range"
          placeholder="Pick date range"
          value={dateRange}
          onChange={setDateRange}
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
