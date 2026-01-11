import chalk from "chalk";
import pkg from "enquirer";

import { MENU_OPTIONS, STRATEGY_TEMPLATES } from "../constants/menu_options.js";

const { Select } = pkg;

export const printFinalResponse = (result) => {
  console.log("\n" + chalk.bgGreen.black.bold(" FINAL RESPONSE "));
  console.log(chalk.white(result.response));

  console.log("\n" + chalk.dim("--------------------------------------"));
  console.log(
    chalk.dim(`Tokens: ${result.metrics.inputTokens} in / ${result.metrics.outputTokens} out`)
  );
  console.log(chalk.dim(`Speed:  ${result.metrics.tps} tokens/sec`));
  console.log(chalk.dim("--------------------------------------\n"));
};

/** UTIL-CANDIDATE (non-async): pure printing helper, can move to utils */
export const printChainExecutionLog = (history) => {
  console.log("\n" + chalk.bgMagenta.black.bold(" ⛓️  CHAIN EXECUTION LOG "));
  history.forEach((step) => {
    console.log(chalk.cyan.bold(`\n[${step.stepName}]`));
    console.log(
      chalk.dim("Input Context: ") +
        step.input.replace(/\n/g, " ").substring(0, 60) +
        "..."
    );
    console.log(chalk.green("Output: ") + chalk.white(step.output.trim()));
  });
  console.log(chalk.dim("\n⬇️ Passing final output to user ⬇️"));
};

/** UTIL-CANDIDATE (non-async): pure mapping helper, can move to utils */
export const getTemplatesForStrategy = (strategy) => STRATEGY_TEMPLATES[strategy] ?? [];

export const chooseStrategy = async () => {
  console.clear();
  console.log(chalk.magenta.bold("\nPrompting Methods\n"));

  const prompt = new Select({
    name: "strategy",
    message: "Choose a Prompting Method",
    choices: Object.values(MENU_OPTIONS),
  });

  return prompt.run();
};
