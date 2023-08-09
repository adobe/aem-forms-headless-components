import React, { Component } from 'react';

export const TabContext = React.createContext();

class TabContextProvider extends Component {
    
    state = {
        tabIndex: 0,
        firstName: '',
        lastName: '',
        defaultEditMode: false
    }
    incTabIndex = () => {
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })
    }
    decTabIndex = () => {
        this.setState({
            tabIndex: this.state.tabIndex - 1
        })
    }
    resetTabIndex = (val) => {
        this.setState({
            tabIndex: val
        })
    }
    updateFirstName = val => {
        this.setState({
            firstName: val
        })
    }
    updateLastName = val => {
        this.setState({
            lastName: val
        })
    }
    isEditMode = val => {
        this.setState({
            defaultEditMode: val
        })
    }
    render() {
        return (
            <TabContext.Provider 
                value={{...this.state, 
                        incTabIndex: this.incTabIndex, 
                        decTabIndex: this.decTabIndex,
                        resetTabIndex: this.resetTabIndex,
                        updateFirstName: this.updateFirstName,
                        updateLastName: this.updateLastName,
                        isEditMode: this.isEditMode
                }}
            >
                {
                    this.props.children
                }
            </TabContext.Provider>
        )
    }

}

export default TabContextProvider;


