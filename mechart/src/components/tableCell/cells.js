let priceCell = {
  template: `<div :style="{color: rowColor}">{{this.row.marketPrice}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      return this.row.adRatioColor;
    }
  }
};
let updownCell = {
  template: `<div :style="{color: this.rowColor}" >{{row.adRatioString}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      return this.row.adRatioColor;
    }
  }
};
let rateCell = {
  template: `<div :style="{color: '#e5962e' }">{{row.discountRateString }}</div>`,
  props: ['row']
};
let cccfCell = {
  template: `<div :style="{color: '#e5962e'}">{{row.flowCoefficient}}</div>`,
  props: ['row']
};
export {
  cccfCell,
  rateCell,
  priceCell,
  updownCell
};
