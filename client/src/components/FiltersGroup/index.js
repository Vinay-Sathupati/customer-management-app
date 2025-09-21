import { useState } from "react"


import './index.css'

const FiltersGroup = props =>{
    const {
        cities, 
        states, 
        onClearFilters, 
        cityArr, 
        onSelectCities,
        stateArr,
        onSelectStates,
    } = props
    
    const [inputCityValue, setInputCityValue] = useState('')
    const [inputStateValue, setInputStateValue] = useState('')
    const [filteredCities, setFilteredCities] = useState(cities)
    const [filteredStates, setFilteredStates] = useState(states)
    

    const onClickClear = () =>{
        setInputCityValue('')
        setInputStateValue('')
        setFilteredCities(cities)
        setFilteredStates(states)
        onClearFilters()
    }

    const onSearchCities = event =>{
        const value = event.target.value.toLowerCase()
        setInputCityValue(value)
        const filtered = cities.filter(eachCity=> eachCity.name.toLowerCase().includes(value))
        setFilteredCities(filtered)
    }

    const onSearchStates = event =>{
        const value = event.target.value.toLowerCase()
        setInputStateValue(value)
        const filtered = states.filter(eachState=>eachState.state.toLowerCase().includes(value))
        setFilteredStates(filtered)
    }

    return (
        <div className='list-main-container'>
            <div className='filter-group-main-container'>
                <div className='clear-filter-container'>
                    <button type='button' className='clear-filter-button' onClick={onClickClear}>Clear All Filters</button>
                </div>
                <div className='filter-container'>
                    <div className='heading-and-search-container'>
                        <h1 className='filter-heading'>Filter by Cities</h1>
                        <input type='search' className='filter-search-input-element' placeholder='Search City' value={inputCityValue} onChange={onSearchCities}/>
                    </div>
                    <ul className='filter-unordered-list-container'>
                        {filteredCities.map((eachCity)=>(
                            <li key={eachCity.id} className='filter-list'>
                                <input 
                                    type='checkbox' 
                                    className='checkbox-input-element'
                                    checked={cityArr.includes(eachCity.name)} 
                                    onChange={()=>{onSelectCities(eachCity.name)}}   
                                />
                                {eachCity.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <hr className='filter-horizontal-line'/>
                <div className='filter-container'>
                    <div className='heading-and-search-container'>
                        <h1 className='filter-heading'>Filter by States</h1>
                        <input type='search' className='filter-search-input-element' placeholder='Search State' value={inputStateValue} onChange={onSearchStates}/>
                    </div>
                    <ul className='filter-unordered-list-container'>
                        {filteredStates.map(eachState=>(
                            <li key={eachState.id} className='filter-list'>
                                <input 
                                    type='checkbox' 
                                    className='checkbox-input-element'
                                    checked={stateArr.includes(eachState.state)}
                                    onChange={()=>{onSelectStates(eachState.state)}}
                                />
                                {eachState.state}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FiltersGroup