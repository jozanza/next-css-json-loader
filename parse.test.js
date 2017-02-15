import test from 'ava';
import parse from './parse';

test('basic rules', t => {
  const ctx = '';
  const input = `
  .foo { width: 100%; }`;
  const output = parse(ctx)(input);
  t.snapshot(output);
});

test('@keyframes', t => {
  const ctx = '';
  const input = `
  @keyframes bounce {
    0%, 50% { blah: .5; }
    to   { lol: 100vh; }
  }`;
  const output = parse(ctx)(input);
  t.snapshot(output);
});

test('@media', t => {
  const ctx = '';
  const input = `
  @media(min-width: 100px; max-width: 1000px) {
    .foo {
      bar: 88px;
    }
  }`;
  const output = parse(ctx)(input);
  t.snapshot(output);
});

test('@font-face', t => {
  const ctx = '';
  const input = `
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Open Sans'),
         local('OpenSans'),
         url('https://fonts.gstatic.com/s/...');
  }`;
  const output = parse(ctx)(input);
  t.snapshot(output);
});


