import Link from "next/link"
import { Lecture } from "contentlayer/generated"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { navConfig } from "@shared/config/nav"
import { Button } from "@ui/button"

interface LecturesPagerProps {
  lecture: Lecture
}

export function LecturesPager({ lecture }: LecturesPagerProps) {
  const pager = getPagerForCourse(lecture)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Button variant="ghost" asChild>
          <Link href={pager.prev.href}>
            <ChevronLeft />
            <span className="hidden sm:block">{pager.prev.title}</span>
            <span className="sm:hidden block">Назад</span>
          </Link>
        </Button>
      )}
      {pager?.next?.href && (
        <Button variant="ghost" className="ml-auto" asChild>
          <Link href={pager.next.href}>
            <span className="hidden sm:block">{pager.next.title}</span>
            <span className="sm:hidden block">Вперёд</span>
            <ChevronRight />
          </Link>
        </Button>
      )}
    </div>
  )
}

export function getPagerForCourse(lecture: Lecture) {
  const nav = navConfig.mainNav
  const flattenedLinks = [null, ...nav, null]
  const activeIndex = flattenedLinks.findIndex(
    (link) => lecture.slug === link?.href
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return {
    prev,
    next,
  }
}
