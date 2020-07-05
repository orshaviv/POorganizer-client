import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function createRow(catalogNumber, details, quantity, itemCost) {
    const price = (parseInt(quantity) * parseFloat(itemCost)).toFixed(1);
    return { quantity, catalogNumber, details, itemCost, price };
}

export default function SpanningTable(itemsList) {
    const { quantity, catalogNumber, details,
        itemCost, totalCostBeforeTax, taxPercentage
    } = itemsList;

    const currency = 'NIS';

    const rows = [];
    for (let index=0; index < catalogNumber.length; index++) {
        rows.push(
            createRow(catalogNumber[index],
                details[index],
                quantity[index],
                itemCost[index]
            )
        );
    }

    const purchaseOrderTax = taxPercentage/100 * parseFloat(totalCostBeforeTax);
    const totalCost = purchaseOrderTax + totalCostBeforeTax;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={3}>
                            Details
                        </TableCell>
                        <TableCell align="right">Price</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">Qty.</TableCell>
                        <TableCell align="left">CAT No.</TableCell>
                        <TableCell align="left">Details</TableCell>
                        <TableCell align="right">Cost</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.quantity}>
                            <TableCell align="center">{row.quantity}</TableCell>
                            <TableCell align="left">{row.catalogNumber}</TableCell>
                            <TableCell align="left">{row.details}</TableCell>
                            <TableCell align="right">{row.itemCost} {currency}</TableCell>
                            <TableCell align="right">{row.price} {currency}</TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}></TableCell>
                        <TableCell align="left">Subtotal</TableCell>
                        <TableCell align="right">{ccyFormat(totalCostBeforeTax)} {currency}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell align="left">Tax {`${(taxPercentage).toFixed(0)}%`}</TableCell>
                        <TableCell align="right">{ccyFormat(purchaseOrderTax)} {currency}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell align="left">Total</TableCell>
                        <TableCell align="right">{ccyFormat(totalCost)} {currency}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
