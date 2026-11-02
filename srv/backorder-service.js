import cds from '@sap/cds'

export default cds.service.impl(async function () {


    const { BackOrderItems } = this.entities;

    // Function - Adding filters to query
    function addFilters(query, request) {
        const soldTo = request.soldTo;
        const shipTo = request.shipTo;
        const search = request.search;
        const searchBy = request.searchBy;
        const fromDate = request.fromDate;
        const toDate = request.toDate;
        const status = request.status;

        // soldTo
        query.where({ soldTo: soldTo });

        // shipTo - Array
        if (shipTo && shipTo.length > 0) {
            query.where({ shipTo: { in: shipTo } });
        }

        // search filter
        if (search && searchBy) {
            if (searchBy === 'orderNumber') {
                query.where({ erpOrderNumber: search });
            } else if (searchBy === 'invoiceNumber') {
                query.where({ invoiceNumber: search });
            } else if (searchBy === 'poNumber') {
                const searchText = '%' + String(search).toLowerCase() + '%';
                query.where('lower(poNumber) like', searchText);
            } else if (searchBy === 'itemNumber') {
                query.where({ ID: search });
            }
        }

        // date filter
        if (fromDate && toDate) {
            query.where('orderDate >=', fromDate).and('orderDate <=', toDate);
        }

        // status filter
        if (status && status.length > 0) {
            query.where({ orderStatus: { in: status } });
        }

        return query;
    }

    // Function - Sorting Column Order
    function getSortColumn(sort) {
        if (sort === 'orderDate') {
            return 'orderDate';
        } else if (sort === 'orderNumber') {
            return 'erpOrderNumber';
        } else if (sort === 'itemNumber') {
            return 'ID';
        } else if (BackOrderItems.elements[sort]) {
            return sort;
        } else {
            return 'orderDate';
        }
    }

    this.on('getBackOrderItems', async (req) => {
        const request = req.data.request;

        let currentPage = request.currentPage;
        let pageSize = request.pageSize;
        if (currentPage === undefined) {
            currentPage = 0;
        }
        if (pageSize === undefined) {
            pageSize = 12;
        }

        // 1: get the total count
        let countQuery = SELECT.one.from(BackOrderItems).columns('count(*) as total');
        countQuery = addFilters(countQuery, request);
        const countResult = await countQuery;
        const total = countResult.total;

        // no records found
        if (!total) {
            return null;
        }

        // 2: sorting
        const sortColumn = getSortColumn(request.sort);
        let sortDirection = 'desc';
        if (String(request.dir).toLowerCase() === 'asc') {
            sortDirection = 'asc';
        }

        // 3: get the records for the current page
        let dataQuery = SELECT.from(BackOrderItems).columns(
            'productCode',
            'quantity',
            'currency',
            'dealerPrice',
            'totalPrice',
            'erpOrderNumber',
            'orderDate',
            'orderStatus'
        );
        dataQuery = addFilters(dataQuery, request);

        const entries = await dataQuery
            .orderBy(sortColumn + ' ' + sortDirection, 'ID asc')
            .limit(pageSize, currentPage * pageSize);

        // 4: return the response
        return {
            entries: entries,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: Math.ceil(total / pageSize),
            totalResults: total
        };
    });
});