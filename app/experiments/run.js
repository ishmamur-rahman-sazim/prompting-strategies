import pkg from "enquirer";
import chalk from "chalk";
import ora from "ora";

import { PreviewSelect } from "../utils/index.js";
import {
  runPromptChaining,
  runPrompt,
  runReflexion
} from "../strategies/index.js";
import { MENU_OPTIONS, BACK_OPTION } from "../constants/menu_options.js";
import {
  printFinalResponse,
  printChainExecutionLog,
  getTemplatesForStrategy,
  chooseStrategy
} from "../utils/helpers.js";

const { Select } = pkg;

const chooseTemplate = async (templates) => {
  const navigationTemplates = [...templates, BACK_OPTION];

  const selector = new PreviewSelect({
    name: "templateName",
    message: "Select a prompt example (Arrow keys to preview):",
    choices: navigationTemplates.map((t) => t.name),
    templates: navigationTemplates
  });

  const selectedName = await selector.run();
  if (selectedName === BACK_OPTION.name) return { goBack: true };

  const selectedTemplate = navigationTemplates.find(
    (t) => t.name === selectedName
  );
  return { goBack: false, selectedTemplate };
};

const runExperiment = async (selectedStrategy, selectedTemplate, spinner) => {
  const startTime = Date.now();
  let result;

  if (!Object.values(MENU_OPTIONS).includes(selectedStrategy)) {
    throw new Error(`Unknown strategy: ${selectedStrategy}`);
  }

  if (selectedStrategy === MENU_OPTIONS.PROMPT_CHAINING) {
    const onStepStart = (stepName, current, total) => {
      spinner.text = chalk.yellow(
        `Running Chain ${stepName} (${current}/${total})...`
      );
    };
    result = await runPromptChaining(selectedTemplate, onStepStart);
  } else if (selectedStrategy === MENU_OPTIONS.REFLEXION) {
    const onStepStart = (stepName, current, total) => {
      spinner.text = chalk.yellow(
        `Reflexion Loop: ${stepName} (${current}/${total})...`
      );
    };
    result = await runReflexion(selectedTemplate, onStepStart);
  } else {
    result = await runPrompt(selectedTemplate);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  return { result, duration };
};

const askRunAgain = async () => {
  const again = new Select({
    name: "again",
    message: "Run another experiment?",
    choices: ["Yes", "No"]
  });

  const choice = await again.run();
  return choice === "Yes";
};

const main = async () => {
  const selectedStrategy = await chooseStrategy();

  if (selectedStrategy === MENU_OPTIONS.EXIT) {
    console.log(chalk.yellow("Exiting..."));
    process.exit();
  }

  const templates = getTemplatesForStrategy(selectedStrategy);
  const { goBack, selectedTemplate } = await chooseTemplate(templates);

  if (goBack) return main();

  const spinner = ora({
    text: chalk.yellow(`Running ${selectedTemplate.name}...`),
    color: "cyan"
  }).start();

  try {
    const { result, duration } = await runExperiment(
      selectedStrategy,
      selectedTemplate,
      spinner
    );
    spinner.succeed(chalk.green(`Completed in ${duration}s`));

    if (selectedStrategy === MENU_OPTIONS.PROMPT_CHAINING) {
      printChainExecutionLog(result.history);
    }

    printFinalResponse(result);

    const runAgain = await askRunAgain();
    if (runAgain) return main();

    console.log(chalk.yellow("Goodbye!"));
  } catch (err) {
    spinner.fail(chalk.red("Experiment failed!"));
    console.error(chalk.red(err?.stack || err));
  }
};

main();
