export type SupportedLocale="en-MW"|"ny-MW";
export function appLocale(language?:string):SupportedLocale{return language?.toLowerCase().startsWith("ny")?"ny-MW":"en-MW";}
export function formatDate(value:string|number|Date,language?:string,options:Intl.DateTimeFormatOptions={dateStyle:"medium"}){return new Intl.DateTimeFormat(appLocale(language),options).format(new Date(value));}
export function formatCurrency(value:number|string,language?:string){return new Intl.NumberFormat(appLocale(language),{style:"currency",currency:"MWK",maximumFractionDigits:0}).format(Number(value));}
export function formatQuantity(value:number|string,unit:string,language?:string){return `${new Intl.NumberFormat(appLocale(language),{maximumFractionDigits:2}).format(Number(value))} ${unit}`;}
