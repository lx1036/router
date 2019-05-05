import {
  AfterViewInit,
  Component,
  EventEmitter, Inject, Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {BlockScrollStrategy, Overlay} from '@angular/cdk/overlay';
import {InputBoolean} from '../core/decorator';
import {fromEvent, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil} from 'rxjs/operators';


@Injectable()
export class ModalService {

  confirm(param: { title: string; content: string; onOk: () => Promise<any | void> }) {
    
  }
}

@Component({
  selector: 'ng-modal',
  template: `
    <div>
      <div class="ant-modal-mask"></div>
      <div>
        <div>
          <button></button>
        </div>
      </div>
    </div>
    
    <ng-template #tplOriginContent>
    
    </ng-template>
    
    <ng-template #tplContentDefault>
    
    </ng-template>
    
    <ng-template #tplContentConfirm>
    
    </ng-template>
  `
})
export class ModalComponent<T = any> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() @InputBoolean() isVisible = false;
  @Input() title: string | TemplateRef<void>;

  @Output() ok = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<T>();

  private scrollStrategy: BlockScrollStrategy;
  private unsubscribe$ = new Subject<void>();

  constructor(private _overlay: Overlay, @Inject(DOCUMENT) private _document: any) {
    this.scrollStrategy = this._overlay.scrollStrategies.block();
  }

  ngOnInit(): void {

    fromEvent(this._document.body, 'keydown')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {});
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewInit(): void {

  }



  ngOnDestroy(): void {

  }



  
}
