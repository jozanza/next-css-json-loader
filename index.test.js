import test from 'ava';
import loader from './index';

const content = `
.foo {
  width: 100%;
}

@keyframes bounce {
  0%, 50% { blah: .5; }
  to   { lol: 100vh; }
}

@media(min-width: 100px; max-width: 1000px) {
  .foo {
    bar: 88px;
  }
}

@font-face {
  font-family: Open Sans;
  font-style: normal;
  font-weight: 400;
  src: local('Open Sans'),
       local('OpenSans'),
       url('https://fonts.gstatic.com/s/...');
}
`;

test('es6 module with named + default exports', t => {
  const self = { context: '' };
  const output = loader.call(self, content);
  t.snapshot(output);
});
