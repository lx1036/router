import {makeMap} from "../utils";

const comment = /^<!\--/;
const doctype = /^<!DOCTYPE [^>]+>/i;
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;


const isPlainTextElement = makeMap('script,style,textarea', true);


type StartTagMatch = {
  tagName: string, // ["<div", "div", index: 0, input: "<div class="box"></div>", groups: undefined]
  attrs: [],
  start: number,
  unarySlash: string, // 自闭合标签则为 '/'
  end: number,
}

export class HtmlParser {
  index = 0;
  html: string;
  
  constructor(public options) {}
  
  /**
   * Parse html:
   * <div>
   *   <p>{{name}}</p>
   * </div>
   * to:
   *
   * @param html
   * @param options
   */
  parse(html: string, options) {
    let lastTag;
    
    while (html) {
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        let textEnd = html.indexOf('<');
      
        if (textEnd === 0) {
          // Comment: <!--<h1>This is an about page</h1>-->
          if (comment.test(html)) {
            const commentEnd = html.indexOf('-->');
          
            if (commentEnd >= 0) {
            
            }
          }
          
          // <!DOCTYPE html>
          const doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            this.advance(doctypeMatch[0].length);
            continue;
          }
          
          // End Tag
          const endTagMatch = html.match(endTag);
          if (endTagMatch) {
            const start = this.index;
            this.advance(endTagMatch[0].length);
            this.handleEndTag(endTagMatch[1], start, this.index);
            continue;
          }
  
          // Start Tag
          const startTagMatch = this.parseStartTag();
          if (startTagMatch) {
            this.handleStartTag(startTagMatch);
            
            continue;
          }
        }
        
        let text;
      
        if (textEnd >= 0) {
        
        }
      
        if (textEnd < 0) { // html 是文本
          text = html
        }
        
        if (text) {
          this.advance(text.length);
        }
      } else { // 纯文本内容元素: is the <template> or <script> or <style> tag
      
        this.handleEndTag(stackedTag);
      }
    }
  }
  
  advance(step) {
    this.index += step;
    this.html = this.html.substring(step);
  }
  
  parseStartTag(): void | StartTagMatch {
    const start = this.html.match(startTagOpen); // <div class="box"></div>
    
    if (start) {
      const match: StartTagMatch = {
        tagName: start[1], // ["<div", "div", index: 0, input: "<div class="box"></div>", groups: undefined]
        attrs: [],
        start: this.index,
        unarySlash: '', // 自闭合标签则为 '/'
        end: 0,
      };
      this.advance(start[0].length); // 截取 <div 后为 ' class="box></div>"'
      let end, attr: {start: number, end: number};
  
      /**
       *
       * 依次截取 '<div class="box" id="name"></div>' attr 属性，把
       */
      // ' class="box" id="name"></div>'.match(attribute) -> attr=[" class="box"", "class", "=", "box", undefined, undefined, index: 0, input: " class="box" id="name"></div>", groups: undefined]
      while (!(end = this.html.match(startTagClose)) && (attr = this.html.match(dynamicArgAttribute) || this.html.match(attribute))) {
        attr.start = this.index;
        this.advance(attr[0].length);
        attr.end = this.index;
        match.attrs.push(attr);
      }
  
      // startTagClose 开始标签的闭合部分
      if (end) { // [">", "", index: 0, input: "></div>", groups: undefined] or 自闭合标签 ["/>", "/", index: 0, input: "/>", groups: undefined]
        match.unarySlash = end[1];
        this.advance(end[0].length);
        match.end = this.index;
        
        return match;
      }
    }
    
    return;
  }
  
  /**
   * 将 tagName,attrs,unary 等数据取出来，并调用钩子函数把数据存入参数中
   * @param match
   */
  handleStartTag(match: StartTagMatch) {
    const tagName = match.tagName;
    const unarySlash = match.unarySlash;
  
    const l = match.attrs.length;
    const attrs = new Array(l);
    
    for (let i = 0; i < l; i++) {
    
    }
    
    if (this.options.start) {
      this.options.start(tagName, attrs, !!unarySlash, match.start, match.end);
    }
  }
  
  handleEndTag(tagName, start, end) {
  
  }
}


/**
 * Demo:
 */

const htmlParser = new HtmlParser();
htmlParser.parse('<template><div><p>{{name}}</p></div></template>', {});


