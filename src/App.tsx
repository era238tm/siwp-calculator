import { useState } from 'react'
import './App.css'

import InputNumber from './components/InputNumber.tsx'
import InputSelect from './components/InputSelect.tsx'
import OutputNumber from './components/OutputNumber.tsx'

function App() {
  const floor = (value: number, decimals: number) => {
    const factor = 10 ** decimals
    return Math.floor(value * factor) / factor
  }

  const frequencyOptions = [
    { value: 12, label: 'Monthly' },
    { value: 4, label: 'Quarterly' },
    { value: 2, label: 'Half-Yearly' },
    { value: 1, label: 'Yearly' },
  ]

  const [initialInvestment, setInitialInvestment] = useState(0)

  const [transactionType, setTransactionType] = useState('Investment' as Transaction)
  const [transactionAmount, setTransactionAmount] = useState(1000)
  const [transactionFrequency, setTransactionFrequency] = useState(12)
  const [transactionDuration, setTransactionDuration] = useState(10)

  const [stepUpType, setStepUpType] = useState('Amount' as StepUp)
  const [stepUp, setStepUp] = useState({ Amount: 0, Percentage: 0 })
  const [stepUpFrequency, setStepUpFrequency] = useState(1)

  const [holdingDuration, setHoldingDuration] = useState(transactionDuration)
  const [expectedGrowth, setExpectedGrowth] = useState(12)
  const [growthFrequency, setGrowthFrequency] = useState(transactionFrequency)

  const [taxOnWithdrawal, setTaxOnWithdrawal] = useState(12.5)

  const [outputFrequency, setOutputFrequency] = useState(1)
  const [resultType, setResultType] = useState('Cumulative' as Result)

  const transactedAmount = [0]
  const withdrawalTax = [0]
  const estimatedGain = [0]
  const maturityAmount = [initialInvestment]

  let stepUpAmount = 0;
  let unitRate = 1;
  let units = initialInvestment / unitRate;

  for (let i = 0; i < holdingDuration * 12; i++) {
    transactedAmount.push(0)
    withdrawalTax.push(0)
    estimatedGain.push(0)
    maturityAmount.push(0)

    if (i !== 0 && i % (12 / stepUpFrequency) === 0) {
      if (stepUpType === 'Amount') {
        stepUpAmount += stepUp.Amount
      }
      else {
        stepUpAmount += (transactionAmount + stepUpAmount) * stepUp.Percentage / 100
      }
    }

    if (i < transactionDuration * 12 && i % (12 / transactionFrequency) === 0) {
      transactedAmount[i + 1] = transactionAmount + stepUpAmount

      if (transactionType === 'Investment') {
        units += transactedAmount[i + 1] / unitRate
      }
      else {
        const effectiveUnitRate = unitRate - (unitRate - 1) * taxOnWithdrawal / 100
        let transactedUnits = transactedAmount[i + 1] / effectiveUnitRate

        if (transactedUnits > units) {
          transactedUnits = units
          transactedAmount[i + 1] = transactedUnits * effectiveUnitRate
        }

        withdrawalTax[i + 1] = transactedUnits * (unitRate - 1) * taxOnWithdrawal / 100
        units -= transactedUnits
      }

      if (units === 0 && (i + 1) % 12 === 0) {
        break
      }
    }

    if (i % (12 / growthFrequency) === 0) {
      const newRate = unitRate * (1 + (expectedGrowth / growthFrequency) / 100)

      estimatedGain[i + 1] = units * (newRate - unitRate)
      maturityAmount[i + 1] = units * newRate
      unitRate = newRate
    }
  }

  const totalTransactedAmount = transactedAmount.reduce((a, b) => a + b)
  const totalWithdrawalTax = withdrawalTax.reduce((a, b) => a + b)
  const totalEstimatedGain = estimatedGain.reduce((a, b) => a + b)

  const finalInvestedAmount = units
  const finalEstimatedGain = maturityAmount[maturityAmount.length - 1] - units

  let taxedAmount

  if (transactionType === 'Investment') {
    taxedAmount = totalEstimatedGain * taxOnWithdrawal / 100
  }
  else {
    taxedAmount = finalEstimatedGain * taxOnWithdrawal / 100
  }

  const finalMaturityAmount = finalInvestedAmount + finalEstimatedGain - taxedAmount

  for (let i = 1; i < transactedAmount.length; i++) {
    if (resultType === 'Cumulative' || (i - 1) % (12 / outputFrequency) !== 0) {
      transactedAmount[i] += transactedAmount[i - 1]
      withdrawalTax[i] += withdrawalTax[i - 1]
      estimatedGain[i] += estimatedGain[i - 1]
    }
  }

  const options = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }

  return (
    <>
      <main>
        <div id="input" className="container">
          <InputNumber
            id="initial-investment"
            label="Initial Investment"
            value={initialInvestment}
            min={0}
            format="Amount"
            onChange={(e) => setInitialInvestment(floor(+e.target.value, 2))}
          ></InputNumber>

          <InputNumber
            id="transaction-amount"
            label={
              <>
                <InputSelect
                  id="transaction-type"
                  value={transactionType}
                  options={[
                    { value: "Investment", label: "Investment" },
                    { value: "Withdrawal", label: "Withdrawal" },
                  ]}
                  onChange={(e) => setTransactionType(e.target.value as Transaction)}
                ></InputSelect>
                Amount
              </>
            }
            value={transactionAmount}
            min={0}
            format="Amount"
            onChange={(e) => setTransactionAmount(floor(+e.target.value, 2))}
          ></InputNumber>

          <InputSelect
            id="transaction-frequency"
            label={`${transactionType} Frequency`}
            value={transactionFrequency}
            options={frequencyOptions}
            onChange={(e) => {
              setTransactionFrequency(+e.target.value)

              if (+e.target.value < stepUpFrequency) {
                setStepUpFrequency(+e.target.value)
              }

              if (+e.target.value > growthFrequency) {
                setGrowthFrequency(+e.target.value)
              }
            }}
          ></InputSelect>

          <InputNumber
            id="transaction-duration"
            label={`${transactionType} Duration`}
            value={transactionDuration}
            min={1}
            format="Time"
            onChange={(e) => setTransactionDuration(floor(+e.target.value, 0))}
            onBlur={() => {
              if (transactionDuration > holdingDuration) {
                setHoldingDuration(transactionDuration)
              }
            }}
          ></InputNumber>

          <fieldset>
            <InputNumber
              id="stepup"
              label={
                <>
                  Step-Up
                  <InputSelect
                    id="stepup-type"
                    value={stepUpType}
                    options={[
                      { value: "Amount", label: "Amount" },
                      { value: "Percentage", label: "Percentage" },
                    ]}
                    onChange={(e) => setStepUpType(e.target.value as StepUp)}
                  ></InputSelect>
                </>
              }
              value={stepUp[stepUpType]}
              min={0}
              format={stepUpType}
              onChange={(e) => {
                setStepUp({ ...stepUp, [stepUpType]: floor(+e.target.value, 2) })
              }}
            ></InputNumber>

            <InputSelect
              id="stepup-frequency"
              label="Step-Up Frequency"
              value={stepUpFrequency}
              options={frequencyOptions}
              onChange={(e) => {
                setStepUpFrequency(+e.target.value)

                if (+e.target.value > transactionFrequency) {
                  setTransactionFrequency(+e.target.value)
                }

                if (+e.target.value > growthFrequency) {
                  setGrowthFrequency(+e.target.value)
                }
              }}
            ></InputSelect>
          </fieldset>

          <InputNumber
            id="holding-duration"
            label="Holding Duration"
            value={holdingDuration}
            min={1}
            format="Time"
            onChange={(e) => setHoldingDuration(floor(+e.target.value, 0))}
            onBlur={() => {
              if (holdingDuration < transactionDuration) {
                setTransactionDuration(holdingDuration)
              }
            }}
          ></InputNumber>

          <InputNumber
            id="expected-growth"
            label="Expected Growth (P.A.)"
            value={expectedGrowth}
            min={0}
            format="Percentage"
            onChange={(e) => setExpectedGrowth(floor(+e.target.value, 2))}
          ></InputNumber>

          <InputSelect
            id="growth-frequency"
            label="Growth Frequency"
            value={growthFrequency}
            options={frequencyOptions}
            onChange={(e) => {
              setGrowthFrequency(+e.target.value)

              if (+e.target.value < stepUpFrequency) {
                setStepUpFrequency(+e.target.value)
              }

              if (+e.target.value < transactionFrequency) {
                setTransactionFrequency(+e.target.value)
              }
            }}
          ></InputSelect>
          {
            <InputNumber
              id="tax-on-gain"
              label="Tax on Gain"
              value={taxOnWithdrawal}
              min={0}
              format="Percentage"
              onChange={(e) => setTaxOnWithdrawal(floor(+e.target.value, 2))}
            ></InputNumber>
          }
        </div>

        <div id="output" className="container">
          <OutputNumber
            label={`Total ${transactionType} Amount`}
            value={totalTransactedAmount}
            format="Amount"
          ></OutputNumber>

          {
            transactionType === 'Withdrawal' &&
            <OutputNumber
              label="Total Withdrawal Tax"
              value={totalWithdrawalTax}
              format="Amount"
            ></OutputNumber>
          }

          {
            transactionType === 'Investment' &&
            <OutputNumber
              label="Total Estimated Gain"
              value={totalEstimatedGain}
              format="Amount"
            ></OutputNumber>
          }

          {
            transactionType === 'Withdrawal' &&
            <div className="seperator"></div>
          }

          {
            transactionType === 'Withdrawal' &&
            <OutputNumber
              label="Final Invested Amount"
              value={finalInvestedAmount}
              format="Amount"
            ></OutputNumber>
          }

          {
            transactionType === 'Withdrawal' &&
            <OutputNumber
              label="Final Estimated Gain"
              value={finalEstimatedGain}
              format="Amount"
            ></OutputNumber>
          }

          {
            <OutputNumber
              label="Tax on Gain"
              value={taxedAmount}
              format="Amount"
            ></OutputNumber>
          }

          <OutputNumber
            label="Final Maturity Amount"
            value={finalMaturityAmount}
            format="Amount"
          ></OutputNumber>
        </div>
      </main>

      <aside>
        <InputSelect
          id="output-frequency"
          label="Output Frequency"
          value={outputFrequency}
          options={frequencyOptions}
          onChange={(e) => setOutputFrequency(+e.target.value)}
        ></InputSelect>

        <InputSelect
          id="result-type"
          label="Result Type"
          value={resultType}
          options={[
            { value: "Cumulative", label: "Cumulative" },
            { value: "Non-Cumulative", label: "Non-Cumulative" },
          ]}
          onChange={(e) => setResultType(e.target.value as Result)}
        ></InputSelect>

        <table>
          <thead>
            <tr>
              <th>Time (Year)</th>
              <th>{transactionType}</th>
              {
                transactionType === 'Withdrawal' &&
                <th>Withdrawal Tax</th>
              }
              <th>Estimated Gain</th>
              <th>Maturity Amount</th>
            </tr>
          </thead>

          <tbody>
            {
              transactedAmount.map((amount, index) => {
                if (index != 0 && index % (12 / outputFrequency) !== 0) {
                  return null
                }

                return (
                  <tr key={index}>
                    <td>{index % 12 === 0 && floor(index / 12, 0)}</td>
                    <td>{amount.toLocaleString('en-IN', options)}</td>
                    {
                      transactionType === 'Withdrawal' &&
                      <td>{withdrawalTax[index].toLocaleString('en-IN', options)}</td>
                    }
                    <td>{estimatedGain[index].toLocaleString('en-IN', options)}</td>
                    <td>{maturityAmount[index].toLocaleString('en-IN', options)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </aside>
    </>
  )
}

export default App
