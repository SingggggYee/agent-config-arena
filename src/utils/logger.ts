import chalk from "chalk";

export const log = {
  info(msg: string) {
    console.log(msg);
  },
  success(msg: string) {
    console.log(chalk.green(msg));
  },
  warn(msg: string) {
    console.log(chalk.yellow(`WARNING: ${msg}`));
  },
  error(msg: string) {
    console.error(chalk.red(`ERROR: ${msg}`));
  },
};
