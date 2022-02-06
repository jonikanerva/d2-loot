import './SearchBar.css'
import { debounce } from 'lodash'
import React, { useState } from 'react'

type Event = React.ChangeEvent<HTMLInputElement>
type MouseEvent = React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>

interface SearchBarProps {
  searchChange: (searchTerm: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchChange,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const clearSearch = (event: MouseEvent) => {
    event.preventDefault()

    const searchField = document.getElementById(
      'searchField'
    ) as HTMLInputElement

    if (searchField !== null) {
      searchField.value = ''
    }

    setSearchTerm('')
    searchChange('')
  }

  const handleSearchOnChange = debounce((event: Event) => {
    const newSearch = event.target.value

    if (newSearch !== searchTerm) {
      setSearchTerm(event.target.value)
      searchChange(newSearch)
    }
  }, 200)

  return (
    <div className="searchArea">
      <input
        id="searchField"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        type="text"
        className="searchBox"
        onChange={handleSearchOnChange}
      />
      <a href="/" className="clearButton" onClick={(e) => clearSearch(e)}>
        ❌
      </a>
    </div>
  )
}

export default SearchBar
