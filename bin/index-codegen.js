#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const execSh = require("exec-sh");
const fs = require("fs");

// yarn codegen -c newchain -b 10086
program.option("-c, --chain <chain>", "chain name");
program.option("-b, --startBlock <startBlock>", "start block");

program.parse(process.argv);

const options = program.opts();
let chain = options.chain;
let startBlock = options.startBlock;

async function run() {
  if (chain && startBlock) {
    console.log(`chain: ${chain}, startBlock: ${startBlock}`);
  } else {
    console.error(`chain: ${chain}, startBlock: ${startBlock} cannot be empty`);
    return;
  }
  const contractConfig = JSON.parse(
    fs.readFileSync(`${__dirname}/contract-config/${chain}.json`)
  );
  codegen(contractConfig);
}

run();

async function codegen(contractConfig) {
  replaceAll("dodoex", contractConfig);
  replaceAll("mine", contractConfig);
  replaceAll("token", contractConfig);
  replaceConstant(contractConfig);
}

function replaceAll(yamlName, contractConfig) {
  let template = fs
    .readFileSync(`${__dirname}/template/${yamlName}.yaml`)
    .toString();
  template = template.replace(/\$\{chain\}/g, chain);
  template = template.replace(/\$\{startBlock\}/g, startBlock);

  for (const key in contractConfig) {
    for (const key2 in contractConfig[key]) {
      do {
        template = template.replace(
          "${" + key2 + "}",
          contractConfig[key][key2]
        );
      } while (template.includes("${" + key2 + "}"));
    }
  }
  fs.writeFileSync(
    `${__dirname}/../subgraphs/${yamlName}/${yamlName}_${chain}.yaml`,
    template
  );
}

function replaceConstant(contractConfig) {
  let template = fs
    .readFileSync(`${__dirname}/template/constant.ts`)
    .toString();
  template = template.replace(/\$\{chain\}/g, chain);
  template = template.replace(/\$\{startBlock\}/g, startBlock);

  for (const key in contractConfig) {
    for (const key2 in contractConfig[key]) {
      do {
        template = template.replace(
          "${" + key2 + "}",
          contractConfig[key][key2]
        );
      } while (template.includes("${" + key2 + "}"));
    }
  }
  fs.writeFileSync(
    `${__dirname}/../src/mappings/constant-${chain}.ts`,
    template
  );
}
