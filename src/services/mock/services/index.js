export class MockServices {
  factoryDataSet = undefined;
  records = [];
  defaults = { recordsCount: 10 };
  constructor({ ...options }) {
    const { initRecords, recordsCount } = options;
    if (initRecords) {
      this.setRecords(recordsCount || this.defaults.recordsCount);
    }
  }
  setRecords(n) {
    for (let i = 0; i <= n - 1; i++) {
      this.records.push(this.createRecord());
    }
  }
  getRecord(id) {
    return; // find by ID;
  }
  getRecords(n) {
    this.setRecords(n);
    return this.records;
  }
  createRecord() {
    return this.factoryDataSet.build();
  }
}
