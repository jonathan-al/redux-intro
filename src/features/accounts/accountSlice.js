import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload // mutate state
      state.isLoading = false
    },
    withdraw(state, action) {
      state.balance -= action.payload
    },
    requestLoan: {
      // in order to recieve more than 1 argument use prepare()
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        }
      },

      reducer(state, action) {
        if (state.loan > 0) return // we dont need to return the original state

        state.loan = action.payload.amount // we dont use , because is not a object
        state.loanPurpose = action.payload.purpose // we dont use : instead = because we are overriding
        state.balance = state.balance + action.payload.amount // return has not {}
      },
    },
    payLoan(state) {
      // pay attention to the order of the
      state.balance -= state.loan // this has to be in first place, before set loan to 0
      state.loan = 0
      state.loanPurpose = ""
    },
    convertingCurrency(state) {
      state.isLoading = true
    },
  },
})

// console.log(accountSlice)

export const { withdraw, requestLoan, payLoan } = accountSlice.actions

export default accountSlice.reducer
