import { animate, state, style, transition, trigger, keyframes } from '@angular/animations';

// Component transition animations
export const slideInDownAnimation =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.2s ease-in')
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateY(100%)'
      }))
    ])
  ]);

export const fadeIn = trigger('fadeIn', [
  transition("void => *", [
    style({ opacity: 0 }),
    animate(600, style({ opacity: 1 }))
  ]),
  transition("* => void", [
    animate(600, style({ opacity: 0 }))
  ])
]);

export const flyIn = trigger('flyIn', [
  state('in', style({ transform: 'translateX(0)' })),
  transition('void => *', [
    animate(300, keyframes([
      style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
      style({ opacity: 1, transform: 'translateX(25px)', offset: 0.3 }),
      style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
    ]))
  ]),
  transition('* => void', [
    animate(300, keyframes([
      style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
      style({ opacity: 1, transform: 'translateX(-25px)', offset: 0.7 }),
      style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
    ]))
  ])
]);

export const tipIn = trigger('tipIn', [
  state('show', style({
    display: 'block'
  })),
  state('hide', style({
    display: 'none'
  })),
  transition('* => *', animate('1s 0s linear'))
]);
