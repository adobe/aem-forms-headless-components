import React, { useCallback, useContext } from 'react';
import { withRuleEnginePanel } from '../../shared/withRuleEngine';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { PROPS_PANEL } from '../../utils/types';

function TableHeaderComponent(props: PROPS_PANEL) {

    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.items || [];

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, [props]);

    return (
        <TableRow>
            {items.map((cell: any, index: number) => (
                <TableCell key={cell.id}>{getChild(cell, index)}</TableCell>
            ))}
        </TableRow>
    );
}

export default withRuleEnginePanel(TableHeaderComponent);