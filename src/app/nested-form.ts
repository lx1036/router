import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm} from '@angular/forms';



@Component({
  selector: 'address',
  template: `
    <div [formGroup]="addressForm">
      <div class="form-group col-xs-6">
        <label>street</label>
        <input type="text" class="form-control" formControlName="street">
        <small [hidden]="addressForm.controls['street'].valid" class="text-danger">
          Street is required
        </small>
      </div>
      <div class="form-group col-xs-6">
        <label>postcode</label>
        <input type="text" class="form-control" formControlName="postcode">
      </div>
    </div>
  `
})
export class AddressComp {
  @Input('group') public addressForm: FormGroup;
}

@Component({
  selector: 'nested-form',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="margin-20">
            <h4>Add customer</h4>
          </div>
          <form [formGroup]="myForm" novalidate (ngSubmit)="save($event)">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" formControlName="name">
              <small *ngIf="!myForm.controls['name'].valid" class="text-danger">
                Name is required (minimum 5 characters).
              </small>
            </div>
            <!--addresses-->
            <div formArrayName="addresses">
              <div *ngFor="let address of addressesArray.controls; let i=index" class="panel panel-default">
                <div class="panel-heading">
                  <span>Address {{i + 1}}</span>
                  <span class="glyphicon glyphicon-remove pull-right" *ngIf="addressesArray.controls.length > 1" (click)="removeAddress(i)">Remove Address {{i + 1}}</span>
                </div>
                <div class="panel-body" [formGroupName]="i">
                  <address [group]="address"></address>
                </div>
              </div>
            </div>

            <div class="margin-20">
              <a (click)="addAddress()" style="cursor: default">Add another address +</a>
            </div>

            <div class="margin-20">
              <button type="submit" class="btn btn-primary pull-right" [disabled]="!myForm.valid">Submit</button>
            </div>
            <div class="clearfix"></div>

            <div class="margin-20">
              <div>myForm details:-</div>
              <pre>Is myForm valid?: <br>{{myForm.valid | json}}</pre>
              <pre>form value: <br>{{myForm.value | json}}</pre>
            </div>
          </form>
          <form [formGroup]="form2" (ngSubmit)="submit($event)" (submit)="rawSubmit($event)">
            <input type="text" formControlName="name"/>
            <button type="submit" (click)="buttonSubmit($event)" class="btn btn-primary pull-right">Submit</button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PersonInfoComp implements OnInit {
  myForm: FormGroup;
  form2: FormGroup;

  addressesArray: FormArray;

  constructor(private _fb: FormBuilder) {}

  submit($event) {
    console.log('submit', $event);
  }

  rawSubmit($event) {
    console.log('rawSubmit', $event);
  }

  buttonSubmit($event) {
    console.log('buttonSubmit', $event);
  }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      name: [''],
      addresses: this._fb.array([])
    });

    this.form2 = this._fb.group({
      name: ['']
    });

    this.addressesArray = <FormArray>this.myForm.controls['addresses'];
  }

  addAddress() {
    const control = <FormArray>this.myForm.controls['addresses'];

    const address: FormGroup = this._fb.group({
      street: [''],
      postcode: [''],
    });

    control.push(address);

    // address.valueChanges.subscribe(console.log);
  }

  removeAddress(index: number) {
    const control = <FormArray>this.myForm.controls['addresses'];

    control.removeAt(index);
  }

  save($event) {
    console.log($event);
  }
}
