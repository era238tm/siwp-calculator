import significantWords from '../utilities/significantWords'
import './InputOutput.css'

function InputNumber(props: InputNumberProps) {
  return (
    <>
      <div className="io-block">
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        <span className={`io-wrapper ${props.format || ''}`}>
          <input
            type="number"
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            value={Number(props.value).toString()}
          />
        </span>

        {
          props.format === 'Amount' &&
          <span className="io-words">{
            significantWords(props.value as number)
          }</span>
        }
      </div>
    </>
  )
}

export default InputNumber
