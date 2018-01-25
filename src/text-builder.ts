import * as _ from 'lodash';

export class TextBuilder {
  private text: string = '';

  public add(text: string = '') {
    this.text += this.stringOrEmpty(text);
  }

  public addLine(text: string = '', lineDelimiter: string = '\n') {
    this.text += this.stringOrEmpty(text) + this.stringOrEmpty(lineDelimiter);
  }

  public addParagraph(text: string, lineDelimiter: string = '\n\n') {
    if (this.text && this.text.length > 0 && !_.every(this.text, (char) => char === '\n')) {
      this.text += this.stringOrEmpty(lineDelimiter);
    }
    this.text += this.stringOrEmpty(text);
  }

  public toString(): string {
    return this.text;
  }

  private stringOrEmpty(str: string) {
    return str || '';
  }
}
