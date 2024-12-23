import { SiteHeader } from "@components/site-header"
import { SiteFooter } from "@components/site-footer"

interface CoursesLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: CoursesLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
