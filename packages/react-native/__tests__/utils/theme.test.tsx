import Themes from '../../src/utils/theme';

describe('Theme', () => {
  test('test primary', () => {
    expect(Themes.primary).toHaveProperty('colors');
  });
  test('test tertiary', () => {
    expect(Themes.tertiary).toHaveProperty('colors');
  });
  test('test rose', () => {
    expect(Themes.rose).toHaveProperty('colors');
  });
  test('test warning', () => {
    expect(Themes.warning).toHaveProperty('colors');
  });
  test('test indigo', () => {
    expect(Themes.indigo).toHaveProperty('colors');
  });

});