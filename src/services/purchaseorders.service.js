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

  getSuppliers() {
    return this.get('suppliers/');
  }

  getContacts() {
    return this.get('contacts/');
  }

  getContactsBySupplierId(supplierId) {
    return this.get(`contacts/supplierid/${ supplierId }`);
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
      return result;
    }
  }

  fetchPurchaseOrderById(id) {
    return this.get(`purchaseorders/id/${id}`);
  }

  generatePdf(id) {
    return this.get(`purchaseorders/id/${id}/generatepdf`);
  }
}
