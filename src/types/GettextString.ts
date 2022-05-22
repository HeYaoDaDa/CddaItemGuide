export class GettextString {
  msg: string;
  ctx?: string;
  constructor(msg: string, ctx?: string) {
    this.msg = msg;
    this.ctx = ctx;
  }
}
