#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const execSh = require("exec-sh");
const { chains } = require("./config");

// Example：
// node bin/index.js deploy -y 'subgraphs/dodoex/dodoex_moonriver-graft.yaml' -s 'dodoex/dodoex-v2-moonriver-alpha'

program.option(
  "-t, --target <platform>",
  "the-graph or studio or dodo-test or dodo"
);
program.option("-s, --subgraph <name>", "subgraph name");
program.option("-i, --ipfs <endpoint>", "ipfs server endpoint");
program.option("-n, --node <endpoint>", "node server endpoint");
program.option("-c, --chain <name>", "block chain");
program.option("-a, --alpha", "is alpha");
program.option("-d, --debug", "is debug", true);
program.option("-y, --yaml <name>", "yaml file name");
program.option("-u, --accesstoken <token>", "access token");

program.parse(process.argv);

const options = program.opts();
let target = options.target;
let subgraph = options.subgraph;
let ipfs = options.ipfs;
let node = options.node;
let chain = options.chain;
let alpha = options.alpha;
let debug = options.debug;
let yaml = options.yaml;
let accesstoken = options.accesstoken;

async function run() {
  if (target && subgraph && ipfs && node && chain) {
    console.log(
      `target: ${options.target}, subgraph: ${options.subgraph}, ipfs: ${options.ipfs}, node: ${options.node}`
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
        type: "rawlist",
        name: "subgraph",
        message: "Please select the subgraph",
        choices: [
          "avatar",
          "dodoex",
          "mime",
          "nft",
          "starter",
          "token",
          "dodoNftBalance",
          "vdodo",
        ],
      });
    }
    if (!ipfs) {
      promps.push({
        type: "rawlist",
        name: "ipfs",
        message: "Please select the ipfs server endpoint",
        choices: [
          "http://127.0.0.1:5001",
          "https://api.thegraph.com/ipfs/",
          "https://graph.mainnet.boba.network:5001",
          "https://ipfs.kkt.one",
          "https://f.hg.network",
        ],
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
          "http://127.0.0.1:8020",
        ],
      });
    }
    if (!chain) {
      promps.push({
        type: "rawlist",
        name: "chain",
        message: "Please select the chain",
        choices: chains,
      });
    }
    const answers = await inquirer.prompt(promps);
    if (answers.target) target = answers.target;
    if (answers.subgraph) subgraph = answers.subgraph;
    if (answers.ipfs) ipfs = answers.ipfs;
    if (answers.node) node = answers.node;
    if (answers.chain) chain = answers.chain;
  }
  deploy();
}

run();

async function deploy() {
  console.log("target", target, "subgraph", subgraph, "yaml", yaml);

  if (!yaml) {
    let ext = "";
    if (alpha) ext = "-graft";
    yaml = `subgraphs/${subgraph}/${subgraph}_${chain}${ext}.yaml`;
  }
  let subgraphName = "";
  if (subgraph.indexOf("/") === -1) {
    if (subgraph === "dodoex") {
      subgraphName = `dodoex/dodoex-v2-${chain}`;
    } else if (subgraph === "nft") {
      subgraphName = `dodoex/dodo-nft-${chain}`;
    } else if (subgraph === "avatar") {
      subgraphName = `dodoex/dodo-avatar-${chain}`;
    } else if (subgraph === "mine") {
      subgraphName = `dodoex/dodoex-mine-v3-${chain}`;
    } else {
      subgraphName = `dodoex/dodoex-${subgraph}-${chain}`;
    }
    if (alpha) subgraphName += "-alpha";
  } else {
    subgraphName = subgraph;
    subgraph = subgraph.split("/")[0];
  }

  let commands = "";
  if (subgraph === "dodoex") {
    commands += `cp ./src/mappings/constant-${chain}.ts ./src/mappings/constant.ts && `;
  }
  const cli = target === "the graph" ? "graph" : "indexer";
  commands += `${cli} codegen ${yaml} --output-dir ./src/types/${subgraph}/  && `;
  commands += `${cli} deploy ${
    debug ? "--debug" : ""
  } --ipfs ${ipfs} --node ${node} ${subgraphName} ${yaml}`;
  if (accesstoken) {
    commands += `--access-token ${accesstoken}`;
  }

  const res = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message: `
        target platform: ${target}
        subgraph name: ${subgraphName}
        yaml file name: ${yaml}
        ipfs server endpoint: ${ipfs}
        node server endpoint: ${node}

        Generated commands: ${commands}
        `,
  });
  if (res.confirm) {
    commands = commands.replace(
      "graph codegen ",
      "./node_modules/.bin/graph codegen "
    );
    commands = commands.replace(
      "graph deploy ",
      "./node_modules/.bin/graph deploy "
    );
    commands = commands.replace(
      "indexer codegen ",
      "./node_modules/.bin/indexer codegen "
    );
    commands = commands.replace(
      "indexer deploy ",
      "./node_modules/.bin/indexer deploy "
    );
    console.log("exec commands:", commands);
    execSh(commands, {}, (err) => {
      if (err) {
        console.log("Exit code: ", err.code);
        return;
      }
    });
  }
}
