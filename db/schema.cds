namespace BackOrder;

entity BackOrderItems {
    key ID             : Int16; //itemNumber
        soldTo         : String(255);
        shipTo         : String(255);
        productCode    : String(255);
        quantity       : Int16;
        currency       : String(3);
        dealerPrice    : Decimal(3, 2);
        totalPrice     : Decimal(3, 2);
        erpOrderNumber : String(20); // orderNumber
        orderDate      : DateTime;
        orderStatus    : String(5);
        invoiceNumber  : Int16; //invoiceNumber
        poNumber       : Int16; //poNumber
}
