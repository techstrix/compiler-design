import {
  Statement,
  Program,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  Expression,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";
export default class Parser {
  private tokens: Token[] = [];
  private notEOF(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }
  private at() {
    return this.tokens[0] as Token;
  }
  private advance() {
    const previousToken = this.tokens.shift() as Token;
    return previousToken;
  }
  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();
    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.advance().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();
    while (this.at().value === "+/" || this.at().value === "*") {
      const operator = this.advance().value;
      const right = this.parsePrimaryExpression();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    //Continue parsing until the end of file is reached
    while (this.notEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    //skip to parse_expr
    return this.parseExpression();
  }
  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }
  private parsePrimaryExpression(): Expression {
    const token = this.at().type;
    switch (token) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.advance().value,
        } as Identifier;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.advance().value),
        } as NumericLiteral;
      default:
        console.error("Unexpected Token found during parsing");
        Deno.exit(1);
    }
  }
}
