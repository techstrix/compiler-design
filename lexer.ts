export enum TokenType {
  Number,
  LeftParenthesis,
  RightParenthesis,
  Identifier,
  Equals,
  BinaryOperator,
  Let,
  EOF,
}
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(type: TokenType, value = "") {
  return { value, type };
}
function isalpha(str: string) {
  return str.toUpperCase() !== str.toLowerCase();
}

function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}
function isskippable(str: string) {
  return str === " " || str == "\n" || str == "\t";
}
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");
  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(TokenType.LeftParenthesis, src.shift()));
    } else if (src[0] == ")") {
      tokens.push(token(TokenType.RightParenthesis, src.shift()));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/"
    ) {
      tokens.push(token(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] == "=") {
      tokens.push(token(TokenType.Equals, src.shift()));
    } else {
      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }

        tokens.push(token(TokenType.Number, num));
      } else if (isalpha(src[0])) {
        let identifier = "";
        while (src.length > 0 && isalpha(src[0])) {
          identifier += src.shift();
        }
        const reserved = KEYWORDS[identifier];
        if (reserved === undefined) {
          tokens.push(token(TokenType.Identifier, identifier));
        } else {
          tokens.push(token(reserved, identifier));
        }
      } else if (isskippable(src[0])) {
        src.shift();
      } else {
        console.log("Unrecognized Character identified in source");
        Deno.exit(1);
      }
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}

const source = await Deno.readTextFile("./test.txt");

for (const token of tokenize(source)) {
  console.log(token);
}
