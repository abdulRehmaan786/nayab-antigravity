import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // If external database URL is configured, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / AWS Lambda, the filesystem is read-only except /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // Copy bundled dev.db to /tmp if it doesn't exist yet
    if (!fs.existsSync(tmpDbPath)) {
      const src = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
          console.log(`[Database] Initialized SQLite at ${tmpDbPath} from ${src}`);
        } catch (e) {
          console.error(`[Database] Error copying ${src} to /tmp:`, e);
        }
      }
    }

    return `file:${tmpDbPath}`;
  }

  return "file:./dev.db";
}

const dbUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
