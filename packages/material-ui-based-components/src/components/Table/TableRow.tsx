import React, { useCallback, useContext } from 'react';
import { withRuleEnginePanel } from '../../shared/withRuleEngine';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { PROPS_PANEL } from '../../utils/types';

function TableRowComponent(props: PROPS_PANEL) {

    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.items || [];

    const getCell = useCallback((row: any) => {
        if (row[0].fieldType !== 'panel') {
            return (
                <TableRow>
                    {row.map((cell: any, index: number) => (
                        <TableCell key={cell.id}>
                            {getChild(cell, index)}
                        </TableCell>
                    ))}
                    <TableCell></TableCell>
                </TableRow>);
        }
        return (
            row.map((r: any) => {
                const newRow = r.items[0];
                return (
                    <TableRow key={r.id}>
                        {
                            newRow.items.map((cell: any, index: number) => {
                                return (
                                    <TableCell key={cell.id}>
                                        {getChild(cell, index)}
                                    </TableCell>
                                );
                            })
                        }
                        <TableCell>{getChild(r.items[1], r.items[1].id)} {getChild(r.items[2], r.items[2].id)}</TableCell>
                    </TableRow>
                );
            }));

    }, [props, items]);

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, []);

    return (
        <>
            {getCell(items)}
        </>
    );
}

export default withRuleEnginePanel(TableRowComponent);