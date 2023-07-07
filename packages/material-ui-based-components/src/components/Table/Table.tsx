import React, { useCallback, useContext } from 'react';
import { withRuleEnginePanel } from '../../shared/withRuleEngine';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { PROPS_PANEL } from '../../utils/types';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';


function TableComponent(props: PROPS_PANEL) {

    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.items || [];

    const getChild = useCallback((child: any, index: string) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, [props]);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    {getChild(items[0], items[0].id)}
                </TableHead>
                <TableBody>
                    {items.map((row: any, index: number) => {
                        if (index === 0) {
                            return null;
                        }
                        else {
                            return (getChild(row, row.id));
                        }
                    })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default withRuleEnginePanel(TableComponent);