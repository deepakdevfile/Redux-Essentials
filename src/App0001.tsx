// Redux Essentials, Part 1: Redux Overview and Concepts

import { useState } from "react";

// Redux Terms and Concepts
//  -State Management
function Counter (){
    const [counter, setCounter] = useState(0);

    const increment = () => {
        setCounter(prevCounter => prevCounter + 1)
    }
    
    return (
        <div>
            Value: {counter}
            <button onClick={increment}>
                Increment
            </button>
        </div>
    )
}

//  -Immutability
const obj = {a: {c: 3}, b: 2}
const obj2 = {...obj, a:{...obj.a, c: 42}}

//  -Terminology
//   -Actions
const addTodoAction = {
    type: 'todos/todoAdded',
    payload: 'Buy milk',
}

//   -Action creators
const addTodo = text => {
    return {
        type: 'todos/todoAdded',
        payload: text
    }
}

//   -Reducers
const initialState = { value: 0}
function counterReducer(state = initialState, action){
    if(action.type === 'counter/increment'){
        return {
            ...state, value: state.value + 1
        }
    }
    return state
}

//   -Store
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({reducer: counterReducer})
console.log(store.getState())

//   -Dispatch
store.dispatch({ type: 'counter/increment'})
console.log(store.getState())

const increment = () => {
    return {
        type: 'counter/increment'
    }
}
store.dispatch(increment())
console.log(store.getState())

//   -Selectors
const selectCounterValue = state => state.value
const currentValue = selectCounterValue(store.getState())
console.log(currentValue)


// Redux Application Data Flow