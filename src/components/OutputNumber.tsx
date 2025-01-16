import significantWords from '../utilities/significantWords'
import './InputOutput.css'

function OutputNumber(props: OutputNumberProps) {
  return (
    <>
      <div className="io-block">
        <label>{props.label}</label>
        <span className={`io-wrapper ${props.format || ''}`}>
          <output>{props.value.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
          })}</output>
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

export default OutputNumber
