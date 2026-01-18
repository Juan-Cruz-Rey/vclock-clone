/**
 * IndexNow submission script
 * Notifies search engines about all URLs after build
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// IndexNow API endpoint
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Your site configuration
const SITE_URL = 'https://24-clock.com';
const KEY_LOCATION = join(rootDir, 'public', 'abdb231243374bd4b553b83bbf1d16ed.txt');

async function submitToIndexNow() {
  try {
    // Read the IndexNow key
    const key = readFileSync(KEY_LOCATION, 'utf-8').trim();
    console.log('✓ IndexNow key loaded');

    // Get all HTML files from the dist directory
    const distDir = join(rootDir, 'dist');
    const htmlFiles = await glob('**/*.html', { cwd: distDir });

    // Convert file paths to URLs
    const urls = htmlFiles.map(file => {
      // Remove index.html and trailing slashes
      let path = file.replace(/index\.html$/, '').replace(/\.html$/, '/');
      if (!path.startsWith('/')) path = '/' + path;
      return `${SITE_URL}${path}`;
    });

    console.log(`✓ Found ${urls.length} URLs to submit`);

    // IndexNow accepts up to 10,000 URLs per request
    // Split into chunks if needed
    const chunkSize = 10000;
    const chunks = [];
    for (let i = 0; i < urls.length; i += chunkSize) {
      chunks.push(urls.slice(i, i + chunkSize));
    }

    console.log(`✓ Submitting ${chunks.length} request(s) to IndexNow...`);

    // Submit each chunk
    for (let i = 0; i < chunks.length; i++) {
      const payload = {
        host: '24-clock.com',
        key: key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: chunks[i]
      };

      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✓ Chunk ${i + 1}/${chunks.length} submitted successfully (${response.status})`);
      } else {
        console.error(`✗ Chunk ${i + 1}/${chunks.length} failed: ${response.status} ${response.statusText}`);
      }

      // Add a small delay between requests to be respectful
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n✅ IndexNow submission completed!');
    console.log(`📊 Total URLs submitted: ${urls.length}`);
    console.log(`🔍 Search engines notified: Bing, Yandex, Seznam.cz, Naver`);

  } catch (error) {
    console.error('❌ Error submitting to IndexNow:', error.message);
    // Don't fail the build if IndexNow submission fails
    process.exit(0);
  }
}

submitToIndexNow();
