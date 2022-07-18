import { useReducer } from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate"
}

function reducer(state, { type, payload }) {
  switch(type){
    case ACTIONS.ADD_DIGIT: 
      if(state.overwrite === true){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if(payload.digit === "." && state.currentOperand.includes(".")){
        return state;
      }
      if(state.currentOperand === '0') {
        return {
          ...state,
          currentOperand: payload.digit,
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR: 
      return {}
    case ACTIONS.CHOOSE_OPERATION:
      if(state.previousOperand == null && state.currentOperand == null) {
        return {}
      }
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        }
      }
      
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE: 
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) {
        return {...state}
      }
      if(state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }

    default:
    
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  let prev = parseFloat(previousOperand);
  let current = parseFloat(currentOperand);
  let computation = "";

  if(isNaN(prev) || isNaN(current)) 
    return ""; 

  switch(operation){
    case '+' :
      computation = prev + current;
      break;
    case '-' : 
      computation = prev - current;
      break;
    case '*' :
      computation = prev * current;
      break; 
    case '÷' :
      computation = prev / current;
      break;  
    default: 
  }
  return computation.toString();
}

const INTEGER_FORMATTER = Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatter(operand) {
  if(operand == null) {
    return
  }
  const [integer, decimal] = operand.split('.');
  if(decimal == null) 
    return INTEGER_FORMATTER.format(integer);
  
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {

  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatter(previousOperand)}{operation}
        </div>
        <div className="current-operand">{formatter(currentOperand)}
        </div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
