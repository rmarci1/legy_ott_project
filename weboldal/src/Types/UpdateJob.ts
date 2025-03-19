export interface UpdateJob{
    id?: number
    name?: string
    from?: string
    date?: Date
    img?: string
    description?: string
    max_attending?: number
    current_attending?: number
    address?: string
    profiles?: [{
        saveForLater?: boolean
        isApplied?: boolean
    }]
}