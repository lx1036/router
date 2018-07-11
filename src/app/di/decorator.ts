import {Type} from '../packages/angular/core/src/type';
import {TypeDecorator, ANNOTATIONS} from '../packages/angular/core/src/util/decorators';
import {DirectiveDecorator} from '../packages/angular/core/src/metadata/directives';


/**
 * yarn ts-node src/app/di/decorator.ts
 */


export interface Directive {
  selector?: string;
}


export function makeDecorator(name: string, props?: (...args: any[]) => any, parentClass?: any, chainFn?: (fn: Function) => void, typeFn?: (type: Type<any>, ...args: any[]) => void):
  {new (...args: any[]): any; (...args: any[]): any; (...args: any[]): (cls: any) => any;} {
  const metaCtor = makeMetadataCtor(props);

  function DecoratorFactory(...args: any[]): (cls: any) => any {
    console.log(args);

    if (this instanceof DecoratorFactory) {
      metaCtor.call(this, ...args);
      return this;
    }

    const annotationInstance = new (<any>DecoratorFactory)(...args);
    const TypeDecorator: TypeDecorator = <TypeDecorator>function TypeDecorator(cls: Type<any>) {
      typeFn && typeFn(cls, ...args);
      // Use of Object.defineProperty is important since it creates non-enumerable property which
      // prevents the property is copied during subclassing.
      const annotations = cls.hasOwnProperty(ANNOTATIONS) ? (cls as any)[ANNOTATIONS] : Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
      annotations.push(annotationInstance);

      return cls;
    };

    if (chainFn) chainFn(TypeDecorator);

    return TypeDecorator;
  }

  if (parentClass) {
    DecoratorFactory.prototype = Object.create(parentClass.prototype);
  }

  DecoratorFactory.prototype.ngMetadataName = name;

  // console.log(DecoratorFactory, typeof DecoratorFactory);

  (<any>DecoratorFactory).annotationCls = DecoratorFactory;

  return DecoratorFactory as any;
}

function makeMetadataCtor(props?: (...args: any[]) => any): any {
  return function ctor(...args: any[]) {
    if (props) {
      const values = props(...args);
      for (const propName in values) {
        this[propName] = values[propName];
      }
    }
  };
}


export const Directive: DirectiveDecorator = makeDecorator('Directive', (dir: Directive = {}) => dir);


@Directive({
  selector: 'app'
})
export class AppDirective {

}

// console.log(Directive, Directive({selector: 'test'}), new AppDirective());
