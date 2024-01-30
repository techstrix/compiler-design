import Parser from "./parser.ts";
main();
function main() {
  while (true) {
    const input = prompt("> ");
    if (!input || input == "exit") {
      Deno.exit(1);
    }
    const parser = new Parser();
    const program = parser.produceAST(input);
    console.log(program);
  }
}
