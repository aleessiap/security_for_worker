export function searchedText(text:string, globalFilter: string): string {
    if(!text)
        return '';

    if(!globalFilter)
        return text;

    return text.replace(new RegExp(globalFilter, 'gi'), (match: any) => `<span class='font-bold bg-primary'>${match}</span>`)
}