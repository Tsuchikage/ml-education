import { toc } from "mdast-util-toc"
import { remark } from "remark"
import { visit } from "unist-util-visit"

const textTypes = ["text", "emphasis", "strong", "inlineCode"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenNode(node: any) {
  const p: string[] = []
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return
    p.push(node.value)
  })
  return p.join(``)
}

interface Item {
  title: string
  url: string
  items?: Item[]
}

interface Items {
  items?: Item[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getItems(node: any, current: any): Items {
  if (!node) {
    return {}
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.url = item.url
        current.title = flattenNode(node)
      }

      if (item.type === "text") {
        current.title = flattenNode(node)
      }
    })

    return current
  }

  if (node.type === "list") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current.items = node.children.map((i: any) => getItems(i, {}))

    return current
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {})

    if (node.children.length > 1) {
      getItems(node.children[1], heading)
    }

    return heading
  }

  return {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getToc = () => (node: any, file: any) => {
  const table = toc(node)
  const items = getItems(table.map, {})

  file.data = items
}

export type TableOfContents = Items

export async function getTableOfContents(
  content: string
) {
  const result = await remark().use(getToc).process(content)

  return result.data as unknown as Promise<TableOfContents>
}
