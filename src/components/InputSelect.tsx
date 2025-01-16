import './InputOutput.css'

function InputSelect(props: InputSelectProps) {
  return (
    <>
      <div className="io-block">
        {props.label && <label>{props.label}</label>}
        <select {...props as React.SelectHTMLAttributes<HTMLSelectElement>}>
          {props.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </>
  )
}

export default InputSelect
