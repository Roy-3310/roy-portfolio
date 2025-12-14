export default class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(s) {
    return new Vec2(this.x * s, this.y * s);
  }

  div(s) {
    return new Vec2(this.x / (s || 1), this.y / (s || 1));
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  set length(nv) {
    const u = this.unit.mul(nv);
    this.x = u.x;
    this.y = u.y;
  }

  get unit() {
    const len = this.length || 1;
    return this.div(len);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  distance(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  rotate(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
  }

  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
}
