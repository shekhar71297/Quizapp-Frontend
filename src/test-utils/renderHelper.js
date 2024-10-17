import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import createStore from "../store";

function render(
    ui,
    {
        reducer = {},
        preloadedState,
        store = createStore(
            preloadedState
        ),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                {children}
            </Provider>
        )
    }

    return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}


// re-export everything
export * from '@testing-library/react';

// override render method
export { render }