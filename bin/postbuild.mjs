import { join } from 'path';
import chalk from 'chalk';
import fs from 'fs';
import archiver from 'archiver';
import inliner from 'web-resource-inliner';
const { html } = inliner;
import util from 'util';
import { minify as htmlMinify } from 'html-minifier';
import ect from 'ect-bin';
import { execFileSync } from 'child_process';
import { Packer } from 'roadroller';

const inlineHtml = util.promisify(html);

const SHOULD_ROADROLLER = process.env.ROADROLLER === 'true';

function getHtml() {
  return fs.readFileSync(join('dist', 'index.html'), 'utf8');
}

async function inline(html) {
  console.log(chalk.blue('Inlining...'));
  return await inlineHtml({
    fileContent: html,
    relativeTo: 'dist',
  });
}

function minify(html) {
  console.log(chalk.blue('Minifying...'));
  return htmlMinify(html, {
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttribtues: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: false,
    minifyCSS: {
      compatibility: {
        properties: {
          colors: false,
          shorterLengthUnits: true,
        },
      },
    },
  });
}

async function roadroller(html) {
  console.log(chalk.blue('Rolling the road...'));
  const inputs = [
    {
      data: html,
      type: 'text',
      action: 'write',
    },
  ];
  const options = {};
  const packer = new Packer(inputs, options);
  await packer.optimize(2);
  const { firstLine, secondLine } = packer.makeDecoder();
  return `<script>${firstLine}${secondLine}</script>`;
}

function archive(html) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('Zipping...'));
    const outputPath = join('dist', 'game.zip');
    let output = fs.createWriteStream(outputPath);
    let archive = archiver('zip');
    const max = 13 * 1024;

    output.on('close', function () {
      console.log(chalk.blue('ECT optimizing...'));
      const result = execFileSync(ect, [
        '-100500',
        '-strip',
        '-zip',
        outputPath,
      ]);
      console.log(chalk.yellow(result.toString('utf8')));

      const stats = fs.statSync(outputPath);

      const bytes = stats['size'];
      const percent = ((bytes / max) * 100).toFixed(2);
      if (bytes > max) {
        console.error(chalk.red(`Size overflow: ${bytes} bytes (${percent}%)`));
      } else {
        console.log(chalk.green(`Size: ${bytes} bytes (${percent}%)`));
      }
      resolve();
    });

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        reject(err);
      }
    });

    archive.on('error', function (err) {
      reject(err);
    });

    archive.pipe(output);
    archive.append(html, { name: 'index.html' });
    archive.finalize().then(() => resolve());
  });
}

let result = getHtml();
result = await inline(result);
result = minify(result);
if (SHOULD_ROADROLLER) {
  result = await roadroller(result);
}
fs.writeFileSync(join('dist', 'index.min.html'), result);
await archive(result);

fs.mkdirSync('public', { recursive: true });
fs.copyFileSync(join('dist', 'index.min.html'), join('public', 'index.html'));
