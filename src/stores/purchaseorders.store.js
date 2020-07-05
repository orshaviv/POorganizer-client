import { observable, action } from 'mobx';

export default class PurchaseOrdersStore {
  @observable purchaseOrders = [];
  @observable filters = { poStatus: '', search: '' };
  @observable pdf = {};

  constructor(purchaseOrdersService) {
    this.purchaseOrdersService = purchaseOrdersService;
  }

  async updateFilters({ poStatus, search }) {
    this.filters.poStatus = poStatus;
    this.filters.search = search;
    await this.fetchPurchaseOrders();
  }

  @action
  resetPurchaseOrders() {
    this.purchaseOrders = [];
  }

  @action
  async fetchPurchaseOrders() {
    const result = await this.purchaseOrdersService.fetchPurchaseOrders(this.filters);

    if (result) {
      this.purchaseOrders = result.data;
    }
  }

  @action
  async createPurchaseOrder(purchaseOrderDto) {
    const result = await this.purchaseOrdersService.createPurchaseOrder(purchaseOrderDto);

    if (result) {
      this.purchaseOrders.push(result.data);
    }
  }

  @action
  async deletePurchaseOrder(id) {
    const idx = this.purchaseOrders.findIndex(po => po.id === id);
    await this.purchaseOrdersService.deletePurchaseOrder(id);
    this.purchaseOrders.splice(idx, 1);
  }

  @action
  async updatePaymentStatus(id, paymentStatus) {
    const purchaseOrder = this.purchaseOrders.find(po => po.id === id);
    await this.purchaseOrdersService.updatePaymentStatus(id, paymentStatus);
    purchaseOrder.paymentStatus = paymentStatus;
  }

  @action
  async updatePoStatus(id, poStatus) {
    const purchaseOrder = this.purchaseOrders.find(po => po.id === id);
    await this.purchaseOrdersService.updatePoStatus(id, poStatus);
    purchaseOrder.poStatus = poStatus;
  }

  @action
  async generatePdf(id) {
    const result = await this.purchaseOrdersService.generatePdf(id);

    if (result) {
      return result;
    }
  }
}
