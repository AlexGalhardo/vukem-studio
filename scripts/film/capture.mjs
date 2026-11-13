import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const base = process.env.FILM_BASE;
const email = process.env.FILM_ADMIN_EMAIL || "admin@example.test";
const passwordFile = process.env.FILM_ADMIN_FILE;
const assets = path.join(root, "films/vukem-launch/assets");

if (!base || !/^http:\/\/127\.0\.0\.1:\d+$/.test(base)) {
  throw new Error("Set FILM_BASE to an http://127.0.0.1:<port> app. This script does not guess a port.");
}
if (base.endsWith(":3210") || base.endsWith(":4321")) {
  throw new Error("Refusing ports 3210 and 4321. Those previews stay untouched.");
}
if (!passwordFile) throw new Error("Set FILM_ADMIN_FILE to a mode-0600 password file. The password is not printed.");

const password = (await readFile(passwordFile, "utf8")).trim();
if (password.length < 12) throw new Error("Admin password file is empty or too short.");

await mkdir(assets, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const headings = {
  dashboard: "Your money, at a glance",
  transactions: "Transactions",
  accounts: "Accounts",
};

async function shot(page, url, heading, file) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: heading, exact: true }).waitFor();
  await page.screenshot({ path: file });
  console.log("shot", path.basename(file), page.url());
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on("pageerror", (error) => failures.push(error.message));
  await page.goto(base + "/login", { waitUntil: "domcontentloaded" });
  await page.locator("#auth-email").fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.waitForURL("**/dashboard"),
    page.getByRole("button", { name: "Log in", exact: true }).click(),
  ]);
  await page.evaluate(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  });

  for (const [format, size] of [
    ["horizontal", { width: 1440, height: 900 }],
    ["vertical", { width: 390, height: 844 }],
  ]) {
    await page.setViewportSize(size);
    for (const route of ["dashboard", "transactions", "accounts"]) {
      await shot(
        page,
        base + "/" + route,
        headings[route],
        path.join(assets, `${route}-${format}.png`),
      );
    }
  }

  const guest = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const landing = await guest.newPage();
  landing.setDefaultTimeout(20000);
  landing.on("pageerror", (error) => failures.push(error.message));
  for (const [format, size] of [
    ["horizontal", { width: 1440, height: 900 }],
    ["vertical", { width: 390, height: 844 }],
  ]) {
    await landing.setViewportSize(size);
    await shot(
      landing,
      base + "/",
      "Make room for what matters.",
      path.join(assets, `landing-${format}.png`),
    );
  }

  if (failures.length) throw new Error(failures.join("\n"));
  await writeFile(
    path.join(assets, "capture.json"),
    JSON.stringify(
      {
        framework: "v0.43.1-0.20261112225041-c8fadd0fe191+dirty",
        publishedCLI: "v0.43.0",
        scaffold: "finance",
        sourceRevision: "c8fadd0fe1915b3b4dde65cdeef378cebc23c40b",
        uncommitted:
          "Phase 9 finance scaffold plus absoluteBuildOutput, on top of main c8fadd0f. Published CLI v0.43.0 predates these scaffold fixes. No release tag was cut for the film.",
        generatedBy:
          "vukem new money --example finance --module example.com/money --framework <vukem-finance-ui> --no-install --pm npm --seed",
        url: base,
        interfaceModified: false,
        data: "FinanceDemoSeeder fictional rows. The capture signs in and does not delete or reseed.",
        routes: ["/", "/login", "/dashboard", "/transactions", "/accounts"],
        viewports: {
          horizontal: [1440, 900],
          vertical: [390, 844],
        },
        capturedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log("CAPTURE_OK", base);
} finally {
  await browser.close();
}
