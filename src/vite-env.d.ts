/// <reference types="vite/client" />

type Format = 'Amount' | 'Percentage' | 'Time'
type Transaction = 'Investment' | 'Withdrawal'
type StepUp = 'Amount' | 'Percentage'
type Result = 'Cumulative' | 'Non-Cumulative'

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode
    format?: Format
}

interface InputSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: React.ReactNode
    options: { value?: string | number, label?: string }[]
}

interface OutputNumberProps {
    label: React.ReactNode
    value: number
    format?: Format
}
