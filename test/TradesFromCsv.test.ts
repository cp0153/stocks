import * as t from '../src/models/Market'

test('read from csv', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });