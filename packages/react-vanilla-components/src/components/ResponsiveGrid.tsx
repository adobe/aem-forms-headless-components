import React, { useCallback, useContext } from 'react';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';
import { ITEM_PROPS, PROPS_PANEL } from '../utils/type';

const ResponsiveGrid = (props: PROPS_PANEL) => {
    //   @ts-ignore
    const context = useContext(FormContext);

    const getItemClassNames = (defaultClass: string, index: number) => {
        let className = `${defaultClass || ''}`;
        if(props[':itemsOrder'] && props.columnClassNames){
        className += ` ${props.columnClassNames[props[':itemsOrder'][index]]}`;
        }
        return className;
        };

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, context.mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : null;
    }, []);

    return (
        <>
            {props?.items.map((item: ITEM_PROPS, index: number) => (
                <div className={getItemClassNames(item.appliedCssClassNames as string, index)} key={item.id}>
                    {getChild(item, index)}
                </div>
            ))}
        </>
    );
};

export default ResponsiveGrid;

