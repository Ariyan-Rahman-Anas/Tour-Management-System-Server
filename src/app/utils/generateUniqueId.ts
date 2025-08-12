export const generateUniqueId = (prefix:string) => {
    const randomString = Date.now() * Math.ceil(Math.random() * 500)
    return `${prefix}-${randomString}`
}