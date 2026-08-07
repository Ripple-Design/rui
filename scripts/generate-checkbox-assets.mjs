import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const source = path.resolve(projectRoot, "..", "platform-vue3", "packages", "platform-ui", "src", "components", "rippleui", "checkbox", "assets", "checkbox-transitions.lottie")
const output = path.resolve(projectRoot, "packages", "rui", "src", "components", "checkbox", "assets", "checkbox-transitions.lottie")
const python = `import json, sys, zipfile\nfrom pathlib import Path\nsource, output = sys.argv[1], sys.argv[2]\n\ndef scale_geometry(value):\n    if isinstance(value, dict):\n        if all(key in value for key in ("v", "i", "o")):\n            for key in ("v", "i", "o"):\n                value[key] = [[n * 0.1 for n in point] for point in value[key]]\n        for key, child in value.items():\n            if key == "p" and isinstance(child, dict) and isinstance(child.get("k"), list) and len(child["k"]) >= 2:\n                child["k"][0] *= 0.1\n                child["k"][1] *= 0.1\n            else:\n                scale_geometry(child)\n    elif isinstance(value, list):\n        for child in value:\n            scale_geometry(child)\n\nwith zipfile.ZipFile(source) as source_zip, zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as output_zip:\n    for info in source_zip.infolist():\n        data = source_zip.read(info.filename)\n        if info.filename.endswith(".json") and info.filename != "manifest.json" and not info.filename.startswith("t/"):\n            document = json.loads(data)\n            document["w"] = 18\n            document["h"] = 18\n            scale_geometry(document)\n            data = json.dumps(document, separators=(",", ":")).encode()\n        output_zip.writestr(info, data)\n`

fs.mkdirSync(path.dirname(output), { recursive: true })
execFileSync(process.platform === "win32" ? "python" : "python3", ["-c", python, source, output], { stdio: "inherit" })
console.log(`generated ${path.relative(projectRoot, output)}`)
