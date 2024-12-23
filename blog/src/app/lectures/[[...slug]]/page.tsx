import { Mdx } from "@components/mdx-components";
import { LecturesPager } from "@components/pager";
import { DashboardTableOfContents } from "@components/toc";
import { getTableOfContents } from "@lib/toc";
import { absoluteUrl, cn } from "@lib/utils";
import { siteConfig } from "@shared/config/site";
import { badgeVariants } from "@ui/badge";
import { allLectures } from "contentlayer/generated";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";

type Params = Promise<{ slug: string[] }>

async function getLectureFromParams({ params }: { params: Awaited<Params> }) {
  const slug = params.slug?.join("/") || ""
  const lecture = allLectures.find((lecture) => lecture.slugAsParams === slug)

  if (!lecture) {
    return null
  }

  return lecture
}


export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  const lecture = await getLectureFromParams({ params })

  if (!lecture) {
    return {}
  }

  return {
    title: lecture.title,
    description: lecture.description,
    openGraph: {
      title: lecture.title,
      description: lecture.description,
      type: "article",
      url: absoluteUrl(lecture.slug),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    // twitter: {
    //   card: "summary_large_image",
    //   title: lecture.title,
    //   description: lecture.description,
    //   images: [siteConfig.ogImage],
    //   creator: "mleducation",
    // },
  }
}

export async function generateStaticParams(): Promise<Awaited<Params>[]> {
  return allLectures.map((lecture) => ({
    slug: lecture.slugAsParams.split("/"),
  }))
}


export default async function LecturePage(props: { params: Params }) {
  const params = await props.params;
  const lecture = await getLectureFromParams({ params });

  if (!lecture) {
    return notFound();
  }

  const toc = await getTableOfContents(lecture.body.raw)

  return (
    <div className="relative px-4 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <div className="truncate">Лекции</div>
          <ChevronRight className="h-3.5 w-3.5" />
          <div className="text-foreground">{lecture.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            {lecture.title}
          </h1>
          {lecture.description && (
            <p className="text-base text-muted-foreground">
              <Balancer>{lecture.description}</Balancer>
            </p>
          )}
        </div>
        {lecture.links ? (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {lecture.links.map((link, idx) => (
              <Link
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ))}
          </div>
        ) : null}
        <div className="pb-12 pt-8">
          <Mdx code={lecture.body.code} />
        </div>
        <LecturesPager lecture={lecture} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
          <div className="no-scrollbar h-full overflow-auto pb-10">
            {lecture.toc && <DashboardTableOfContents toc={toc} />}
          </div>
        </div>
      </div>
    </div>
  )
}