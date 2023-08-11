#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const execSh = require("exec-sh");

program.option(
  "-t, --target <platform>",
  "the-graph or studio or dodo-test or dodo"
);
program.option("-s, --subgraph", "subgraph name");
program.option("-n, --node", "node server endpoint");

program.parse(process.argv);

const options = program.opts();
let target = options.target;
let subgraph = options.subgraph;
let node = options.node;

async function run() {
  if (target && subgraph && node) {
    console.log(
      `target: ${options.target}, subgraph: ${options.subgraph}, node: ${options.node}`
    );
  } else {
    const promps = [];
    if (!target) {
      promps.push({
        type: "rawlist",
        name: "target",
        message: "Please select the target platform",
        choices: [
          "the graph",
          new inquirer.Separator(),
          "studio",
          new inquirer.Separator(),
          "dodo-test",
          new inquirer.Separator(),
          "dodo",
        ],
      });
    }
    if (!subgraph) {
      promps.push({
        type: "input",
        name: "subgraph",
        message: "Please input the subgraph name",
      });
    }
    if (!node) {
      promps.push({
        type: "rawlist",
        name: "node",
        message: "Please select the node server endpoint",
        choices: [
          "http://127.0.0.1:7006/jsonrpc",
          "https://api.thegraph.com/deploy/",
          "https://graph.mainnet.boba.network:8020",
          "https://graph.kkt.one/node/",
          "https://f.hg.network",
        ],
      });
    }
    const answers = await inquirer.prompt(promps);
    target = answers.target;
    subgraph = answers.subgraph;
    node = answers.node;
  }
  create();
}

run();

async function create() {
  const cli =
    target === "the graph"
      ? "./node_modules/.bin/graph"
      : "./node_modules/.bin/indexer";
  let commands = `${cli} create --node ${node} ${subgraph}`;
  const res = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message: `
            Generated commands: ${commands}
            `,
  });
  if (res.confirm) {
    execSh(commands, {}, (err) => {
      if (err) {
        console.log("Exit code: ", err.code);
        return;
      }
    });
  }
}
