import {useState, type JSX} from 'react'
import {useAppSelector, useAppDispatch} from '../app/App0002_hooks'
import {
    selectCount,
    increment,
    decrement,
    incrementByAmount,
    incrementIfOdd,
    incrementAsync,
    selectStatus,
} from '../features/counter/App0002_counterSlice'

export const Counter = (): JSX.Element => {
    const count = useAppSelector(selectCount)
    const dispatch = useAppDispatch()
    const [incrementAmount, setIncrementAmount] = useState('2')
    const incrementValue = Number(incrementAmount)
    const status = useAppSelector(selectStatus)

    return (
        <div>
            <div>
                <button
                    onClick={() => {
                        dispatch(decrement())
                    }}
                > - </button>
                {count}
                <button 
                    onClick={() => {
                        dispatch(increment())
                    }}
                > + </button>
            </div>
            <div>
                <input 
                    type="number" 
                    value={incrementAmount}
                    onChange={(e) => {
                        setIncrementAmount(e.target.value)
                    }}
                />
                <button
                    onClick={() => {
                        dispatch(incrementByAmount(incrementValue))
                    }}
                >Add Amount</button>
            </div>
            <div>
                <button
                disabled={status !== 'idle'}
                    onClick={() => {
                        dispatch(incrementAsync(incrementValue))
                    }}
                >Add Async</button>
                <button
                    onClick={() => {
                        dispatch(incrementIfOdd(incrementValue))
                    }}
                >Add if Odd</button>
            </div>
        </div>
    )
}