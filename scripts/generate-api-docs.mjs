import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const componentsIndexPath = path.join(repoRoot, "packages/rui/src/components/index.ts")
const apiDir = path.join(repoRoot, "apps/docs/src/content/api/en")
const packageImportPath = "@ripple-design/rui"
const generatedStartMarker = "<!-- AUTO-GENERATED:START -->"
const generatedEndMarker = "<!-- AUTO-GENERATED:END -->"

function readFile(filePath) {
    return ts.sys.readFile(filePath) ?? ""
}

function parseSource(filePath) {
    return ts.createSourceFile(filePath, readFile(filePath), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

function getJsDocText(node) {
    const docs = ts
        .getJSDocCommentsAndTags(node)
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
    const matches = [...source.matchAll(/export\s+\{\s+default\s+as\s+(R\w+)\s+}\s+from\s+"(\.\/[^"]+\.vue)"/g)]

    return new Map(
        matches.map((match) => {
            const componentName = match[1]
            const relativeVuePath = match[2]
            const vuePath = path.resolve(path.dirname(componentsIndexPath), relativeVuePath)
            const typesPath = path.resolve(path.dirname(vuePath), "types.ts")
            return [componentName, { typesPath, vuePath }]
        }),
    )
}

function collectCssVariables(vuePath) {
    const variables = []
    const seenNames = new Set()
    const styleBlocks = [...readFile(vuePath).matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]

    for (const styleBlock of styleBlocks) {
        const lines = styleBlock[1].split(/\r?\n/)

        for (let index = 0; index < lines.length; index += 1) {
            const annotation = lines[index].trim().match(/^\/\*\s*@cssvar\s+(.+?)\s*\*\/$/)
            if (!annotation) continue

            const description = annotation[1].trim()
            const declaration = lines[index + 1]?.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*;\s*$/)
            if (!declaration) {
                throw new Error(
                    `Expected a CSS custom property directly after @cssvar in ${path.relative(repoRoot, vuePath).replace(/\\/g, "/")} line ${index + 1}`,
                )
            }

            const [, name, defaultValue] = declaration
            if (seenNames.has(name)) continue

            seenNames.add(name)
            variables.push({ name, defaultValue, description })
        }
    }

    return variables
}

function collectPropDefaults(vuePath) {
    const defaults = new Map()
    const scriptBlocks = [...readFile(vuePath).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]

    for (const scriptBlock of scriptBlocks) {
        const sourceFile = ts.createSourceFile(vuePath, scriptBlock[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

        function visit(node) {
            if (
                ts.isCallExpression(node) &&
                ts.isIdentifier(node.expression) &&
                node.expression.text === "withDefaults" &&
                ts.isObjectLiteralExpression(node.arguments[1])
            ) {
                for (const property of node.arguments[1].properties) {
                    if (ts.isPropertyAssignment(property) && property.name) {
                        defaults.set(getPropertyName(property), property.initializer.getText(sourceFile))
                    }
                }
            }

            ts.forEachChild(node, visit)
        }

        visit(sourceFile)
    }

    return defaults
}

function collectEvents(vuePath) {
    const events = []
    const eventNames = new Set()
    const scriptBlocks = [...readFile(vuePath).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]

    for (const scriptBlock of scriptBlocks) {
        const sourceFile = ts.createSourceFile(vuePath, scriptBlock[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

        function addEvent(name, parameters, description = "") {
            if (eventNames.has(name)) return

            eventNames.add(name)
            events.push({ name, parameters, description })
        }

        function getCallSignatureEventName(parameter) {
            if (
                !parameter?.type ||
                !ts.isLiteralTypeNode(parameter.type) ||
                !ts.isStringLiteral(parameter.type.literal)
            ) {
                return undefined
            }

            return parameter.type.literal.text
        }

        function getParameterText(parameter) {
            const rest = parameter.dotDotDotToken ? "..." : ""
            const optional = parameter.questionToken ? "?" : ""
            return `${rest}${parameter.name.getText(sourceFile)}${optional}: ${getTypeText(parameter, sourceFile)}`
        }

        function getTupleElementText(element) {
            if (!ts.isNamedTupleMember(element)) return element.getText(sourceFile)

            const optional = element.questionToken ? "?" : ""
            return `${element.name.getText(sourceFile)}${optional}: ${element.type.getText(sourceFile)}`
        }

        function visit(node) {
            if (
                ts.isCallExpression(node) &&
                ts.isIdentifier(node.expression) &&
                node.expression.text === "defineEmits"
            ) {
                const typeNode = node.typeArguments?.[0]

                if (typeNode && ts.isTypeLiteralNode(typeNode)) {
                    for (const member of typeNode.members) {
                        if (ts.isCallSignatureDeclaration(member)) {
                            const name = getCallSignatureEventName(member.parameters[0])
                            if (name) {
                                addEvent(name, member.parameters.slice(1).map(getParameterText), getJsDocText(member))
                            }
                        }

                        if (
                            ts.isPropertySignature(member) &&
                            member.name &&
                            member.type &&
                            ts.isTupleTypeNode(member.type)
                        ) {
                            addEvent(
                                getPropertyName(member),
                                member.type.elements.map(getTupleElementText),
                                getJsDocText(member),
                            )
                        }
                    }
                }

                const runtimeEvents = node.arguments[0]
                if (runtimeEvents && ts.isArrayLiteralExpression(runtimeEvents)) {
                    for (const event of runtimeEvents.elements) {
                        if (ts.isStringLiteral(event)) addEvent(event.text, [])
                    }
                }
            }

            if (
                ts.isCallExpression(node) &&
                ts.isIdentifier(node.expression) &&
                node.expression.text === "defineModel"
            ) {
                const modelArgument = node.arguments[0]
                const modelName = modelArgument && ts.isStringLiteral(modelArgument) ? modelArgument.text : "modelValue"
                const modelType = node.typeArguments?.[0]?.getText(sourceFile) ?? "unknown"
                addEvent(`update:${modelName}`, [`value: ${modelType}`], "Emitted when the model value changes.")
            }

            ts.forEachChild(node, visit)
        }

        visit(sourceFile)
    }

    return events
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

function generatePropsTable(props, propDefaults) {
    if (!props.length) {
        return "This component has no public props."
    }

    const lines = [
        "| Name | Type | Default | Required | Description |",
        "| --- | --- | --- | --- | --- |",
        ...props.map((prop) => {
            const defaultValue = propDefaults.get(prop.name)
            const description = prop.description || "—"
            return `| \`${escapeTableText(prop.name)}\` | \`${escapeTableText(prop.type)}\` | ${defaultValue ? `\`${escapeTableText(defaultValue)}\`` : "—"} | ${prop.required ? "yes" : "no"} | ${escapeTableText(description)} |`
        }),
    ]

    return lines.join("\n")
}

function generateEventsTable(events) {
    const lines = [
        "| Name | Parameters | Description |",
        "| --- | --- | --- |",
        ...events.map((event) => {
            const parameters = event.parameters.length ? `\`${escapeTableText(event.parameters.join(", "))}\`` : "—"
            const description = event.description || "—"
            return `| \`${escapeTableText(event.name)}\` | ${parameters} | ${escapeTableText(description)} |`
        }),
    ]

    return lines.join("\n")
}

function generateCssVariablesTable(cssVariables) {
    const lines = [
        "| Name | Default | Description |",
        "| --- | --- | --- |",
        ...cssVariables.map(
            (cssVariable) =>
                `| \`${escapeTableText(cssVariable.name)}\` | \`${escapeTableText(cssVariable.defaultValue)}\` | ${escapeTableText(cssVariable.description)} |`,
        ),
    ]

    return lines.join("\n")
}

function getRelativePath(filePath) {
    return path.relative(repoRoot, filePath).replace(/\\/g, "/")
}

function generateBody(componentName, props, propDefaults, typesPath, vuePath, events, cssVariables) {
    const sources = [`\`${getRelativePath(typesPath)}\``]
    if (events.length || cssVariables.length) {
        sources.push(`\`${getRelativePath(vuePath)}\``)
    }

    return [
        generatedStartMarker,
        "",
        "## Import",
        "",
        "```ts",
        `import { ${componentName} } from "${packageImportPath}"`,
        "```",
        "",
        "## Props",
        "",
        generatePropsTable(props, propDefaults),
        ...(events.length ? ["", "## Events", "", generateEventsTable(events)] : []),
        ...(cssVariables.length ? ["", "## CSS Variables", "", generateCssVariablesTable(cssVariables)] : []),
        "",
        `Generated from ${sources.join(" and ")}.`,
        "",
        generatedEndMarker,
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
    const { frontmatter, rest } = getFrontmatter(existing)
    const startIndex = rest.indexOf(generatedStartMarker)
    const endIndex = rest.indexOf(generatedEndMarker)

    if (startIndex === -1 && endIndex === -1) {
        const separator = rest.trim() ? (rest.endsWith("\n") ? "\n" : "\n\n") : "\n"
        ts.sys.writeFile(filePath, `${frontmatter}${rest}${separator}${body}\n`)
        return true
    }

    const hasExactlyOneStart =
        startIndex !== -1 && rest.indexOf(generatedStartMarker, startIndex + generatedStartMarker.length) === -1
    const hasExactlyOneEnd =
        endIndex !== -1 && rest.indexOf(generatedEndMarker, endIndex + generatedEndMarker.length) === -1
    if (!hasExactlyOneStart || !hasExactlyOneEnd || endIndex < startIndex) {
        console.error(`Skipping ${getRelativePath(filePath)}: malformed auto-generated markers`)
        return false
    }

    const next = `${frontmatter}${rest.slice(0, startIndex)}${body}${rest.slice(endIndex + generatedEndMarker.length)}`
    ts.sys.writeFile(filePath, next)
    return true
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
        const propDefaults = collectPropDefaults(exportInfo.vuePath)
        const events = collectEvents(exportInfo.vuePath)
        const cssVariables = collectCssVariables(exportInfo.vuePath)
        const body = generateBody(
            componentName,
            props,
            propDefaults,
            exportInfo.typesPath,
            exportInfo.vuePath,
            events,
            cssVariables,
        )
        if (writeApiDoc(apiFile, body)) {
            console.log(`Generated ${getRelativePath(apiFile)}`)
        }
    }
}

main()
