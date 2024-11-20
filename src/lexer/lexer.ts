import { isAlpha, isDigit, isBlank } from "../utils/dealChar";

// 分词步骤
// 输入一段script字符串，解析成一个token数组

export enum TokenType {
  Identifier = "Identifier",
  IntLiteral = "IntLiteral",
  Assignment = "Assignment"
}

export interface Token {
  type?: TokenType;
  text?: string;
}

export const tokenize = (code: string) => {
  const tokens: Token[] = [];
  const chars = code.split("");
  const reader = new CharArrayReader(chars);
  let tokenText = new StringBuffer();
  let token: Token = {};
  const initToken = (ch: string) => {
    if (tokenText.length() > 0) {
      token.text = tokenText.toString();
      tokens.push(token)
      tokenText = new StringBuffer();
      token = {};
    }
    let newState = DfaState.Initial;
    if (isAlpha(ch)) {
      if (ch === "i") {
        newState = DfaState.Id_int1;
      } else {
        newState = DfaState.Id;
      }
      token.type = TokenType.Identifier;
      tokenText.append(ch);
    } else if (isDigit(ch)) {
      newState = DfaState.IntLiteral;
      token.type = TokenType.IntLiteral;
      tokenText.append(ch);
    } else if (ch === "=") {
      newState = DfaState.Assignment;
      token.type = TokenType.Assignment;
      tokenText.append(ch);
    } else {
      newState = DfaState.Initial;
    }
    return newState;
  }
  const automateState = () => {

    let state = DfaState.Initial;
    let ch: any;
    while ((ch = reader.read()) !== -1) {
      switch (state) {
        case DfaState.Initial:

      }
    }
  }
}

export class CharArrayReader {
  charArray: string[];
  position: number;
  markedPosition: number;
  constructor(charArray: string[]) {
    this.charArray = charArray;
    this.position = 0;
    this.markedPosition = 0;
  }

  read() {
    if (this.position >= this.charArray.length) {
      return -1;
    }
    return this.charArray[this.position++];
  }

  skip(n: number) {
    this.position += n;
    if (this.position > this.charArray.length) {
      this.position = this.charArray.length;
    }
  }

  ready() {
    return this.position < this.charArray.length;
  }

  mark() {
    this.markedPosition = this.position;
  }

  reset() {
    this.position = this.markedPosition;
  }
}


export class StringBuffer {
  strs: string[] = [];
  append(str: string) {
    this.strs.push(str);
    return this;
  }
  toString() {
    return this.strs.join("");
  }
  length() {
    return this.strs.length;
  }
}

export enum DfaState {
  Initial = "Initial",
  Id_int1 = "Id_int1",
  Id_int2 = "Id_int2",
  Id_int3 = "Id_int3",
  Id = "Id",
  IntLiteral = "IntLiteral",
  GT = "GT",
  GE = "GE",
  Assignment = "Assignment"
}

export interface TokenReader {
  read(): Token | undefined;
  peek(): Token | undefined;
  unread(): void;
  getPosition(): number;
  setPosition(pos: number): void;
}

export class SimpleTokenReader implements TokenReader {
  tokens: Token[];
  pos: number = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  read(): Token | undefined {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]
    } else {
      return undefined
    }
  }
  peek(): Token | undefined {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos]
    } else {
      return undefined
    }
  }
  unread(): void {
    if (this.pos > 0) {
      this.pos--;
    }
  }
  getPosition(): number {
    return this.pos
  }
  setPosition(pos: number): void {
    if (pos >= 0 && pos < this.tokens.length) {
      this.pos = pos;
    }
  }
}
