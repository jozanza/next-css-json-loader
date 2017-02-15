import test from 'ava';
import { merge, camelize } from './utils';

test('merge', t =>{
  const foo = { bar: true };
  const baz = { qux: false };
  const expected = {
    bar: true,
    qux: false
  };
  t.deepEqual(merge(foo, baz), expected);
});

test('camelize', t => {
  const foo = 'foo-bar-baz-qux';
  const expected = 'fooBarBazQux';
  t.is(camelize(foo), expected);
});
