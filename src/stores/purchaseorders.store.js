import { observable, action } from 'mobx';

export default class PurchaseOrdersStore {
  @observable purchaseOrders = null;
  @observable filters = { poStatus: '', search: '' };
  @observable pdf = {};

  @observable suppliers = [];
  @observable contacts = [];

  constructor(purchaseOrdersService) {
    this.purchaseOrdersService = purchaseOrdersService;
  }

  async updateFilters({ poStatus, search }) {
    this.filters.poStatus = poStatus;
    this.filters.search = search;
    await this.fetchPurchaseOrders();
  }

  @action
  getSuppliers() {
    this.suppliers = this.purchaseOrdersService.getSuppliers();
  }

  @action
  getContacts() {
    this.contacts = this.purchaseOrdersService.getContacts();
  }

  @action
  getContactsBySupplierId(supplierId) {
    this.contacts = this.purchaseOrdersService.getContactsBySupplierId(supplierId);
  }

  @action
  resetPurchaseOrders() {
    this.purchaseOrders = null;
  }

  @action
  async fetchPurchaseOrders() {
    const result = await this.purchaseOrdersService.fetchPurchaseOrders(this.filters);

    if (result) {
      this.purchaseOrders = result.data;
    }
  }

  @action
  async fetchPurchaseOrderById(id) {
    const result = await this.purchaseOrdersService.fetchPurchaseOrderById(id);

    if (result) {
      this.purchaseOrders = [result.data];
    }

    return result.data;
  }

  @action
  async createPurchaseOrder(purchaseOrderDto) {
    const result = await this.purchaseOrdersService.createPurchaseOrder(purchaseOrderDto);

    if (result) {
      this.purchaseOrders = [result.data];
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
  generatePdf(id) {
    return this.purchaseOrdersService.generatePdf(id);
  }
}
