// import truncate from "../src/client/js/helpers"
const helpers=require('../src/client/js/helpers');

describe('Truncate scenarios', () => {
    it('should give 5',  () => {
      expect(helpers.truncate(5.123)).toBe(5);
    }),
    it('should give -4',  () => {

      expect(helpers.truncate(-4.123)).toBe(-4);
    })
  })