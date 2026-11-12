import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const base = 'http://127.0.0.1:3210';
const assets = path.join(root, 'films/vukem-launch/assets');
const db = path.join(root, 'storage/marketing/money/storage/database.sqlite');
await mkdir(assets, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const failures = [];
page.on('pageerror', e => failures.push(e.message));
const sql = code => execFileSync('python3', ['-c', 'import sqlite3,sys\ndb=sqlite3.connect(sys.argv[1])\n' + code + '\ndb.commit()', db]);
try {
  const registered = sql("print(db.execute(\"SELECT count(*) FROM users WHERE email='demo@example.com'\").fetchone()[0])").toString().trim() === '1';
  if (!registered) {
    await page.goto(base + '/register');
    await page.getByLabel('Name', { exact: true }).fill('Alex Morgan');
    await page.getByLabel('Email', { exact: true }).fill('demo@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Demo-Finance-2026!');
    await page.getByLabel('Confirm password', { exact: true }).fill('Demo-Finance-2026!');
    await Promise.all([
      page.waitForURL('**/register/check-email'),
      page.getByRole('button', { name: 'Create account', exact: true }).click(),
    ]);
  }
  sql("db.execute(\"UPDATE users SET email_verified_at=strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE email='demo@example.com'\")");
  await context.clearCookies();
  await page.goto(base + '/login');
  await page.getByLabel('Email', { exact: true }).fill('demo@example.com');
  await page.getByLabel('Password', { exact: true }).fill('Demo-Finance-2026!');
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.getByRole('button', { name: 'Log in', exact: true }).click(),
  ]);
  await page.goto(base + '/dashboard');

  sql(`
import datetime
uid=db.execute("SELECT id FROM users WHERE email='demo@example.com'").fetchone()[0]
wid=db.execute("SELECT workspace_id FROM memberships WHERE user_id=?",(uid,)).fetchone()[0]
aid=db.execute("SELECT id FROM accounts WHERE workspace_id=?",(wid,)).fetchone()[0]
db.execute("UPDATE workspaces SET name='Personal finance' WHERE id=?",(wid,))
db.execute("UPDATE accounts SET name='Main account',opening_cents=240000 WHERE id=?",(aid,))
cats={r[1]:r[0] for r in db.execute("SELECT id,name FROM categories WHERE workspace_id=?",(wid,))}
for name,kind in [('Salary','income'),('Housing','expense'),('Food','expense'),('Transport','expense'),('Software','expense')]:
 if name not in cats:
  c=db.execute("INSERT INTO categories(workspace_id,name,kind,created_at,updated_at) VALUES(?,?,?,datetime('now'),datetime('now'))",(wid,name,kind));cats[name]=c.lastrowid
db.execute("DELETE FROM transactions WHERE workspace_id=?",(wid,))
today=datetime.date.today()
for offset in range(6):
 m=(today.year*12+today.month-1)-offset;y,m=divmod(m,12);m+=1
 for name,kind,amount,desc,day in [('Salary','income',620000-offset*15000,'Monthly salary',1),('Housing','expense',180000,'Apartment rent',2),('Food','expense',42000+offset*1700,'Groceries',4),('Transport','expense',12500,'Transit pass',5),('Software','expense',7900,'Developer tools',8)]:
  db.execute("INSERT INTO transactions(workspace_id,account_id,category_id,kind,amount_cents,description,occurred_on,created_at,updated_at) VALUES(?,?,?,?,?,?,?,datetime('now'),datetime('now'))",(wid,aid,cats[name],kind,amount,desc,f'{y:04}-{m:02}-{day:02}'))
db.execute("DELETE FROM budgets WHERE workspace_id=?",(wid,))
for name,amount in [('Food',60000),('Transport',20000),('Software',15000)]:
 db.execute("INSERT INTO budgets(workspace_id,category_id,limit_cents,created_at,updated_at) VALUES(?,?,?,datetime('now'),datetime('now'))",(wid,cats[name],amount))
`);
  await page.goto(base + '/accounts');
  await page.waitForLoadState('networkidle');
  failures.length = 0; // Empty initial charts are a recorded scaffold defect; seeded captures must be clean.
  for (const [format, size] of Object.entries({ horizontal: { width: 1440, height: 900 }, vertical: { width: 540, height: 960 } })) {
    await page.setViewportSize(size);
    for (const route of ['dashboard','transactions','accounts']) {
      await page.goto(base + '/' + route);
      await page.waitForLoadState('networkidle');
      await page.getByRole('heading', { name: route === 'workspace' ? 'Personal finance' : route[0].toUpperCase() + route.slice(1), exact: true }).waitFor();
      await page.screenshot({ path: path.join(assets, `${route}-${format}.png`) });
    }
  }
  // The login is the real public page, using a separate signed-out context.
  const signedOut = await browser.newContext({ viewport:{width:1440,height:900},colorScheme:'dark' });
  const login = await signedOut.newPage();
  await login.goto(base + '/login');
  await login.waitForLoadState('networkidle');
  await login.screenshot({path:path.join(assets,'login-horizontal.png')});
  await login.setViewportSize({width:540,height:960});
  await login.screenshot({path:path.join(assets,'login-vertical.png')});
  if(failures.length) throw new Error(failures.join('\n'));
  await writeFile(path.join(assets,'capture.json'), JSON.stringify({framework:'v0.43.0',scaffold:'finance',sourceCommit:'0dc46208e14b769f6ce458635b63e4563251eb1b',interfaceModified:false,data:'Fictional demo data, local SQLite only',routes:['/login','/dashboard','/transactions','/accounts'],capturedAt:new Date().toISOString()},null,2));
  console.log('Captured real finance scaffold in both layouts.');
} catch (error) {
  await page.screenshot({ path: path.join(root, 'storage/marketing/capture-failure.png') });
  console.error('Capture failed at', page.url());
  console.error('Browser errors:', failures);
  throw error;
} finally { await browser.close(); }
