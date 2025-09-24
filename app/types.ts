export type RecipeItem = {
    id : number;
    name : string; 
    serv : number; 
    servunit : string; 
    time : number; 
    timeunit : string;
    note : string;
};

export type UnitItem = {
    id : number;
    dimension: string;
    name : string;
    abbrev : string;
    multiple : number;
}