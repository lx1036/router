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

export class HtmlParser {
  index = 0;
  html: string;
  
  parse(html: string, options) {
    let lastTag;
    
    while (html) {
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
            this.advance(endTagMatch[0].length);
            continue;
          }
  
          // Start Tag
          const startTagMatch = this.parseStartTag();
          if (startTagMatch) {
            
            
            
            continue;
          }
        }
      
        if (textEnd >= 0) {
        
        }
      
        if (textEnd < 0) {
        
        }
      } else {
      
      }
    }
  }
  
  advance(step) {
    this.index += step;
    this.html = this.html.substring(step);
  }
  
  parseStartTag() {
    const start = this.html.match(startTagOpen);
    
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: this.index,
        unarySlash: '', // ?? 自闭合标签
        end: 0, // ??
      };
      this.advance(start[0].length);
      let end, attr;
      
      while (!(end = this.html.match(startTagClose)) && (attr = this.html.match(dynamicArgAttribute) || this.html.match(attribute))) {
        attr.start = this.index;
        this.advance(attr[0].length);
        attr.end = this.index;
        match.attrs.push(attr);
      }
      
      if (end) {
        match.unarySlash = end[1];
        this.advance(end[0].length);
        match.end = this.index;
        
        return match;
      }
    }
  }
  
  handleStartTag(match) {
  
  }
}





