export type Dispatch<T> = (x?: T) => any

export declare type IHandler = {
   dispatchClick: Dispatch<any>;
   dispatchAddItem: Dispatch<any>;
   dispatchBlur: Dispatch<any>;   
   dispatchChange: Dispatch<any>;
   dispatchFocus: Dispatch<any>;
   dispatchRemoveItem: Dispatch<any>;
};


