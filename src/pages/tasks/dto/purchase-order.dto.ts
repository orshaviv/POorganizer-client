
export class PurchaseOrderDto {
    public poId!: string;

    public deliveryMethod!: string;

    public paymentMethod!: string

    public paymentStatus!: string;

    public completionDate!: string;

    public supplierName!: string;

    public supplierId!: number;

    public contactFirstName!: string;

    public contactLastName!: string;

    public contactId!: number;

    public quantities!: number[];

    public catalogNumbers!: string[];

    public itemsId!: number[];

    public details!: string[];

    public itemsCost!: number[];

    public taxPercentage!: number;
}
