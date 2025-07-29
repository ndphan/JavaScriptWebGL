export default class Timer {
  _start: number = Date.now();
  _end: number;
  start(): Timer {
    this._start = Date.now();
    return this;
  }
  peak(): number {
    return Date.now() - this._start;
  }
  stop(): number {
    this._end = Date.now();
    const elapsed = this._end - this._start;
    this._start = this._end;
    return elapsed;
  }
}
