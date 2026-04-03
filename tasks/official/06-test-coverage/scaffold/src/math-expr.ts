// ── Token types ──────────────────────────────────────────────

type TokenType = "number" | "plus" | "minus" | "multiply" | "divide" | "lparen" | "rparen";

interface Token {
  type: TokenType;
  value: string;
}

// ── AST node types ───────────────────────────────────────────

interface NumberNode {
  kind: "number";
  value: number;
}

interface UnaryNode {
  kind: "unary";
  operator: string;
  operand: ASTNode;
}

interface BinaryNode {
  kind: "binary";
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

type ASTNode = NumberNode | UnaryNode | BinaryNode;

// ── Tokenizer ────────────────────────────────────────────────

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }

    if (ch >= "0" && ch <= "9" || ch === ".") {
      let num = "";
      let hasDot = false;
      while (i < input.length && ((input[i] >= "0" && input[i] <= "9") || input[i] === ".")) {
        if (input[i] === ".") {
          if (hasDot) throw new Error(`Malformed number: multiple decimal points`);
          hasDot = true;
        }
        num += input[i];
        i++;
      }
      if (num === ".") throw new Error("Malformed number: lone decimal point");
      tokens.push({ type: "number", value: num });
      continue;
    }

    const opMap: Record<string, TokenType> = {
      "+": "plus",
      "-": "minus",
      "*": "multiply",
      "/": "divide",
      "(": "lparen",
      ")": "rparen",
    };

    if (opMap[ch]) {
      tokens.push({ type: opMap[ch], value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: '${ch}'`);
  }

  return tokens;
}

// ── Parser (recursive descent) ───────────────────────────────

class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse(): ASTNode {
    const node = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token: '${this.tokens[this.pos].value}'`);
    }
    return node;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    const token = this.tokens[this.pos];
    if (!token) throw new Error("Unexpected end of expression");
    this.pos++;
    return token;
  }

  // expression = term (('+' | '-') term)*
  private parseExpression(): ASTNode {
    let left = this.parseTerm();

    while (this.peek()?.type === "plus" || this.peek()?.type === "minus") {
      const op = this.consume();
      const right = this.parseTerm();
      left = { kind: "binary", operator: op.value, left, right };
    }

    return left;
  }

  // term = unary (('*' | '/') unary)*
  private parseTerm(): ASTNode {
    let left = this.parseUnary();

    while (this.peek()?.type === "multiply" || this.peek()?.type === "divide") {
      const op = this.consume();
      const right = this.parseUnary();
      left = { kind: "binary", operator: op.value, left, right };
    }

    return left;
  }

  // unary = ('-' | '+') unary | primary
  private parseUnary(): ASTNode {
    if (this.peek()?.type === "minus") {
      this.consume();
      const operand = this.parseUnary();
      return { kind: "unary", operator: "-", operand };
    }
    if (this.peek()?.type === "plus") {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  // primary = NUMBER | '(' expression ')'
  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (!token) {
      throw new Error("Unexpected end of expression");
    }

    if (token.type === "number") {
      this.consume();
      return { kind: "number", value: parseFloat(token.value) };
    }

    if (token.type === "lparen") {
      this.consume(); // eat '('
      const node = this.parseExpression();
      const closing = this.peek();
      if (!closing || closing.type !== "rparen") {
        throw new Error("Missing closing parenthesis");
      }
      this.consume(); // eat ')'
      return node;
    }

    throw new Error(`Unexpected token: '${token.value}'`);
  }
}

// ── Evaluator ────────────────────────────────────────────────

export function evaluateAST(node: ASTNode): number {
  switch (node.kind) {
    case "number":
      return node.value;

    case "unary":
      if (node.operator === "-") {
        return -evaluateAST(node.operand);
      }
      return evaluateAST(node.operand);

    case "binary": {
      const left = evaluateAST(node.left);
      const right = evaluateAST(node.right);

      switch (node.operator) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/":
          if (right === 0) throw new Error("Division by zero");
          return left / right;
        default:
          throw new Error(`Unknown operator: '${node.operator}'`);
      }
    }
  }
}

// ── Main entry point ─────────────────────────────────────────

export function evaluate(expr: string): number {
  if (!expr || expr.trim().length === 0) {
    throw new Error("Empty expression");
  }

  const tokens = tokenize(expr);
  if (tokens.length === 0) {
    throw new Error("Empty expression");
  }

  const parser = new Parser(tokens);
  const ast = parser.parse();
  return evaluateAST(ast);
}
