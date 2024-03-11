import { connect } from "react-redux"

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

// balance is the prop of mapStateToProps
function BalanceDisplay({ balance }) {
  return <div className="balance">{formatCurrency(balance)}</div>
}

// map
function mapStateToProps(state) {
  return {
    balance: state.account.balance,
  }
}

// connect function will return a new function that receive BalanceDisplay as argument
export default connect(mapStateToProps)(BalanceDisplay)
