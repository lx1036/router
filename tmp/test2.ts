


type Position = {x: string, y: string};
type Scroll = {z?: number};
type View = Position & Scroll;

let view: View = {x: '1', y: '2'};