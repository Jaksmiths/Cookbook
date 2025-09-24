import type { UnitItem } from "~/types";

export default function UnitDropdown({
    defaultVal, 
    units,
    name
} : {defaultVal: string, units: UnitItem[], name: string}) {

    console.log(units);

    return (
        <select 
            aria-label="Serving size amount"
            defaultValue={defaultVal}
            name={name}
            id={name}
        >
            {units.map((unit : UnitItem) => (
                <option value={unit.abbrev}>{unit.abbrev}</option>
            ))}
        </select> 
    );
}