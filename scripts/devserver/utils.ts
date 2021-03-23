import chalk from 'chalk';
import clearConsole from 'react-dev-utils/clearConsole';
import type webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import { formatWebpackMessages } from './formatWebpackMessages';

const argv = require('yargs').argv;

const isInteractive = process.stdout.isTTY;
let isFirstCompile = true;

const tscCompileOnError = false;

export function handleCompilerInfo(
  compilers: Record<string, webpack.Compiler>,
  { urls, devSocket },
) {
  let busyCount = Object.keys(compilers).length;

  let tsMessagesPromise;
  let tsMessagesResolver;

  compilers['client'].hooks.beforeCompile.tap('beforeCompile', () => {
    tsMessagesPromise = new Promise((resolve) => {
      tsMessagesResolver = (msgs) => resolve(msgs);
    });
  });

  ForkTsCheckerWebpackPlugin.getCompilerHooks(compilers['client']).receive.tap(
    'afterTypeScriptCheck',
    (diagnostics, lints) => {
      const allMsgs = [...diagnostics, ...lints];
      const format = (message) => `${message.file}\n${typescriptFormatter(message, true)}`;

      tsMessagesResolver({
        errors: allMsgs.filter((msg) => msg.severity === 'error').map(format),
        warnings: allMsgs.filter((msg) => msg.severity === 'warning').map(format),
      });
    },
  );

  Object.entries(compilers).forEach(([name, compiler]) => {
    // when a new re-compile starts
    compiler.hooks.invalid.tap('invalid', () => {
      const isFirst = busyCount === 0;
      if (isFirst) {
        if (isInteractive) {
          clearConsole();
        }
        console.log(chalk.cyan('Changes detected...'));
      }
      console.log(`[${name}] Compiling...`);
      ++busyCount;
    });

    // when compilation is completed
    compiler.hooks.done.tap('done', async (stats) => {
      --busyCount;
      const isLast = busyCount === 0;

      // We have switched off the default webpack output in WebpackDevServer
      // options so we are going to "massage" the warnings and errors and present
      // them in a readable focused way.
      // We only construct the warnings and errors for speed:
      // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
      const statsData = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      });

      // do TS logic
      if (name === 'client' && statsData.errors!.length === 0) {
        // if TS is super fast, don't show this message
        const delayedMsg = setTimeout(() => {
          console.log(chalk.yellow('Files successfully emitted, waiting for typecheck results...'));
        }, 100);

        // wait for separate TS process to complete, and return TS errors and warnings
        const messages = await tsMessagesPromise;
        clearTimeout(delayedMsg);

        handleMessages(statsData, messages, stats, devSocket);
      }

      // this is now combining Webpack and TS messages;
      const messages = formatWebpackMessages(statsData);
      const isSuccessful = !messages.errors.length && !messages.warnings.length;

      if (isSuccessful) {
        console.log(chalk.green(`[${name}] Compiled successfully!`));

        if (isLast && isFirstCompile) {
          printInstructions('your website', urls, true);
          isFirstCompile = false;
        }
        return;
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        printErrors(name, messages, stats);
        return;
      }

      // Show warnings if no errors were found.
      if (messages.warnings.length) {
        printWarnings(name, messages);
      }
    });
  });
}

function handleMessages(statsData, messages: any, stats, devSocket) {
  if (tscCompileOnError) {
    statsData.warnings.push(...messages.errors);
  } else {
    statsData.errors.push(...messages.errors);
  }
  statsData.warnings.push(...messages.warnings);

  // Push errors and warnings into compilation result
  // to show them after page refresh triggered by user.
  if (tscCompileOnError) {
    stats.compilation.warnings.push(...messages.errors);
  } else {
    stats.compilation.errors.push(...messages.errors);
  }
  stats.compilation.warnings.push(...messages.warnings);

  if (messages.errors.length > 0) {
    if (tscCompileOnError) {
      devSocket.warnings(messages.errors);
    } else {
      devSocket.errors(messages.errors);
    }
  } else if (messages.warnings.length > 0) {
    devSocket.warnings(messages.warnings);
  }
}

function printWarnings(name, messages: { warnings: any; errors: any }) {
  console.log(chalk.yellow(`[${name}] Compiled with warnings.\n`));
  console.log(messages.warnings.join('\n\n'));

  // Teach some ESLint tricks.
  console.log(
    '\nSearch for the ' +
      chalk.underline(chalk.yellow('keywords')) +
      ' to learn more about each warning.',
  );
  // console.log(
  //   'To ignore, add ' +
  //   chalk.cyan('// eslint-disable-next-line') +
  //   ' to the line before.\n'
  // );
}

function printErrors(name, messages: { warnings: any; errors: any }, stats: webpack.Stats) {
  if (argv.verboseErrors) {
    console.log(stats.toString({ all: false, errors: true, colors: true }));
  } else {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(chalk.red(`[${name}] Failed to compile.\n`));
    console.log(messages.errors.join('\n\n'));
    console.log(chalk.cyan(`\nUse "--verbose-errors" to output more error details.\n`));
  }
}

function printInstructions(appName, urls, useYarn) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(`  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`);
    console.log(`  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`);
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, use ` +
      `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`,
  );
  console.log();
}
