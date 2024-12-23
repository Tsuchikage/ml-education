import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer2/source-files"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"


/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
}


const Link = defineNestedType(() => ({
  name: 'Link',
  fields: {
    label: { type: 'string', required: true },
    url: { type: 'string', required: true },
  },
}))


export const Lecture = defineDocumentType(() => ({
  name: "Lecture",
  filePathPattern: `lectures/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "string",
      required: true,
    },
    toc: {
      type: "boolean",
      default: true,
      required: false,
    },
    links: {
      type: "list",
      of: Link,
    },
    sortOrder: {
      type: "number",
      required: true,
    },
    tags: {
      type: "list",
      of: { type: 'string' },
      required: true,
    }
  },
  computedFields,
}))


export default makeSource({
  contentDirPath: "./src",
  documentTypes: [Lecture],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // rehypeComponent,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
})
