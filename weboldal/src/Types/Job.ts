export interface Job{
    id: number
    name: string
    from: string
    date: Date
    img: string
    description: string
    max_attending: number
    current_attending: number
    address: string
    created: Date
    profiles: [{
        saveForLater: boolean
        isApplied: boolean
    }]
}