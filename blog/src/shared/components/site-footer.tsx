import { siteConfig } from "@shared/config/site"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-6 md:px-8 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Developed by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Dmitriy Zhukov
            </a>
            , AI Talent Hub student. If something doesn’t work, it’s not a bug — it’s an{" "}
            <b>
              AI-powered feature
            </b>
            !
          </div>
        </div>
      </div>
    </footer>
  )
}
