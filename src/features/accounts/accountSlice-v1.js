const initalStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
}

export default function accountReducer(
  state = initalStateAccount,
  action,
) {
  switch (action.type) {
    case "account/deposit": // state domain/event name
      return {
        ...state,
        balance: +state.balance + +action.payload,
        isLoading: false,
      }
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
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
    case "account/convertingCurrency":
      return { ...state, isLoading: true }
    default:
      return state
  }
}

// Action Creators
export function deposit(amount, currency) {
  if (currency === "USD") {
    return { type: "account/deposit", payload: amount }
  } else {
    // this is a middleware between dispatch and store
    // if we return a function here then Redux knows that this is the asynchronous action
    // that we want to execute before dispatching anything to the store

    return async function (dispatch, getState) {
      // as we are receiving distpatch, we can call it multiple times
      // but we dont have to call another dispatch for isLoading because we can change
      // isLoading in the reducer in action account/deposit
      dispatch({ type: "account/convertingCurrency" })

      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`,
      )
      const data = await res.json()
      const converted = data.rates.USD

      // as we are receiving distpatch, we can call it multiple times
      dispatch({ type: "account/deposit", payload: converted })
    }
  }
}
export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount }
}
export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  }
}
export function payLoan() {
  return { type: "account/payLoan" }
}
