import {
  ASTDirective,
  ASTElementHandlers,
  ASTIfCondition,
  ASTNode, DirectiveFunction,
  ModuleOptions,
  SSROptimizability
} from "vue-template-compiler";

export interface ASTElement {
  type: 1;
  tag: string;
  attrsList: { name: string; value: any }[];
  attrsMap: Record<string, any>;
  parent: ASTElement | undefined;
  children: ASTNode[];
  
  processed?: true;
  
  static?: boolean;
  staticRoot?: boolean;
  staticInFor?: boolean;
  staticProcessed?: boolean;
  hasBindings?: boolean;
  
  text?: string;
  attrs?: { name: string; value: any }[];
  props?: { name: string; value: string }[];
  plain?: boolean;
  pre?: true;
  ns?: string;
  
  component?: string;
  inlineTemplate?: true;
  transitionMode?: string | null;
  slotName?: string;
  slotTarget?: string;
  slotScope?: string;
  scopedSlots?: Record<string, ASTElement>;
  
  ref?: string;
  refInFor?: boolean;
  
  if?: string;
  ifProcessed?: boolean;
  elseif?: string;
  else?: true;
  ifConditions?: ASTIfCondition[];
  
  for?: string;
  forProcessed?: boolean;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;
  
  staticClass?: string;
  classBinding?: string;
  staticStyle?: string;
  styleBinding?: string;
  events?: ASTElementHandlers;
  nativeEvents?: ASTElementHandlers;
  
  transition?: string | true;
  transitionOnAppear?: boolean;
  
  model?: {
    value: string;
    callback: string;
    expression: string;
  };
  
  directives?: ASTDirective[];
  
  forbidden?: true;
  once?: true;
  onceProcessed?: boolean;
  wrapData?: (code: string) => string;
  wrapListeners?: (code: string) => string;
  
  // 2.4 ssr optimization
  ssrOptimizability?: SSROptimizability;
  
  // weex specific
  appendAsTree?: boolean;
}

export interface CompilerOptions {
  modules?: ModuleOptions[];
  directives?: Record<string, DirectiveFunction>;
  preserveWhitespace?: boolean;
  whitespace?: 'preserve' | 'condense';
  outputSourceRange?: any
}

export interface CompiledResult<ErrorType> {
  ast: ASTElement | undefined;
  render: string;
  staticRenderFns: string[];
  errors: ErrorType[];
  tips: ErrorType[];
}


