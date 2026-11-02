using BackOrder as my from '../db/schema';

service BackOrderService {
    entity BackOrderItems as projection on my.BackOrderItems;

    type SearchByOptions : String enum {
        orderNumber;
        invoiceNumber;
        poNumber;
        itemNumber;
    }

    type SearchRequest {
        soldTo      : String(255);
        shipTo      : many String;
        search      : String(25);
        searchBy    : SearchByOptions;
        fromDate    : DateTime;
        toDate      : DateTime;
        status      : many String;
        sort        : String;
        dir         : String;
        currentPage : Int16;
        pageSize    : Int16;
        orderType   : many String;
    }

    type BackOrderItem {
        productCode    : String(255);
        quantity       : Int16;
        currency       : String(3);
        dealerPrice    : Decimal(3, 2);
        totalPrice     : Decimal(3, 2);
        erpOrderNumber : String(20);
        orderDate      : DateTime;
        orderStatus    : String(5);
    }

    type BackOrderResponse {
        entries      : many BackOrderItem;
        currentPage  : Int16;
        pageSize     : Int16;
        totalPages   : Int16;
        totalResults : Int16;
    }

    action getBackOrderItems(request: SearchRequest) returns BackOrderResponse;
}
