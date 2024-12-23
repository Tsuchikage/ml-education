import { Illustrations } from "@components/illustrations";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@components/page-header"
import { allLectures } from "contentlayer/generated";
import Link from "next/link";

const ILLUSTARTIONS = [
  Illustrations.sleeping,
  Illustrations.lifting,
  Illustrations.work
];

export default function HomePage() {
  const sortedLectures = allLectures.sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <div className="relative flex flex-col flex-1">
      <PageHeader>
        <PageHeaderHeading>Машинное обучение</PageHeaderHeading>
        <PageHeaderDescription>
          Полный список всех доступных лекций. 
        </PageHeaderDescription>
      </PageHeader>
      <div className="container-wrapper flex-1">
        <div className="container py-6 grid auto-rows-min grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 list-none h-auto">
          <ul className="contents">
            {sortedLectures.map((item, idx) => {
              const Illustration = ILLUSTARTIONS[idx % ILLUSTARTIONS.length];
              return (
                <li key={idx} className="list-none min-h-[136px]">
                  <article className="h-full">
                    <Link className="group flex flex-col h-full p-4 bg-background rounded-xl transition-all relative border shadow hover:bg-accent" href={item.slug || "#"}>
                      <header className="mb-4">
                        <div className="mb-1">
                          {item.tags.map((tag, index) => (
                            <p
                              key={index}
                              className="inline-block m-0 text-xs text-muted-foreground [&:not(:last-child)]:after:content-['•'] [&:not(:last-child)]:after:px-[0.33em]"
                            >
                              {tag}
                            </p>
                          ))}
                        </div>
                        <h2 className="text-xl">{item.title}</h2>
                      </header>
                      <div className="flex content-center m-[auto_0_0] py-5 rounded overflow-hidden">
                        <div className="max-w-full h-[132px] m-auto" role="img">
                          <Illustration className="h-full w-full dark:fill-white" />
                        </div>
                      </div>
                    </Link>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
