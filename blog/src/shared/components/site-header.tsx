import Link from "next/link"
import { siteConfig } from "@shared/config/site"
import { Icons } from "@components/icons"
import { ModeSwitcher } from "@components/mode-switcher"
import { Button } from "@ui/button"

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">

          <div className="mr-4 lex">
            <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
              <Icons.logo className="h-6 w-6" />
              <span className="hidden font-bold lg:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center gap-2 justify-end">
            <nav className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
