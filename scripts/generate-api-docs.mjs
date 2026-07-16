import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const componentsIndexPath = path.join(repoRoot, "packages/rui/src/components/index.ts")
const apiDir = path.join(repoRoot, "apps/docs/src/content/api/en")
const packageImportPath = "@ripple-design/rui"

function readFile(filePath) {
    return ts.sys.readFile(filePath) ?? ""
}

function parseSource(filePath) {
    return ts.createSourceFile(filePath, readFile(filePath), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

function getJsDocText(node) {
    const docs = ts.getJSDocCommentsAndTags(node)
        .filter((entry) => ts.isJSDoc(entry))
        .map((entry) => entry.comment)
        .filter(Boolean)
        .map((comment) => {
            if (typeof comment === "string") return comment
            return comment.map((part) => (typeof part === "string" ? part : part.text)).join("")
        })

    return docs.join(" ").replace(/\s+/g, " ").trim()
}

function getPropertyName(node) {
    if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
        return node.name.text
    }
    return node.name.getText()
}

function getTypeText(node, sourceFile) {
    return node.type ? node.type.getText(sourceFile) : "unknown"
}

function collectLocalTypeAliases(sourceFile) {
    const aliases = new Map()

    for (const statement of sourceFile.statements) {
        if (ts.isTypeAliasDeclaration(statement)) {
            aliases.set(statement.name.text, statement)
        }
    }

    return aliases
}

function collectPropsFromTypeNode(typeNode, sourceFile, aliases, seen = new Set()) {
    if (!typeNode) return []

    if (ts.isParenthesizedTypeNode(typeNode)) {
        return collectPropsFromTypeNode(typeNode.type, sourceFile, aliases, seen)
    }

    if (ts.isTypeLiteralNode(typeNode)) {
        return typeNode.members
            .filter((member) => ts.isPropertySignature(member) && member.name)
            .map((member) => ({
                name: getPropertyName(member),
                type: getTypeText(member, sourceFile),
                required: !member.questionToken,
                description: getJsDocText(member),
            }))
    }

    if (ts.isIntersectionTypeNode(typeNode)) {
        return typeNode.types.flatMap((part) => collectPropsFromTypeNode(part, sourceFile, aliases, seen))
    }

    if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
        const aliasName = typeNode.typeName.text
        if (seen.has(aliasName)) return []
        const alias = aliases.get(aliasName)
        if (!alias) return []
        const nextSeen = new Set(seen)
        nextSeen.add(aliasName)
        return collectPropsFromTypeNode(alias.type, sourceFile, aliases, nextSeen)
    }

    return []
}

function collectComponentExports() {
    const source = readFile(componentsIndexPath)
    const matches = [...source.matchAll(/export\s+\{\s+default\s+as\s+(R\w+)\s+\}\s+from\s+"(\.\/[^\"]+\.vue)"/g)]

    return new Map(
        matches.map((match) => {
            const componentName = match[1]
            const relativeVuePath = match[2]
            const componentDir = path.dirname(relativeVuePath)
            const typesPath = path.resolve(path.dirname(componentsIndexPath), componentDir, "types.ts")
            return [componentName, { typesPath }]
        }),
    )
}

function routeSlugToComponentName(routeSlug) {
    const pascal = routeSlug
        .split("-")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("")
    return `R${pascal}`
}

function escapeTableText(value) {
    return value.replace(/\|/g, "\\|").replace(/\n/g, " ")
}

function generatePropsTable(props) {
    if (!props.length) {
        return "This component has no public props."
    }

    const lines = [
        "| Name | Type | Required | Description |",
        "| --- | --- | --- | --- |",
        ...props.map((prop) => {
            const description = prop.description || "—"
            return `| \`${escapeTableText(prop.name)}\` | \`${escapeTableText(prop.type)}\` | ${prop.required ? "yes" : "no"} | ${escapeTableText(description)} |`
        }),
    ]

    return lines.join("\n")
}

function generateBody(componentName, props, typesPath) {
    return [
        "<!-- AUTO-GENERATED:START -->",
        "",
        "## Import",
        "",
        "```ts",
        `import { ${componentName} } from \"${packageImportPath}\"`,
        "```",
        "",
        "## Props",
        "",
        generatePropsTable(props),
        "",
        `Generated from \`${path.relative(repoRoot, typesPath).replace(/\\/g, "/")}\`.`,
        "",
        "<!-- AUTO-GENERATED:END -->",
    ].join("\n")
}

function getFrontmatter(content) {
    if (!content.startsWith("---\n")) return { frontmatter: "", rest: content }
    const end = content.indexOf("\n---\n", 4)
    if (end === -1) return { frontmatter: "", rest: content }
    const frontmatter = content.slice(0, end + 5)
    const rest = content.slice(end + 5)
    return { frontmatter, rest }
}

function writeApiDoc(filePath, body) {
    const existing = readFile(filePath)
    const { frontmatter } = getFrontmatter(existing)
    const next = `${frontmatter}\n${body}\n`
    ts.sys.writeFile(filePath, next)
}

function main() {
    const componentExports = collectComponentExports()
    const apiFiles = ts.sys.readDirectory(apiDir, [".md"], undefined, ["**/*.md"])

    for (const apiFile of apiFiles) {
        const routeSlug = path.basename(apiFile, ".md")
        const componentName = routeSlugToComponentName(routeSlug)
        const exportInfo = componentExports.get(componentName)

        if (!exportInfo) {
            console.warn(`Skipping ${routeSlug}: no matching component export for ${componentName}`)
            continue
        }

        const sourceFile = parseSource(exportInfo.typesPath)
        const aliases = collectLocalTypeAliases(sourceFile)
        const propsAlias = aliases.get(`${componentName}Props`)

        if (!propsAlias) {
            console.warn(`Skipping ${routeSlug}: no props type named ${componentName}Props`)
            continue
        }

        const props = collectPropsFromTypeNode(propsAlias.type, sourceFile, aliases)
        const body = generateBody(componentName, props, exportInfo.typesPath)
        writeApiDoc(apiFile, body)
        console.log(`Generated ${path.relative(repoRoot, apiFile).replace(/\\/g, "/")}`)
    }
}

main()
