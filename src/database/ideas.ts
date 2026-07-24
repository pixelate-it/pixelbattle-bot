import { createRequire } from "node:module";
import { config } from "@config";
import { similarity } from "@helpers/similarity";

// Loaded through a computed specifier so the bundler leaves it untouched:
// esbuild doesn't know the newer `node:sqlite` builtin and strips its `node:`
// prefix, emitting a broken `from "sqlite"` in the build. A dynamic require
// dodges that static rewrite while still resolving the builtin at runtime.
const require = createRequire(import.meta.url);
const sqliteModule = "node:sqlite";
const { DatabaseSync } = require(sqliteModule) as typeof import("node:sqlite");

export interface IdeaRecord {
    /** Thread id — also the forum post's id, used to render a `<#id>` mention. */
    id: string;
    title: string;
}

const db = new DatabaseSync(config.dbPath);
db.exec(`
    CREATE TABLE IF NOT EXISTS ideas (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL
    );
`);

const insertStmt = db.prepare(
    "INSERT OR REPLACE INTO ideas (id, title) VALUES (?, ?)",
);
const deleteStmt = db.prepare("DELETE FROM ideas WHERE id = ?");
const allStmt = db.prepare("SELECT id, title FROM ideas");
const countStmt = db.prepare("SELECT COUNT(*) AS n FROM ideas");

/**
 * Persistent index of idea titles (posts in the ideas forum). It replaces
 * re-scanning Discord on every new post: titles are stored once, so duplicate
 * detection reads from here and only compares in memory.
 */
export const ideas = {
    add(record: IdeaRecord) {
        insertStmt.run(record.id, record.title);
    },

    remove(id: string) {
        deleteStmt.run(id);
    },

    all(): IdeaRecord[] {
        return allStmt.all() as unknown as IdeaRecord[];
    },

    count(): number {
        return Number((countStmt.get() as { n: number }).n);
    },

    /** Stored ideas whose title is similar enough to `title`, excluding `excludeId`. */
    findSimilar(
        title: string,
        excludeId: string,
        threshold: number,
    ): IdeaRecord[] {
        return this.all().filter(
            (idea) =>
                idea.id !== excludeId &&
                similarity(title, idea.title) >= threshold,
        );
    },
};
