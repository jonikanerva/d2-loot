import { useState } from 'react'

export type Event = React.ChangeEvent<HTMLSelectElement>

interface SourceDropdownProps {
  onChangeFunction: (e: Event) => void
  values: string[]
  defaultValue: string
}

const SourceDropdown: React.FC<SourceDropdownProps> = ({
  onChangeFunction,
  values,
  defaultValue,
}: SourceDropdownProps) => {
  const [selected, setSelected] = useState<string>(defaultValue)

  const onChange = (event: Event) => {
    onChangeFunction(event)
    setSelected(event.target.value)
  }

  return (
    <div>
      <label htmlFor="sources">Choose a source:</label>
      <select name="sources" id="sources" value={selected} onChange={onChange}>
        {values.map((value, key) => (
          <option key={key} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SourceDropdown
