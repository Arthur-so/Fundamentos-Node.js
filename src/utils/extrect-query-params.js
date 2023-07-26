export function extreactQueryParams(query) {
    return query.substr(1).split('&').reduce((queryParams, currentItem) => {

        const [key, value] = currentItem.split('=')

        queryParams[key] = value

        return queryParams
    }, {})
}