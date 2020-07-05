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

  async deletePurchaseOrder(id) {
    await this.delete(`purchaseorders/id/${id}/delete`);
  }

  updatePaymentStatus(id, paymentStatus) {
    return this.patch(`purchaseorders/id/${id}/updatepaymentstatus`, { paymentStatus });
  }

  updatePoStatus(id, poStatus) {
    return this.patch(`purchaseorders/id/${id}/updatepostatus`, { poStatus });
  }

  createPurchaseOrder(purchaseOrderDto) {
    return this.post(`purchaseorders/create`, { purchaseOrderDto });
  }

  generatePdf(id) {
    return this.get(`purchaseorders/id/${id}/generatepdf`);
  }
}
