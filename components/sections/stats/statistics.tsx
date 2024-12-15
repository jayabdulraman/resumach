'use client'
import { Counter } from "./counter";

type Statistic = {
  name: string;
  value: number;
};

export function StatisticsSection() {
  const stats: Statistic[] = [
    { name: `Rating`, value: 4 },
    { name: `Users`, value: 500 },
    { name: `Resumes Tailored`, value: 1_000 },
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-3 gap-x-8 gap-y-16 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-3">
              <dt className="text-base leading-7 opacity-60">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight sm:text-5xl">
                <Counter from={0} to={stat.value} />+
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
