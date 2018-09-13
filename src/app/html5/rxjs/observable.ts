import {Observable} from "rxjs";


console.log(11);

const httpEvents$ = new Observable((observer) => {
  observer.next('b');

  return () => { return 'a'};
});

httpEvents$.subscribe((event) => {
  console.log(event);
});