import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector, INIT,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {routerReducer, RouterReducerState} from '@ngrx/router-store';
import {storeFreeze} from 'ngrx-store-freeze';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: Action): any => {
    console.log('debugOne: ', state, action);

    const newState = reducer(state, action);

    console.log('debugTwo: ', state, action);

    return newState;
  };
}

export function debugTwo(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: Action): any => {
    console.log('debugThree: ', state, action);

    const newState = reducer(state, action);

    console.log('debugFour: ', state, action);

    return newState;
  };
}

// meta-reducers are similar to middleware in Redux, 前置中间件和后置中间件
export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze, debugTwo, debug] : [];


@Injectable()
export class UserEffects {
  // Stream of all actions dispatched in your application including actions dispatched by effect streams.
  constructor(private actions$: Actions) {

  }

  @Effect({dispatch: false})
  storeInit$ = this.actions$.pipe(
    ofType('ROUTER_NAVIGATION', '@ngrx/effects/init'),
    tap(action => {console.log('@ngrx/store/init', action)}),
  )
}