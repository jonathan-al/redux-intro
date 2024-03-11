import { combineReducers, createStore } from "redux"

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
}

const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  createdAt: "",
}

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit": // state domain/event name
      return {
        ...state,
        balance: +state.balance + +action.payload,
      }
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance + action.payload,
      }
    case "account/requestLoan":
      if (state.loan > 0) return state
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      }
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      }
    default:
      return state
  }
}

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      }
    case "customer/updateName":
      return { ...state, fullName: action.payload }
    default:
      return state
  }
}

/* ######################################## */
// Reducers
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
})

const store = createStore(rootReducer)

/* ######################################## */
// Without Action Creators
console.log(store.getState()) // {balance: 0, loan: 0, loanPurpose: ''}
store.dispatch({ type: "account/deposit", payload: 500 })
console.log(store.getState()) // {balance: 500, loan: 0, loanPurpose: ''}
store.dispatch({ type: "account/withdraw", payload: 200 })
console.log(store.getState()) // {balance: 700, loan: 0, loanPurpose: ''}
store.dispatch({
  type: "account/requestLoan",
  payload: { amount: 1000, purpose: "Buy a car" },
})
console.log(store.getState())
// {balance: 1700, loan: 1000, loanPurpose: 'Buy a car'}
store.dispatch({ type: "account/payLoan" })
console.log(store.getState()) // {balance: 700, loan: 0, loanPurpose: ''}

/* ######################################## */
// With Action Creators
function deposit(amount) {
  return { type: "account/deposit", payload: amount }
}
function withdraw(amount) {
  return { type: "account/withdraw", payload: amount }
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  }
}
function payLoan() {
  return { type: "account/payLoan" }
}
console.log(store.getState()) // {balance: 700, loan: 0, loanPurpose: ''}
store.dispatch(deposit(500))
console.log(store.getState()) // {balance: 1200, loan: 0, loanPurpose: ''}
store.dispatch(withdraw(200))
console.log(store.getState()) // {balance: 1400, loan: 0, loanPurpose: ''}
store.dispatch(requestLoan(1000, "Buy a cheap car"))
console.log(store.getState())
// {balance: 2400, loan: 1000, loanPurpose: 'Buy a cheap car'}
store.dispatch(payLoan())
console.log(store.getState()) // {balance: 1400, loan: 0, loanPurpose: ''}

function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName,
      nationalID,
      createdAt: new Date().toISOString(),
    },
  }
}
function updateName(fullName) {
  return { type: "customer/updateName", payload: fullName }
}

store.dispatch(createCustomer("Jonas Schmedtmann", "24343434"))
store.dispatch(deposit(250))
console.log(store.getState())
/* {
  "account": {
      "balance": 1650,
      "loan": 0,
      "loanPurpose": ""
  },
  "customer": {
      "fullName": "Jonas Schmedtmann",
      "nationalID": "24343434",
      "createdAt": "2024-03-10T04:27:18.998Z"
  }
} */

store.dispatch(updateName("Jonathan Alcantara"))
console.log(store.getState())
/* {
  "account": {
      "balance": 1650,
      "loan": 0,
      "loanPurpose": ""
  },
  "customer": {
      "fullName": "Jonathan Alcantara",
      "nationalID": "24343434",
      "createdAt": "2024-03-10T04:29:29.159Z"
  }
} */
