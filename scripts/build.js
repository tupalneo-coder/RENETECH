const { cp, copyFile, mkdir, rm, writeFile } = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDirectory = path.join(projectRoot, 'dist');
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

async function build() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the Vercel project environment.');
  }

  if (!supabaseUrl.startsWith('https://')) {
    throw new Error('SUPABASE_URL must be an HTTPS URL.');
  }

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    copyFile(path.join(projectRoot, 'app.html'), path.join(outputDirectory, 'index.html')),
    copyFile(path.join(projectRoot, 'app.css'), path.join(outputDirectory, 'app.css')),
    copyFile(path.join(projectRoot, 'app.js'), path.join(outputDirectory, 'app.js')),
    cp(path.join(projectRoot, 'audio'), path.join(outputDirectory, 'audio'), { recursive: true })
  ]);

  const browserConfig = {
    url: supabaseUrl,
    publishableKey: supabasePublishableKey
  };

  await writeFile(
    path.join(outputDirectory, 'supabase-config.js'),
    `window.RENETECH_SUPABASE_CONFIG = Object.freeze(${JSON.stringify(browserConfig)});\n`,
    'utf8'
  );
}

build().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
