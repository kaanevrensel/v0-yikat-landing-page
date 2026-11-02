// Registers ts-loader.mjs once, then imports a repo TypeScript module by its repo-relative path.
import { register } from "node:module"
import { pathToFileURL } from "node:url"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "../..")
let registered = false
export async function importTs(relative) {
  if (!registered) { register("./ts-loader.mjs", import.meta.url); registered = true }
  return import(pathToFileURL(path.join(root, relative)).href)
}
