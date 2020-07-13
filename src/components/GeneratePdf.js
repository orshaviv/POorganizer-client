import {docDesign} from "../pages/create-purchaseorder/document-design";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const convertProxyToArray = (list) => {
    const length = list.length;
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(list[i]);
    }
    return arr;
}

export default function generatePdf(purchaseOrderDto, userPreferences) {
    let { poId, supplierName, contactName,
        catalogNumber, quantity, details,
        itemCost, totalCostBeforeTax, taxPercentage,
        companyName, companyCode, companyAddress, companyEmail, companyWebsite
    } = purchaseOrderDto;

    catalogNumber = convertProxyToArray(catalogNumber);
    quantity = convertProxyToArray(quantity);
    details = convertProxyToArray(details);
    itemCost = convertProxyToArray(itemCost);

    const { headerLogo, footerLogo } = userPreferences;

    const purchaseOrder = { poId, supplierName, contactName,
        catalogNumber, quantity, details,
        itemCost, totalCostBeforeTax, taxPercentage,
        companyName, companyCode, companyAddress, companyEmail, companyWebsite };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = docDesign(purchaseOrder, headerLogo, footerLogo);
    const fileName = `PO-${ poId }.pdf`;

    try {
        pdfMake.createPdf(docDefinition).download(fileName);
    }catch (error) {
        console.log(error);
    }
}
