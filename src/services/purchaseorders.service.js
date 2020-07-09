import BaseHttpService from './base-http.service';
import queryString from 'query-string';

export default class PurchaseOrdersService extends BaseHttpService {
  fetchPurchaseOrders({ poStatus, search }) {
    const queryObj = {};

    if (poStatus) {
      queryObj.poStatus = poStatus;
    }

    if (search.length) {
      queryObj.search = search;
    }

    const queryStr = queryString.stringify(queryObj);
    return this.get('purchaseorders/' + (queryStr ? `?${queryStr}` : ''));
  }

  async getSuppliers() {
    return await this.get('suppliers/');
  }

  async getContacts() {
    return await this.get('contacts/');
  }

  async getContactsBySupplierId(supplierId) {
    return await this.get(`contacts/supplierid/${ supplierId }`);
  }

  async deletePurchaseOrder(id) {
    await this.delete(`purchaseorders/id/${id}/delete`);
  }

  updatePaymentStatus(id, paymentStatus) {
    return this.patch(`purchaseorders/id/${id}/updatepaymentstatus`, { paymentStatus });
  }

  updatePoStatus(id, poStatus) {
    return this.patch(`purchaseorders/id/${id}/updatepostatus`, { poStatus });
  }

  async createPurchaseOrder(purchaseOrderDto) {
    const {
      deliveryMethod,
      paymentMethod,
      completionDate,
      supplierName,
      contactName,

      supplierId,
      contactId,
      taxPercentage,

      catalogNumbers,
      quantities,
      itemsCost,
      details
    } = purchaseOrderDto;

    const result = await this.post(`purchaseorders/create`, {
      deliveryMethod,
      paymentMethod,
      completionDate,
      supplierName,
      contactName,

      supplierId,
      contactId,
      taxPercentage,

      catalogNumbers,
      quantities,
      itemsCost,
      details
    });

    if (result) {
      return result.data;
    }
  }

  async fetchPurchaseOrderById(id) {
    const result = await this.get(`purchaseorders/id/${id}`);

    if (result) {
      return result.data;
    }
  }
}
