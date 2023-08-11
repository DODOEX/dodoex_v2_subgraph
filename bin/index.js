#!/usr/bin/env node

const program = require("commander");
const pkg = require("../package.json");
program
  .version(pkg.version, "-v, --version")
  .command("create", "Create the subgraph")
  .command("deploy", "Deploys the subgraph")
  .command("cmd", "run cmd")
  .parse(process.argv);
